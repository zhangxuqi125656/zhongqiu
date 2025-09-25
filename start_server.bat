@echo off
REM 启动简单的HTTP服务器来运行中秋节答题网页
REM 需要Python环境

:check_python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 未找到Python环境，请先安装Python
    echo 或者您可以使用其他HTTP服务器来运行这个项目
    pause
    exit /b 1
)

:start_server
setlocal
set PORT=8000
echo 正在启动HTTP服务器，端口：%PORT%
echo 请在浏览器中访问：http://localhost:%PORT%
python -m http.server %PORT%
pause
endlocal