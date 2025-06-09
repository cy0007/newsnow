#!/usr/bin/env node

/**
 * NewsNow 部署检查工具
 * 帮助验证部署配置是否正确
 */

import fs from 'fs'
import path from 'path'

console.log('🚀 NewsNow 部署配置检查工具\n')

// 检查基础文件
const requiredFiles = [
  'package.json',
  'wrangler.toml',
  'index.html',
  'vite.config.ts'
]

console.log('📋 检查必需文件...')
let allFilesExist = true

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - 缺失`)
    allFilesExist = false
  }
})

// 检查wrangler.toml配置
console.log('\n🔧 检查Cloudflare配置...')
if (fs.existsSync('wrangler.toml')) {
  const wranglerContent = fs.readFileSync('wrangler.toml', 'utf-8')
  
  if (wranglerContent.includes('database_id = ""')) {
    console.log('⚠️  wrangler.toml中database_id为空')
    console.log('   如需完整功能，请在Cloudflare创建D1数据库后填入ID')
  } else {
    console.log('✅ D1数据库配置已设置')
  }
}

// 检查环境变量文件
console.log('\n🔑 检查环境变量...')
if (fs.existsSync('.env.server')) {
  console.log('✅ 本地环境变量文件存在')
} else {
  console.log('ℹ️  本地环境变量文件不存在（生产环境不需要）')
}

console.log('\n📊 部署建议:')
if (allFilesExist) {
  console.log('✅ 基础文件检查通过，可以进行部署')
  console.log('💡 推荐使用方案一快速部署：')
  console.log('   1. 访问 https://dash.cloudflare.com/')
  console.log('   2. Pages → 创建项目 → 连接Git')
  console.log('   3. 构建命令: pnpm run build')
  console.log('   4. 输出目录: dist/output/public')
} else {
  console.log('❌ 请先解决上述文件缺失问题')
}

console.log('\n🆘 需要帮助？查看 deploy-guide.md 获取详细步骤！') 