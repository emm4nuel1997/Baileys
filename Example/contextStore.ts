import fs from 'fs'
import path from 'path'

const baseDir = path.join(__dirname, 'threads')
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir)

export function saveThreadId(jid: string, threadId: string) {
  fs.writeFileSync(path.join(baseDir, `${jid}.json`), JSON.stringify({ threadId }))
}

export function getThreadId(jid: string): string | null {
  try {
    const data = fs.readFileSync(path.join(baseDir, `${jid}.json`), 'utf-8')
    return JSON.parse(data)?.threadId || null
  } catch {
    return null
  }
}
