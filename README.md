# Lode Runner

Lode Runner - это увлекательная аркадная игра, в которой игроки управляют персонажем, который должен собирать золото, избегая ловушек и врагов. Игра основана на классическом концепте, где нужно проявлять стратегию, ловкость и умение планировать свои действия.

## Оглавление

- [Описание](#описание)
- [Установка](#установка)
- [Запуск игры](#запуск-игры)
- [Игровой процесс](#игровой-процесс)
- [Технологии](#технологии)
- [Лицензия](#лицензия)

## Описание

Цель игры - собирать золото, избегая врагов и используя лестницы для перемещения между платформами. Игроки могут копать ямы, чтобы замедлить врагов и создать свои собственные пути.

## Установка

Для установки проекта вам потребуется [Node.js](https://nodejs.org/) и [npm](https://www.npmjs.com/).

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/belirofon/lode-runner.git
   cd lode-runner
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

## Запуск игры

Для запуска разработки используйте следующую команду:
```bash
npm run dev
```

Чтобы собрать проект для продакшн:
```bash
npm run build
```

Для предварительного просмотра собранной версии:
```bash
npm run preview
```

## Игровой процесс

- **Персонаж:** Игрок управляет персонажем с помощью стрелок или WASD.
- **Сбор золота:** Игрок должен собирать золотые монеты, которые появляются на уровне.
- **Лестницы:** Игроки могут использовать лестницы для перемещения между различными уровнями.
- **Враги:** Избегайте врагов, которые могут поймать вас.
- **Ямы:** Игроки могут копать ямы, чтобы временно остановить врагов.

## Технологии

- **TypeScript:** Используется для написания логики игры.
- **Vite:** Современный инструмент для сборки и разработки.
- **Canvas API:** Используется для рисования графики игры.

## Лицензия

Этот проект является частным и не предназначен для коммерческого использования. Вы можете свободно использовать его для обучения и личного пользования.
