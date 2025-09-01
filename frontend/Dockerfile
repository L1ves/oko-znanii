FROM node:20-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Продакшн образ
FROM node:20-alpine AS runner

WORKDIR /app

# Копирование необходимых файлов из builder
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Порт
EXPOSE 3000

# Запуск приложения
CMD ["node", "server.js"] 