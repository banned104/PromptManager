import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 完整缓存清理工具');

const projectRoot = path.join(__dirname, '..');

// 要清理的目录和文件
const cacheTargets = [
  'node_modules/.cache',
  '.nuxt',
  '.output',
  'dist',
  '.vite',
  '.turbo'
];

// 清理缓存目录
for (const target of cacheTargets) {
  const targetPath = path.join(projectRoot, target);
  if (fs.existsSync(targetPath)) {
    try {
      if (fs.statSync(targetPath).isDirectory()) {
        fs.rmSync(targetPath, { recursive: true, force: true });
        console.log(`🗑️ 已删除目录: ${target}`);
      } else {
        fs.unlinkSync(targetPath);
        console.log(`🗑️ 已删除文件: ${target}`);
      }
    } catch (error) {
      console.warn(`⚠️ 无法删除 ${target}:`, error.message);
    }
  }
}

// 清理npm缓存
try {
  console.log('🧹 清理npm缓存...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ npm缓存清理完成');
} catch (error) {
  console.warn('⚠️ npm缓存清理失败:', error.message);
}

// 重新生成Prisma客户端
try {
  console.log('🔄 重新生成Prisma客户端...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: projectRoot });
  console.log('✅ Prisma客户端生成完成');
} catch (error) {
  console.error('❌ Prisma客户端生成失败:', error.message);
}

console.log('🎉 缓存清理完成！');
console.log('💡 建议使用 npm run dev-safe 启动应用');