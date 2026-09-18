#!/usr/bin/env node
// 在 content/ 目录的 markdown 中自动为中文与西文之间加空格（移植自 myblog）
// 用法：node scripts/format-spacing.js [目录]（默认 content）

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function addSpaceBetweenChineseAndEnglish(text) {
  text = text.replace(/([^\x00-\xff])([a-zA-Z0-9])/g, (match, chinese, english) => chinese + ' ' + english)
  text = text.replace(/([a-zA-Z0-9])([^\x00-\xff])/g, (match, english, chinese) => english + ' ' + chinese)
  return text
}

function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    let inCodeBlock = false
    let inFrontMatter = false
    let frontMatterCount = 0

    const processedLines = lines.map((line) => {
      const trimmed = line.trim()

      if (trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock
        return line
      }

      if (trimmed === '---') {
        frontMatterCount++
        if (frontMatterCount <= 2) {
          inFrontMatter = frontMatterCount === 1
          return line
        }
      }

      if (inFrontMatter || inCodeBlock) return line

      // 跳过行内代码中的内容
      if (line.includes('`')) {
        const parts = line.split('`')
        return parts.map((part, i) => (i % 2 === 1 ? part : addSpaceBetweenChineseAndEnglish(part))).join('`')
      }

      return addSpaceBetweenChineseAndEnglish(line)
    })

    const processed = processedLines.join('\n')
    if (processed !== content) {
      fs.writeFileSync(filePath, processed, 'utf8')
      console.log(`✅ 已处理: ${filePath}`)
      return true
    }
    return false
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error.message)
    return false
  }
}

function processDirectory(dirPath) {
  let count = 0
  for (const file of fs.readdirSync(dirPath)) {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      count += processDirectory(filePath)
    } else if (file.endsWith('.md')) {
      if (processMarkdownFile(filePath)) count++
    }
  }
  return count
}

function main() {
  const target = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '../content')
  if (!fs.existsSync(target)) {
    console.error(`❌ 目录不存在: ${target}`)
    process.exit(1)
  }
  console.log(`🚀 处理中英文间距: ${target}`)
  const count = processDirectory(target)
  console.log(`✨ 完成，共处理 ${count} 个文件`)
}

main()
