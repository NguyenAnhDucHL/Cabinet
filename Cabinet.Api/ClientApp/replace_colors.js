const fs = require('fs')
const path = require('path')

const dir = './src'
const walk = (d) => {
  let results = []
  const list = fs.readdirSync(d)
  list.forEach((file) => {
    file = path.join(d, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file))
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file)
    }
  })
  return results
}

const files = walk(dir)
let changedFiles = 0

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8')
  let original = content

  // Replace Tailwind classes
  content = content.replace(/bg-\[#c8102e\](\/[0-9]+)?/g, (match, p1) =>
    p1 ? `bg-[var(--color-primary)]${p1}` : 'bg-[var(--color-primary)]'
  )
  content = content.replace(/text-\[#c8102e\](\/[0-9]+)?/g, (match, p1) =>
    p1 ? `text-[var(--color-primary)]${p1}` : 'text-[var(--color-primary)]'
  )
  content = content.replace(/border-\[#c8102e\](\/[0-9]+)?/g, (match, p1) =>
    p1 ? `border-[var(--color-primary)]${p1}` : 'border-[var(--color-primary)]'
  )
  content = content.replace(/ring-\[#c8102e\](\/[0-9]+)?/g, (match, p1) =>
    p1 ? `ring-[var(--color-primary)]${p1}` : 'ring-[var(--color-primary)]'
  )
  content = content.replace(/fill-\[#c8102e\]/g, 'fill-[var(--color-primary)]')

  content = content.replace(/bg-\[#a50[ed][27]5?\](\/[0-9]+)?/g, (match, p1) =>
    p1 ? `bg-[var(--color-sidebar-mid)]${p1}` : 'bg-[var(--color-sidebar-mid)]'
  )
  content = content.replace(/text-\[#a50[ed][27]5?\](\/[0-9]+)?/g, (match, p1) =>
    p1 ? `text-[var(--color-sidebar-mid)]${p1}` : 'text-[var(--color-sidebar-mid)]'
  )
  content = content.replace(/border-\[#a50[ed][27]5?\](\/[0-9]+)?/g, (match, p1) =>
    p1 ? `border-[var(--color-sidebar-mid)]${p1}` : 'border-[var(--color-sidebar-mid)]'
  )

  content = content.replace(/bg-\[#da020b\]/g, 'bg-[var(--color-primary)]')
  content = content.replace(/border-\[#da020b\]/g, 'border-[var(--color-primary)]')

  // Some stroke or inline styles
  content = content.replace(/stroke="#c8102e"/g, 'stroke="var(--color-primary)"')
  content = content.replace(/fill="#c8102e"/g, 'fill="var(--color-primary)"')

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8')
    changedFiles++
  }
})
console.log(`Updated ${changedFiles} files`)
