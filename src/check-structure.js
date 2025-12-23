// 创建项目结构检查脚本 check-structure.js
const fs = require('fs')
const path = require('path')

const requiredFiles = [
  'src/style.css',
  'src/App.vue',
  'src/main.ts',
  'src/router/index.ts',
  'src/views/login/index.vue',
  'src/views/register/index.vue',
  'src/views/Dashboard.vue',
  'src/components/layout/index.vue',
]

console.log('检查项目结构：')
requiredFiles.forEach((file) => {
  const fullPath = path.resolve(__dirname, file)
  const exists = fs.existsSync(fullPath)
  console.log(`${exists ? '✅' : '❌'} ${file} ${exists ? '存在' : '缺失'}`)

  if (!exists) {
    // 如果是目录，创建目录
    const dir = path.dirname(fullPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`   已创建目录: ${dir}`)
    }
  }
})
