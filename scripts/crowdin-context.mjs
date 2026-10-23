// Sends what translators need to know to Crowdin, from scripts/context.json: each file's context, each
// string's note and character limit, and the screenshots in screenshots/ tagged with the strings they show.
// Run again after adding English strings or screenshots; it updates what is there.
//
//   CROWDIN_TOKEN=... node scripts/crowdin-context.mjs
//
// The token is a personal access token (Crowdin > Account Settings > API > New Token, with the
// Projects scope). The project is found by its address, modwarden; set CROWDIN_PROJECT to use another.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const API = 'https://api.crowdin.com/api/v2'
const token = process.env.CROWDIN_TOKEN
if (!token) {
  console.error('Set CROWDIN_TOKEN to a Crowdin personal access token first.')
  process.exit(1)
}
const context = JSON.parse(readFileSync(join(ROOT, 'scripts', 'context.json'), 'utf8'))

async function call(method, path, body, headers = { 'content-type': 'application/json' }) {
  const res = await fetch(`${API}${path}`, { method, headers: { authorization: `Bearer ${token}`, ...headers }, body: body === undefined ? undefined : headers['content-type'] === 'application/json' ? JSON.stringify(body) : body })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${path} failed (${res.status}): ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : {}
}
/** Every item of a list, page by page. */
async function list(path) {
  const items = []
  for (let offset = 0; ; offset += 500) {
    const page = await call('GET', `${path}${path.includes('?') ? '&' : '?'}limit=500&offset=${offset}`)
    items.push(...page.data.map((d) => d.data))
    if (page.data.length < 500) return items
  }
}
const replace = (fields) => Object.entries(fields).map(([key, value]) => ({ op: 'replace', path: `/${key}`, value }))

const want = process.env.CROWDIN_PROJECT ?? 'modwarden'
const project = (await list('/projects')).find((p) => p.identifier === want || String(p.id) === want)
if (!project) throw new Error(`No Crowdin project "${want}" found for this token.`)
const pid = project.id
console.log(`Project: ${project.name} (${pid})`)

// Each file's context, and each string's note and limit.
const stringIds = new Map()
for (const file of await list(`/projects/${pid}/files`)) {
  const about = context.files[file.name]
  if (!about) continue
  if (file.context !== about) await call('PATCH', `/projects/${pid}/files/${file.id}`, replace({ context: about }))
  let changed = 0
  for (const s of await list(`/projects/${pid}/strings?fileId=${file.id}`)) {
    // Crowdin quotes a key with dots in it ("nav.overview"), so it is not read as nested.
    const key = s.identifier.replace(/^"(.*)"$/, '$1')
    stringIds.set(key, s.id)
    const meta = context.strings[key]
    if (!meta) {
      console.warn(`  ${file.name}: no context for ${key}; add it to scripts/context.json`)
      continue
    }
    if (s.context === meta.note && s.maxLength === meta.limit) continue
    await call('PATCH', `/projects/${pid}/strings/${s.id}`, replace({ context: meta.note, maxLength: meta.limit }))
    changed++
  }
  console.log(`${file.name}: file context set, ${changed} string(s) updated`)
}

// Screenshots: uploaded (or replaced) by name, and tagged with the strings they show.
const shotsDir = join(ROOT, 'screenshots')
const existing = new Map((await list(`/projects/${pid}/screenshots`)).map((s) => [s.name, s.id]))
for (const [name, keys] of Object.entries(context.screenshots)) {
  const path = join(shotsDir, name)
  if (!existsSync(path)) {
    console.warn(`  ${name}: not in screenshots/, skipped`)
    continue
  }
  const storage = await call('POST', '/storages', readFileSync(path), { 'content-type': 'image/png', 'Crowdin-API-FileName': name })
  const storageId = storage.data.id
  const id = existing.has(name)
    ? (await call('PUT', `/projects/${pid}/screenshots/${existing.get(name)}`, { storageId, name })).data.id
    : (await call('POST', `/projects/${pid}/screenshots`, { storageId, name, autoTag: false })).data.id
  const tags = keys.filter((k) => stringIds.has(k)).map((k) => ({ stringId: stringIds.get(k) }))
  if (tags.length) await call('PUT', `/projects/${pid}/screenshots/${id}/tags`, tags)
  console.log(`${name}: uploaded, ${tags.length} string(s) tagged`)
}
const unused = existsSync(shotsDir) ? readdirSync(shotsDir).filter((f) => f.endsWith('.png') && !context.screenshots[f]) : []
if (unused.length) console.warn(`Not in scripts/context.json, so not uploaded: ${unused.join(', ')}`)
console.log('Done.')
