#!/usr/bin/env powershell
# NEXORA Alumni Hub - Complete Startup Script
# This script starts everything: Backend + Frontend

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   NEXORA Alumni Hub - Starting Complete Project   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if backend is already running
$backendRunning = netstat -ano 2>$null | Select-String "8081" | Measure-Object | Select-Object -ExpandProperty Count
if ($backendRunning -gt 0) {
    Write-Host "⚠️  Port 8081 already in use!" -ForegroundColor Yellow
    $choice = Read-Host "Kill existing process? (y/n)"
    if ($choice -eq 'y') {
        $pid = (netstat -ano | Select-String "8081" | Select-Object -First 1).Line -split '\s+' | Select-Object -Last 1
        taskkill /PID $pid /F 2>$null
        Start-Sleep -Seconds 2
        Write-Host "✅ Old process stopped" -ForegroundColor Green
    }
}

Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Write-Host "   Running: mvn spring-boot:run" -ForegroundColor Gray
Write-Host "   Location: C:\Users\ajaya\Documents\NEXORA\alumni-hub-api" -ForegroundColor Gray
Write-Host ""

# Start backend
Push-Location "C:\Users\ajaya\Documents\NEXORA\alumni-hub-api"
mvn spring-boot:run

Pop-Location
