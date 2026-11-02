#!/bin/bash
set -e

echo "=== DEPLOY NAHWU STUDIO WORKER KE VPS ==="
cd /root/projects/pinterbacaarab

echo "[1/4] Git checkout working tree..."
git checkout -f master

echo "[2/4] Install pnpm dependencies..."
pnpm install --frozen-lockfile=false

echo "[3/4] Build shared & worker packages..."
pnpm --filter "@pinterbacaarab/shared" run build
pnpm --filter "@pinterbacaarab/worker" run build

echo "[4/4] Setup & Restart systemd service..."
cp deploy/nahwu-worker.service /etc/systemd/system/nahwu-worker.service
systemctl daemon-reload
systemctl enable nahwu-worker
systemctl restart nahwu-worker
systemctl status nahwu-worker --no-pager

echo "=== DEPLOY WORKER BERHASIL ==="
