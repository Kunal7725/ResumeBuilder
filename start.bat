@echo off
echo Starting ResumeAI...
start "Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 2 >nul
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo Both servers starting...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
