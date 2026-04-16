#!/bin/bash

# NEXORA Alumni Hub - Startup Script
# Usage: bash startup.sh

echo ""
echo "===================================="
echo " NEXORA Alumni Hub - Starting Up"
echo "===================================="
echo ""

echo "Starting Backend Server..."
echo "Compiling and running: mvn spring-boot:run"
echo ""

cd "$(dirname "$0")/alumni-hub-api"
mvn spring-boot:run
