.PHONY: help dev prod build stop logs clean ssl-init deploy update backup

DOMAIN   ?= synaping.com
APP_DIR  ?= /opt/neurolab-website
COMPOSE  := docker compose
PROD_CMD := $(COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml

## help : Show this help message
help:
	@echo "NeuroLab Website — Make targets"
	@echo ""
	@sed -n 's/^## //p' $(MAKEFILE_LIST) | column -t -s ':'

## ---Development---
## dev : Start full dev stack (frontend hot-reload + backend + mongo)
dev:
	$(COMPOSE) up --build

## dev-bg : Start dev stack in background
dev-bg:
	$(COMPOSE) up --build -d

## backend : Run backend only with hot-reload
backend:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## frontend : Run frontend dev server only
frontend:
	cd frontend && npm run dev

## install : Install all dependencies (frontend + backend)
install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

## ---Production---
## build : Build production Docker images
build:
	$(PROD_CMD) build --no-cache

## prod : Start production stack
prod:
	$(PROD_CMD) up -d --remove-orphans

## deploy : Full production deploy (clone/pull, build, start)
deploy:
	bash deploy.sh deploy

## update : Pull latest code and restart production stack
update:
	bash deploy.sh --update

## ssl-init : Issue Let's Encrypt certificate for $(DOMAIN)
ssl-init:
	bash deploy.sh --ssl-init

## ---Operations---
## stop : Stop all containers
stop:
	$(COMPOSE) down

## logs : Tail all service logs
logs:
	$(COMPOSE) logs -f

## logs-backend : Tail backend logs
logs-backend:
	$(COMPOSE) logs -f backend

## logs-nginx : Tail nginx logs
logs-nginx:
	$(COMPOSE) logs -f nginx

## ps : Show container statuses
ps:
	$(COMPOSE) ps

## restart : Restart all services
restart:
	$(COMPOSE) restart

## health : Check health of all services
health:
	@echo "=== Backend ==="
	@curl -sf http://localhost:8000/health || echo "FAILED"
	@echo "\n=== Nginx ==="
	@curl -sf http://localhost/nginx-health || echo "FAILED"

## ---Database---
## mongo-shell : Open interactive MongoDB shell
mongo-shell:
	$(COMPOSE) exec mongodb mongosh -u $${MONGO_USER} -p $${MONGO_PASSWORD} neurolab

## backup : Backup MongoDB data to ./backups/
backup:
	@mkdir -p ./backups
	$(COMPOSE) exec mongodb mongodump \
		--username=$${MONGO_USER} \
		--password=$${MONGO_PASSWORD} \
		--db=neurolab \
		--out=/tmp/backup
	$(COMPOSE) cp mongodb:/tmp/backup ./backups/backup-$$(date +%Y%m%d-%H%M%S)
	@echo "Backup saved to ./backups/"

## ---Cleanup---
## clean : Remove stopped containers and unused images
clean:
	docker system prune -f

## clean-all : Remove everything including volumes (DESTRUCTIVE!)
clean-all:
	@echo "WARNING: This will delete all data including MongoDB volumes!"
	@read -p "Type 'yes' to confirm: " confirm && [ "$$confirm" = "yes" ]
	$(COMPOSE) down -v --remove-orphans
	docker system prune -af

## ---Setup---
## env : Copy .env.example to .env
env:
	@if [ -f .env ]; then \
		echo ".env already exists. Delete it first if you want to reset."; \
	exits 1; \
	fi
	cp .env.example .env
	@echo ".env created. Edit it with your production values."
	@echo "Key values to set: MONGO_PASSWORD, SECRET_KEY, DOMAIN, SSL_EMAIL"
