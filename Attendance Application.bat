@echo off
echo Starting Attendance Management System...

REM Navigate to the project directory
cd C:\xampp\htdocs\AttendanceManagementSystem

REM Check if node_modules exists
if not exist node_modules\ (
    echo Installing dependencies...
    npm install
)

REM Start the node server
echo Starting server...
start cmd /k "node server.js"

REM Wait for the server to start
echo Waiting for server to start...
timeout /t 5

REM Test if server is responding
powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:3888/test -UseBasicParsing; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"

if %errorlevel% equ 0 (
    echo Server started successfully
    start http://localhost:3888
) else (
    echo Server failed to start. Please check the command window for errors.
    pause
)
