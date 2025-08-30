@echo off
echo 正在启动 Prompt 管理器项目...
echo.

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 检测到未安装依赖，正在安装...
    npm install
    echo.
)

REM 启动开发服务器
echo 启动开发服务器...
start "" "http://localhost:3000"
npm run dev

REM 如果出现错误，暂停以便查看错误信息
if errorlevel 1 (
    echo.
    echo 启动失败，请检查错误信息。
    pause
)