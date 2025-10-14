@echo off
echo.
echo ========================================
echo   Star Atlas Command Nexus Server
echo ========================================
echo.
echo Starting HTTP server on port 8000...
echo.
echo Open your browser to:
echo   http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python -m http.server 8000
