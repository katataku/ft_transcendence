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

.PHONY:fclean
fclean: down clean prune

.PHONY:build
build:
	${DC_CMD} ${DC_OPTIONS} build

.PHONY:up
up:
	mkdir -p ${DB_STORAGE_DIR}
	${DC_CMD} ${DC_OPTIONS} up

.PHONY:up-d
up-d:
	mkdir -p ${DB_STORAGE_DIR}
	${DC_CMD} ${DC_OPTIONS} up -d

.PHONY:down
down:
	${DC_CMD} ${DC_OPTIONS} down

.PHONY:re
re:down build up

.PHONY:prune
prune:
	docker system  prune -a

.PHONY:lint
lint:
	cd ./frontend && npm run lint && npm run format
	cd ./backend && npm run lint && npm run format

.PHONY:lint-dockerfile
lint-dockerfile:
	docker run --rm -i hadolint/hadolint hadolint - --style 'DL3007' < ./backend/Dockerfile
	docker run --rm -i hadolint/hadolint hadolint - --style 'DL3007' < ./frontend/Dockerfile

.PHONY:back
back:
	mkdir -p ${DB_STORAGE_DIR}
	${DC_CMD} ${DC_OPTIONS} up db backend swagger swagger-editor

.PHONY:create
create:
	docker exec -it back npm run typeorm:create

.PHONY:migrate
migrate:
	docker exec -it back npm run typeorm:run

.PHONY:migrate-without-tty
migrate-without-tty:
	docker exec back npm run typeorm:run

.PHONY:revert
revert:
	docker exec -it back npm run typeorm:revert

.PHONY:cypress-run
cypress-run:
	cd ./cypress && npm install && npm run cypress:run

.PHONY:wait-until-server-start
wait-until-server-start:
	chmod +x scripts/wait-until-curl-OK.sh
	scripts/wait-until-curl-OK.sh

.PHONY:wait-and-cypress-run
wait-and-cypress-run: wait-until-server-start cypress-run

