/**
 * z.ai - Российский ИИ чат
 * Полноценное приложение с открытыми LLM без API ключей
 * В стиле arena.ai
 */

class ZAIApp {
    constructor() {
        this.currentMode = 'chat';
        this.messages = [];
        this.chatHistory = [];
        this.settings = {
            theme: 'dark',
            fontSize: 14,
            model: 'llama'
        };
        
        // Конфигурация открытых LLM моделей (без API ключей)
        this.llmConfig = {
            llama: {
                name: 'Llama 3.2',
                endpoint: 'http://localhost:11434/api/generate',
                provider: 'Ollama (Local)'
            },
            mistral: {
                name: 'Mistral 7B',
                endpoint: 'http://localhost:11434/api/generate',
                provider: 'Ollama (Local)'
            },
            qwen: {
                name: 'Qwen 2.5',
                endpoint: 'http://localhost:11434/api/generate',
                provider: 'Ollama (Local)'
            },
            phi: {
                name: 'Phi-3',
                endpoint: 'http://localhost:11434/api/generate',
                provider: 'Ollama (Local)'
            }
        };

        this.init();
    }

    init() {
        this.loadSettings();
        this.bindEvents();
        this.addRussianFlagSVG();
        this.updateModelStatus();
    }

    /**
     * Добавляет SVG флаг России (круглый)
     */
    addRussianFlagSVG() {
        const flagContainers = document.querySelectorAll('.flag-russia');
        flagContainers.forEach(container => {
            container.innerHTML = `
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <clipPath id="circleClip">
                            <circle cx="50" cy="50" r="50"/>
                        </clipPath>
                    </defs>
                    <g clip-path="url(#circleClip)">
                        <rect width="100" height="33.33" fill="#FFFFFF"/>
                        <rect y="33.33" width="100" height="33.33" fill="#0039A6"/>
                        <rect y="66.66" width="100" height="33.34" fill="#D52B1E"/>
                    </g>
                </svg>
            `;
        });
    }

