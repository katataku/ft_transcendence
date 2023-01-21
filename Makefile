ALL:up

.PHONY:init
init:
	cd ./frontend && npm install
	cd ./backend && npm install

.PHONY:build
build:
	docker compose -f ./docker-compose.yml build

.PHONY:up
up:
	docker compose -f ./docker-compose.yml up

.PHONY:down
down:
	docker compose -f ./docker-compose.yml down

.PHONY:re
re:down remove_dummy_volume build up

.PHONY:prune
prune:
	docker system  prune
