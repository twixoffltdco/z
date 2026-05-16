# 🇷🇺 z.ai - Российский ИИ чат в стиле arena.ai

Полноценное веб-приложение чата с искусственным интеллектом, работающее на **открытых LLM моделях без API ключей**.

![z.ai](https://img.shields.io/badge/z.ai-Российский%20ИИ-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![LLM](https://img.shields.io/badge/LLM-Open%20Source-orange)

## ✨ Возможности

- 💬 **Текстовый чат** - общение на любые темы
- 🎨 **Генерация изображений** - создание картинок по описанию
- 🎬 **Создание видео** - генерация видеоконтента
- 🎵 **Композиция музыки** - создание музыкальных композиций
- 💻 **Написание кода** - помощь в программировании
- ✍️ **Создание промтов** - оптимизация запросов для ИИ

## 🔓 Открытые LLM модели (БЕЗ API ключей)

Приложение поддерживает следующие открытые модели через локальный запуск:

| Модель | Описание | Размер |
|--------|----------|--------|
| **Llama 3.2** | Meta's latest open model | 3B-11B |
| **Mistral 7B** | Efficient French model | 7B |
| **Qwen 2.5** | Alibaba's open model | 7B-72B |
| **Phi-3** | Microsoft's small model | 3.8B |

## 🚀 Быстрый старт

### 1. Установка Ollama (для локальных LLM)

```bash
# macOS / Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows - скачайте с https://ollama.ai
```

### 2. Загрузка модели

```bash
# Выберете одну из моделей
ollama run llama3.2
ollama run mistral
ollama run qwen2.5
ollama run phi3
```

### 3. Запуск приложения

Просто откройте `index.html` в браузере или используйте локальный сервер:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000
```

Перейдите по адресу `http://localhost:8000`

## 📁 Структура проекта

```
z.ai/
├── index.html          # Главная страница
├── css/
│   ├── styles.css      # Основные стили
│   └── arena-theme.css # Тема в стиле arena.ai
├── js/
│   └── app.js          # Логика приложения
├── assets/             # Ресурсы (иконки, изображения)
└── README.md           # Документация
```

## 🎨 Особенности дизайна

- **Тёмная тема** в стиле arena.ai
- **Круглый SVG флаг России** 🇷🇺
- **Адаптивный дизайн** для мобильных устройств
- **Плавные анимации** и переходы
- **Поддержка светлой темы**

## ⚙️ Настройки

- Выбор темы оформления (тёмная/светлая/системная)
- Регулировка размера шрифта
- Выбор LLM модели
- Сохранение настроек в localStorage

## 🔧 Интеграция с другими сервисами

### Генерация изображений
Для реальной генерации изображений подключите:
- [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI)

### Генерация видео
- [ModelScope](https://www.modelscope.cn/)
- [RunwayML](https://runwayml.com/)

### Генерация музыки
- [MusicLM](https://google-research.github.io/seanet/musiclm/examples/)
- [AudioCraft](https://github.com/facebookresearch/audiocraft)

## 🌐 Браузеры

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Мобильная версия

Приложение полностью адаптировано для мобильных устройств:
- Сворачиваемая боковая панель
- Оптимизированный ввод текста
- Сенсорное управление

## 🔒 Безопасность

- Все данные обрабатываются локально
- Нет отправки данных на внешние сервера
- Open Source код - полная прозрачность

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте ветку (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📝 Лицензия

MIT License - свободное использование и модификация

## 🇷🇺 О проекте

**z.ai** - это российский проект с открытым исходным кодом, созданный для демонстрации возможностей открытых LLM моделей без необходимости использования платных API ключей.

### Преимущества:
- 🔓 Полностью открытый код
- 🚫 Никаких API ключей
- 🇷🇺 Российская разработка
- ⚡ Быстрая работа
- 🎨 Современный дизайн

## 📞 Контакты

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: example@zai.ru

---

**Сделано с ❤️ в России**

🇷🇺🇷🇺🇷🇺
