@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not on PATH.
  echo.
  echo This site needs Node.js LTS to run locally.
  echo I can try to install it with winget now.
  echo.
  choice /C YN /M "Install Node.js LTS with winget"
  if errorlevel 2 goto node_missing

  winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  if errorlevel 1 goto winget_failed

  echo.
  echo Node.js was installed. Close this window, open a new one, and run run-portfolio.bat again.
  pause
  exit /b 0
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found even though Node.js exists.
  echo Please reinstall Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing project packages...
  npm install
  if errorlevel 1 (
    echo.
    echo Package installation failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting the portfolio site...
echo It should open at http://127.0.0.1:5173/
echo Leave this window open while you use the site.
echo.

start "" "http://127.0.0.1:5173/"
npm run dev -- --host 127.0.0.1

pause
exit /b 0

:node_missing
echo.
echo Install Node.js LTS from https://nodejs.org/ and run this file again.
pause
exit /b 1

:winget_failed
echo.
echo Winget could not install Node.js automatically.
echo Install Node.js LTS from https://nodejs.org/ and run this file again.
pause
exit /b 1
