// Checks every translation against the English (locales/en-US): valid JSON, only keys English has,
// and the same {placeholders} in each text. Missing keys are allowed (they show in English) and listed.
// Run with: node scripts/check.mjs
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../locales/', import.meta.url))
const SOURCE = 'en-US'
const placeholders = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

let failed = false
const fail = (message) => {
  failed = true
  console.error(`✗ ${message}`)
}

function read(file) {
  try {
    const data = JSON.parse(readFileSync(file, 'utf8'))
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('it should be one { "key": "text" } object')
    for (const [key, value] of Object.entries(data)) if (typeof value !== 'string') throw new Error(`"${key}" should be text`)
    return data
  } catch (err) {
    fail(`${file}: not valid JSON (${err.message})`)
    return null
  }
}

const files = readdirSync(join(ROOT, SOURCE)).filter((f) => f.endsWith('.json'))
const english = Object.fromEntries(files.map((f) => [f, read(join(ROOT, SOURCE, f)) ?? {}]))

for (const language of readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== SOURCE).map((d) => d.name)) {
  let missing = 0
  let total = 0
  for (const file of files) {
    const path = join(ROOT, language, file)
    const source = english[file]
    total += Object.keys(source).length
    if (!existsSync(path)) {
      missing += Object.keys(source).length
      continue
    }
    const translated = read(path)
    if (!translated) continue
    for (const [key, text] of Object.entries(translated)) {
      if (!(key in source)) {
        fail(`${language}/${file}: "${key}" is not in English. Check the key is spelled the same, or remove it.`)
        continue
      }
      const want = placeholders(source[key])
      const have = placeholders(text)
      const list = (names) => (names.length ? names.map((p) => `{${p}}`).join(' ') : 'none')
      if (want.join() !== have.join()) fail(`${language}/${file}: "${key}" should have ${list(want)} as placeholders, but has ${list(have)}.`)
    }
    missing += Object.keys(source).filter((key) => !(key in translated)).length
  }
  const done = total ? Math.round(((total - missing) / total) * 100) : 100
  console.log(`${language}: ${done}% translated${missing ? ` (${missing} still in English)` : ''}`)
}

if (failed) process.exit(1)
console.log('✓ All translations check out.')
