import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'prisma', 'dev.db');

console.log('🔧 数据库健康检查和修复工具');
console.log('📍 数据库路径:', DB_PATH);

// 检查数据库文件是否存在
if (!fs.existsSync(DB_PATH)) {
  console.log('❌ 数据库文件不存在，正在创建...');
  createDatabase();
} else {
  console.log('✅ 数据库文件存在，检查完整性...');
  
  try {
    // 测试数据库完整性
    execSync(`sqlite3 "${DB_PATH}" "PRAGMA integrity_check;"`, { stdio: 'pipe' });
    console.log('✅ 数据库完整性检查通过');
    
    // 测试表结构
    const tables = execSync(`sqlite3 "${DB_PATH}" ".tables"`, { encoding: 'utf8' });
    if (!tables.includes('prompts')) {
      console.log('❌ prompts表不存在，正在重建...');
      createDatabase();
    } else {
      console.log('✅ 数据库表结构正常');
    }
  } catch (error) {
    console.log('❌ 数据库损坏，正在修复...');
    console.error('错误详情:', error.message);
    createDatabase();
  }
}

function createDatabase() {
  try {
    // 删除损坏的数据库文件
    if (fs.existsSync(DB_PATH)) {
      fs.unlinkSync(DB_PATH);
      console.log('🗑️ 已删除损坏的数据库文件');
    }
    
    // 创建新的数据库
    const createSQL = `
      PRAGMA journal_mode=WAL;
      PRAGMA foreign_keys=ON;
      
      CREATE TABLE prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image_path TEXT,
        images TEXT,
        tags TEXT,
        highlights TEXT,
        is_favorited BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE _prisma_migrations (
        id TEXT PRIMARY KEY NOT NULL,
        checksum TEXT NOT NULL,
        finished_at DATETIME,
        migration_name TEXT NOT NULL,
        logs TEXT,
        rolled_back_at DATETIME,
        started_at DATETIME NOT NULL DEFAULT current_timestamp,
        applied_steps_count INTEGER NOT NULL DEFAULT 0
      );
    `;
    
    execSync(`sqlite3 "${DB_PATH}" "${createSQL}"`, { stdio: 'inherit' });
    console.log('✅ 数据库创建成功');
    
    // 重新生成Prisma客户端
    console.log('🔄 重新生成Prisma客户端...');
    execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('✅ Prisma客户端生成成功');
    
  } catch (error) {
    console.error('❌ 数据库创建失败:', error.message);
    process.exit(1);
  }
}

console.log('🎉 数据库修复完成！');