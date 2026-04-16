@echo off
REM NEXORA Alumni Hub - Startup Script
REM Simply run this file to start the entire project

echo.
echo ====================================
echo  NEXORA Alumni Hub - Starting Up
echo ====================================
echo.

echo Starting Backend Server...
echo Compiling and running: mvn spring-boot:run
echo.

cd /d C:\Users\ajaya\Documents\NEXORA\alumni-hub-api
mvn spring-boot:run

pause
