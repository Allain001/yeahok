@echo off
cd /d "%~dp0"

echo Starting Linear Algebra Visualizer demo on http://127.0.0.1:3001
npm run dev -- --hostname 127.0.0.1 --port 3001
