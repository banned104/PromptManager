@echo off
echo 🚀 安全启动 Prompt Manager
echo.

echo 🔍 检查数据库文件...
if not exist "prisma\dev.db" (
    echo ❌ 数据库文件不存在，正在创建...
    sqlite3 "prisma\dev.db" "CREATE TABLE prompts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, image_path TEXT, images TEXT, tags TEXT, highlights TEXT, is_favorited BOOLEAN DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);"
    echo ✅ 数据库文件创建完成
) else (
    echo ✅ 数据库文件存在
)

echo.
echo 🔄 生成 Prisma 客户端...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Prisma 客户端生成失败
    pause
    exit /b 1
)

echo.
echo 🌐 启动开发服务器...
call npm run dev

pause