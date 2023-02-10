ENV_FILE=./config/.env_docker
DC_CMD=docker compose
DC_OPTIONS=--env-file ${ENV_FILE} -f ./docker-compose.yml

include ${ENV_FILE}

ALL:up

.PHONY:init
init:
	cd ./frontend && npm install
	cd ./backend && npm install

.PHONY:clean
clean:
	rm -rf ./frontend/node_modules
	rm -rf ./backend/node_modules
	rm -rf ./db-data

.PHONY:build
build:
	${DC_CMD} ${DC_OPTIONS} build

.PHONY:up
up:
	mkdir -p ${DB_STORAGE_DIR}
	${DC_CMD} ${DC_OPTIONS} up

.PHONY:down
down:
	${DC_CMD} ${DC_OPTIONS} down

.PHONY:re
re:down build up

.PHONY:prune
prune:
	docker system  prune

.PHONY:lint
lint:
	cd ./frontend && npm run lint && npm run format
	cd ./backend && npm run lint && npm run format

.PHONY:back
back:
	mkdir -p ${DB_STORAGE_DIR}
	${DC_CMD} ${DC_OPTIONS} up db backend swagger