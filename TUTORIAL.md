# 🤖 Как запустить z.ai с локальной LLM

## Шаг 1: Установка Ollama

### Для macOS
```bash
brew install ollama
```
Или скачайте с [ollama.ai](https://ollama.ai)

### Для Windows
1. Скачайте установщик с [ollama.ai](https://ollama.ai)
2. Запустите установщик
3. Дождитесь завершения установки

### Для Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

## Шаг 2: Запуск Ollama

После установки Ollama запускается автоматически как фоновый сервис.

Проверьте работу:
```bash
ollama --version
```

## Шаг 3: Загрузка модели

Выберите одну из доступных моделей:

### Популярные модели:
```bash
# Llama 3.2 (рекомендуется)
ollama run llama3.2

# Mistral 7B
ollama run mistral

# Qwen 2.5 7B
ollama run qwen2.5

# Phi-3 Mini
ollama run phi3

# Gemma 2 9B
ollama run gemma2

# Code Llama 7B (для программирования)
ollama run codellama

# DeepSeek Coder
ollama run deepseek-coder

# Mixtral 8x7B
ollama run mixtral
```

## Шаг 4: Откройте z.ai

1. Откройте `index.html` в браузере
2. Выберите модель в выпадающем списке слева
3. Начните чат!

## 🔧 Для Vercel / Tatnet

Этот сайт оптимизирован для развертывания на Vercel:

1. Создайте репозиторий на GitHub
2. Подключите к Vercel
3. Сайт будет работать с fallback-ответами
4. Для полноценной работы нужен локальный Ollama

## 💡 Советы

- Модели работают **полностью локально** без интернета
- Требуется минимум 8GB RAM для небольших моделей
- Для больших моделей (34B+) рекомендуется 16-32GB RAM
- SSD значительно ускоряет загрузку моделей

## 📚 Ссылки

- [Ollama Documentation](https://ollama.ai/docs)
- [Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard)
- [GitHub Repository](https://github.com/OinktechLLC/z-ai)
