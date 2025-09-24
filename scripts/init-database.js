import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'prisma', 'dev.db');
const PRISMA_DIR = path.join(__dirname, '..', 'prisma');

console.log('🚀 数据库初始化工具');
console.log('📍 数据库路径:', DB_PATH);

// 确保prisma目录存在
if (!fs.existsSync(PRISMA_DIR)) {
  fs.mkdirSync(PRISMA_DIR, { recursive: true });
  console.log('📁 创建prisma目录');
}

// 检查数据库是否存在且正常
let needsRecreation = false;

if (fs.existsSync(DB_PATH)) {
  console.log('✅ 数据库文件存在，检查完整性...');
  try {
    // 测试数据库完整性
    execSync(`sqlite3 "${DB_PATH}" "PRAGMA integrity_check;"`, { stdio: 'pipe' });
    
    // 测试表结构
    const tables = execSync(`sqlite3 "${DB_PATH}" ".tables"`, { encoding: 'utf8' });
    if (!tables.includes('prompts')) {
      console.log('❌ prompts表不存在，需要重建');
      needsRecreation = true;
    } else {
      console.log('✅ 数据库正常，无需重建');
      console.log('🎉 数据库初始化完成！');
      process.exit(0);
    }
  } catch (error) {
    console.log('❌ 数据库损坏，需要重建:', error.message);
    needsRecreation = true;
  }
} else {
  console.log('❌ 数据库文件不存在，需要创建');
  needsRecreation = true;
}

// 只有在需要时才删除和重建
if (needsRecreation) {
  try {
    const files = fs.readdirSync(PRISMA_DIR);
    files.forEach(file => {
      if (file.endsWith('.db') || file.endsWith('.db-wal') || file.endsWith('.db-shm')) {
        const filePath = path.join(PRISMA_DIR, file);
        fs.unlinkSync(filePath);
        console.log(`🗑️ 删除损坏的文件: ${file}`);
      }
    });
  } catch (error) {
    console.log('⚠️ 清理文件时出现错误:', error.message);
  }
}

// 只有在需要重建时才创建数据库
if (!needsRecreation) {
  console.log('🎉 数据库初始化完成！');
  process.exit(0);
}

// 创建新的数据库
try {
  console.log('🔨 重建数据库...');
  
  // 分步执行SQL命令
  execSync(`sqlite3 "${DB_PATH}" "PRAGMA journal_mode=DELETE;"`, { stdio: 'pipe' });
  execSync(`sqlite3 "${DB_PATH}" "PRAGMA foreign_keys=ON;"`, { stdio: 'pipe' });
  
  // 创建prompts表
  const createPromptsSQL = 'CREATE TABLE IF NOT EXISTS prompts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, image_path TEXT, images TEXT, tags TEXT, highlights TEXT, is_favorited BOOLEAN DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);';
  
  execSync(`sqlite3 "${DB_PATH}" "${createPromptsSQL}"`, { stdio: 'pipe' });
  console.log('✅ prompts表创建成功');
  
  // 创建迁移表
  const createMigrationsSQL = 'CREATE TABLE IF NOT EXISTS _prisma_migrations (id TEXT PRIMARY KEY NOT NULL, checksum TEXT NOT NULL, finished_at DATETIME, migration_name TEXT NOT NULL, logs TEXT, rolled_back_at DATETIME, started_at DATETIME NOT NULL DEFAULT current_timestamp, applied_steps_count INTEGER NOT NULL DEFAULT 0);';
  
  execSync(`sqlite3 "${DB_PATH}" "${createMigrationsSQL}"`, { stdio: 'pipe' });
  console.log('✅ 迁移表创建成功');
  
  // 验证数据库
  const result = execSync(`sqlite3 "${DB_PATH}" "SELECT COUNT(*) FROM prompts;"`, { encoding: 'utf8' });
  console.log('✅ 数据库验证成功，记录数:', result.trim());
  
  // 检查完整性
  const integrity = execSync(`sqlite3 "${DB_PATH}" "PRAGMA integrity_check;"`, { encoding: 'utf8' });
  console.log('✅ 完整性检查:', integrity.trim());
  
} catch (error) {
  console.error('❌ 数据库创建失败:', error.message);
  process.exit(1);
}

console.log('🎉 数据库初始化完成！');