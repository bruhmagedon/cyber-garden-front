# cyber-garden-front-invest

## Docker

### Сборка
```bash
docker build --build-arg VITE_API_BASE_URL=http://138.124.14.177:8080/api -t cyber-garden-front .
```

### Запуск
```bash
docker run -d -p 80:80 cyber-garden-front
```

Приложение будет доступно по адресу `http://localhost`.