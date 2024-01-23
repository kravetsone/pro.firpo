# Подготовка к конкурсу

Стек (только этот набор библиотек можно использовать) - NodeJS(express, cors, mysql2, typeorm, reflect-metadata, typescript, cross-env, dotenv, config)

TODO: улучшить кастомный костыле-валидатор для валидации path-params и порефачить

Пришлось написать свой недо-валидатор и асинк обёртку ибо express не умеет ловить ошибки в async функциях)))

DELETE {{host}} /room/{id} - ответ должен содержать 204 статус (NO CONTENT) и боди, но это невозможно
