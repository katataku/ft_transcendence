ENV_FILE=./config/.env_docker
DC_CMD=docker compose
#提出前に以下の行はコメントアウトすることでswaggerが起動しなくなる。
DC_PROFILE=--profile debug
DC_OPTIONS=--env-file ${ENV_FILE} -f ./docker-compose.yml ${DC_PROFILE}

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
create:wait-until-backend-ready
	docker exec -it back npm run typeorm:create

.PHONY:migrate
migrate:wait-until-backend-ready
	docker exec back npm run typeorm:run

.PHONY:revert
revert:wait-until-backend-ready
	docker exec -it back npm run typeorm:revert

.PHONY:cypress-run
cypress-run:wait-until-frontend-ready
	cd ./cypress && npm install && npm run cypress:run

BACKEND_HEALTH_CHECK_URL=localhost:3001/health
.PHONY:wait-until-backend-ready
wait-until-backend-ready:
	until (curl -i ${BACKEND_HEALTH_CHECK_URL} | grep "200 OK") do sleep 10; done

FRONTEND_HEALTH_CHECK_URL=localhost:3000
.PHONY:wait-until-frontend-ready
wait-until-frontend-ready:wait-until-backend-ready
	until (curl -i ${FRONTEND_HEALTH_CHECK_URL} | grep "200 OK") do sleep 10; done

.PHONY:spell-check
spell-check:
	npx --package cspell --yes cspell lint --config .vscode/cspell.json "." --gitignore --show-suggestions