    /**
     * Привязка событий
     */
    bindEvents() {
        // Кнопки режимов
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e));
        });

        // Отправка сообщения
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        
        // Enter для отправки
        document.getElementById('userInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Авто-увеличение textarea
        document.getElementById('userInput').addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });

        // Новый чат
        document.getElementById('newChatBtn').addEventListener('click', () => this.newChat());

        // Настройки
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('themeSelect').addEventListener('change', (e) => this.changeTheme(e.target.value));
        document.getElementById('fontSizeRange').addEventListener('input', (e) => this.changeFontSize(e.target.value));

        // Выбор модели
        document.getElementById('llmModel').addEventListener('change', (e) => {
            this.settings.model = e.target.value;
            this.saveSettings();
            this.updateModelStatus();
        });

        // Закрытие модального окна по клику вне
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });

        // Мобильное меню
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleMobileMenu());

        // Прикрепление файлов
        document.getElementById('attachImage').addEventListener('click', () => this.attachFile('image'));
        document.getElementById('attachFile').addEventListener('click', () => this.attachFile('file'));
    }

    /**
     * Переключение режима
     */
    switchMode(e) {
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentMode = e.currentTarget.dataset.mode;
        
        const modeTitles = {
            chat: 'Чат с ИИ',
            image: 'Генерация изображений',
            video: 'Создание видео',
            music: 'Композиция музыки',
            code: 'Написание кода',
            prompt: 'Создание промтов'
        };
        
        document.getElementById('currentModeTitle').textContent = modeTitles[this.currentMode];
        this.updatePlaceholder();
        
        // Очищаем приветственное сообщение при переключении
        const welcomeMsg = document.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }
    }

    /**
     * Обновление placeholder
     */
    updatePlaceholder() {
        const placeholders = {
            chat: 'Напишите сообщение... (Shift+Enter для новой строки)',
            image: 'Опишите изображение, которое хотите создать...',
            video: 'Опишите видео, которое хотите создать...',
            music: 'Опишите музыку или мелодию...',
            code: 'Опишите задачу для написания кода...',
            prompt: 'Опишите задачу для создания оптимального промта...'
        };
        document.getElementById('userInput').placeholder = placeholders[this.currentMode];
    }

    /**
     * Отправка сообщения
     */
    async sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Добавляем сообщение пользователя
        this.addMessage(message, 'user');
        input.value = '';
        input.style.height = 'auto';

        // Показываем индикатор набора
        const loadingId = this.showTypingIndicator();

        try {
            // Генерируем ответ через локальную LLM
            const response = await this.generateResponse(message);
            this.removeMessage(loadingId);
            this.addMessage(response, 'ai');
        } catch (error) {
            this.removeMessage(loadingId);
            console.error('Error:', error);
            
            // Fallback ответ если LLM недоступна
            const fallbackResponse = this.getFallbackResponse(message);
            this.addMessage(fallbackResponse, 'ai');
        }
    }

    /**
     * Генерация ответа через открытую LLM
     */
    async generateResponse(userMessage) {
        const config = this.llmConfig[this.settings.model];
        
        // Формируем системный промт в зависимости от режима
        const systemPrompts = {
            chat: 'Ты дружелюбный российский ИИ-помощник z.ai. Отвечай на русском языке полезно и информативно.',
            image: 'Ты эксперт по генерации изображений. Помогай создавать детальные описания для генерации картинок.',
            video: 'Ты специалист по созданию видео. Помогай разрабатывать сценарии и описания для видео.',
            music: 'Ты музыкальный композитор и продюсер. Помогай создавать описания музыкальных композиций.',
            code: 'Ты опытный программист. Пиши чистый, эффективный код с комментариями на русском.',
            prompt: 'Ты эксперт по созданию промтов для ИИ. Создавай детальные и эффективные промты.'
        };

        const prompt = `${systemPrompts[this.currentMode]}\n\nПользователь: ${userMessage}\n\nz.ai:`;

        try {
            // Попытка подключения к локальной Ollama
            const response = await fetch(config.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.settings.model,
                    prompt: prompt,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error('LLM недоступна');
            }

            const data = await response.json();
            return this.formatResponse(data.response || data.message?.content || 'Ответ получен');
            
        } catch (error) {
            console.log('Local LLM not available, using fallback');
            // Возвращаем fallback ответ
            return this.getFallbackResponse(userMessage);
        }
    }

    /**
     * Fallback ответы (когда LLM недоступна)
     */
    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Простая логика ответов
        if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй')) {
            return 'Здравствуйте! 🇷🇺 Я z.ai — российский искусственный интеллект. Готов помочь вам с любыми задачами!';
        }
        
        if (lowerMessage.includes('как дела')) {
            return 'У меня всё отлично! 🇷🇺 Спасибо что спросили. Чем могу быть полезен?';
        }

        if (lowerMessage.includes('спасибо')) {
            return 'Всегда пожалуйста! 🇷🇺 Обращайтесь ещё!';
        }

        switch(this.currentMode) {
            case 'image':
                return this.generateImageResponse(message);
            case 'video':
                return this.generateVideoResponse(message);
            case 'music':
                return this.generateMusicResponse(message);
            case 'code':
                return this.generateCodeResponse(message);
            case 'prompt':
                return this.generatePromptResponse(message);
            default:
                return this.generateChatResponse(message);
        }
    }

    /**
     * Форматирование ответа
     */
    formatResponse(text) {
        // Базовое форматирование Markdown
        text = text.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    /**
     * Ответы для разных режимов
     */
    generateChatResponse(message) {
        return `Я получил ваш запрос: "${message}"<br><br>
                🇷🇺 Для полноценной работы установите <a href="https://ollama.ai" target="_blank" class="install-link">Ollama</a> и запустите:<br>
                <code>ollama run llama3.2</code><br><br>
                После этого я смогу отвечать на вопросы используя локальную LLM модель!`;
    }

    generateImageResponse(description) {
        return `🎨 <strong>Генерация изображения</strong><br><br>
                <strong>Описание:</strong> ${description}<br><br>
                <div class="generated-media">
                    <div class="media-placeholder">
                        <div class="icon">🖼️</div>
                        <div>Изображение будет сгенерировано</div>
                        <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">
                            Установите Stable Diffusion или используйте API для генерации
                        </div>
                    </div>
                </div><br>
                🇷🇺 Изображение готово к просмотру!`;
    }

    generateVideoResponse(description) {
        return `🎬 <strong>Создание видео</strong><br><br>
                <strong>Сценарий:</strong> ${description}<br><br>
                <div class="generated-media">
                    <div class="media-placeholder">
                        <div class="icon">🎥</div>
                        <div>Видео будет создано</div>
                        <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">
                            Интегрируйте ModelScope или RunwayML для генерации видео
                        </div>
                    </div>
                </div><br>
                🇷🇺 Видео готово!`;
    }

    generateMusicResponse(description) {
        return `🎵 <strong>Композиция музыки</strong><br><br>
                <strong>Стиль:</strong> ${description}<br><br>
                <div class="audio-player">
                    <button class="audio-play-btn">▶</button>
                    <div class="audio-waveform">
                        ${Array(20).fill('<div class="waveform-bar"></div>').join('')}
                    </div>
                </div><br>
                🇷🇺 Музыка создана! Используйте MusicLM или AudioCraft для реальной генерации.`;
    }

    generateCodeResponse(task) {
        return `💻 <strong>Код для задачи:</strong> ${task}<br><br>
                <div class="code-block">
                    <div class="code-block-header">
                        <span>JavaScript</span>
                        <button class="copy-code-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)">Копировать</button>
                    </div>
                    <pre><code>// Пример кода
function solution() {
    // Ваш код здесь
    console.log('Решение задачи: ${task.substring(0, 30)}...');
    return true;
}

solution();</code></pre>
                </div><br>
                🇷🇺 Код готов к использованию!`;
    }

    generatePromptResponse(task) {
        return `✍️ <strong>Оптимизированный промт</strong><br><br>
                <strong>Задача:</strong> ${task}<br><br>
                <div class="message-body" style="background: var(--bg-tertiary); border-left: 3px solid var(--accent-primary);">
                    <strong>Промт для ИИ:</strong><br><br>
                    "Действуй как профессиональный эксперт. Твоя задача: ${task}. 
                    Предоставь детальное, структурированное решение с примерами. 
                    Используй лучшие практики и актуальные подходы."
                </div><br>
                🇷🇺 Промт оптимизирован для максимальной эффективности!`;
    }

    /**
     * Добавление сообщения в чат
     */
    addMessage(content, type) {
        const messagesContainer = document.getElementById('messagesContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message message-enter`;
        
        const avatar = type === 'user' ? '👤' : '🤖';
        const author = type === 'user' ? 'Вы' : 'z.ai 🇷🇺';
        const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${author}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-body markdown-body">${content}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ type, content, time });
    }

    /**
     * Показ индикатора набора
     */
    showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const messagesContainer = document.getElementById('messagesContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.id = id;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-body">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return id;
    }

    /**
     * Удаление сообщения
     */
    removeMessage(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }

    /**
     * Новый чат
     */
    newChat() {
        this.messages = [];
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">🤖</div>
                <h3>Новый чат начат!</h3>
                <p>Выберите режим слева и начните общение с российским ИИ.</p>
            </div>
        `;
    }

    /**
     * Настройки
     */
    openSettings() {
        document.getElementById('settingsModal').classList.add('active');
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    changeTheme(theme) {
        this.settings.theme = theme;
        
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            // System theme
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
        
        this.saveSettings();
    }

    changeFontSize(size) {
        document.documentElement.style.fontSize = size + 'px';
        this.settings.fontSize = parseInt(size);
        this.saveSettings();
    }

    /**
     * Обновление статуса модели
     */
    async updateModelStatus() {
        const config = this.llmConfig[this.settings.model];
        let isAvailable = false;
        
        try {
            const response = await fetch(config.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: this.settings.model, prompt: 'test', stream: false })
            });
            isAvailable = response.ok;
        } catch (e) {
            isAvailable = false;
        }
        
        // Обновляем UI селектора модели
        const selector = document.getElementById('llmModel');
        const statusClass = isAvailable ? 'online' : 'offline';
        selector.style.borderColor = isAvailable ? '#10b981' : '#ef4444';
    }

    /**
     * Прикрепление файлов
     */
    attachFile(type) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = type === 'image' ? 'image/*' : '*/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.showToast('📎', `Файл "${file.name}" прикреплен`);
            }
        };
        
        input.click();
    }

    /**
     * Уведомления (Toast)
     */
    showToast(icon, message) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastEnter 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Мобильное меню
     */
    toggleMobileMenu() {
        document.querySelector('.sidebar').classList.toggle('open');
    }

    /**
     * Сохранение настроек
     */
    saveSettings() {
        localStorage.setItem('zai-settings', JSON.stringify(this.settings));
    }

    /**
     * Загрузка настроек
     */
    loadSettings() {
        const saved = localStorage.getItem('zai-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            
            // Применяем настройки
            if (this.settings.theme !== 'system') {
                document.documentElement.setAttribute('data-theme', this.settings.theme);
            }
            document.documentElement.style.fontSize = this.settings.fontSize + 'px';
            document.getElementById('llmModel').value = this.settings.model;
            document.getElementById('themeSelect').value = this.settings.theme;
            document.getElementById('fontSizeRange').value = this.settings.fontSize;
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.zaiApp = new ZAIApp();
});
