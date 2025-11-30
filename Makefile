.PHONY: install dev dev-api dev-web stop health

install:
	@echo "Installing workspace dependencies..."
	pnpm install

seed:
	@echo "Run DB seed script for apps/api (loads repo .env if present)..."
	node apps/api/scripts/seed.js

dev: 
	@echo "Starting all dev servers (web + api) via pnpm workspaces..."
	pnpm -w -r --parallel dev

dev-api:
	@echo "Starting API dev server..."
	pnpm --filter @safeops/api... dev

dev-web:
	@echo "Starting Web dev server..."
	pnpm --filter @safeops/web... dev

stop:
	@echo "Stopping dev servers (ports 3000 and 4000) and common dev processes..."
	./scripts/stop.sh || true

health:
	@echo "Checking API health..."
	curl -sS http://localhost:4000/health || echo 'no response'
