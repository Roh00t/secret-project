#!/usr/bin/env bash
# Stop helper for SafeOps dev servers
set -eu

echo "Stopping services listening on ports 3000 and 4000 (if any)..."

# Kill processes listening on ports (if any)
for port in 4000 3000; do
  pids=$(lsof -ti tcp:${port} || true)
  if [ -n "${pids}" ]; then
    echo "Killing PIDs on port ${port}: ${pids}"
    echo ${pids} | xargs -r kill
  fi
done

echo "Also attempting to pkill common dev processes (next, ts-node-dev)..."
pkill -f "next dev" || true
pkill -f "ts-node-dev" || true
pkill -f "node .*apps/web" || true
pkill -f "node .*apps/api" || true

echo "Stopped (best-effort)."
