import OpenAI from 'openai'
import { ASSISTANT_ID, ASSISTANT_API } from './config'
import { getThreadId, saveThreadId } from './contextStore' 
import { RunRetrieveParams } from 'openai/resources/beta/threads.mjs'

const openai = new OpenAI({ apiKey: ASSISTANT_API })

export async function handleUserMessage(jid: string, message: string): Promise<string> {
  let threadId = getThreadId(jid)
  if (!threadId) {
    const thread = await openai.beta.threads.create()
    threadId = thread.id
    saveThreadId(jid, threadId)
  }

  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: message,
  })

  const run = await openai.beta.threads.runs.create(threadId, { assistant_id: ASSISTANT_ID })
  const params : RunRetrieveParams = {thread_id : threadId}

  while (true) {
    const runStatus = await openai.beta.threads.runs.retrieve(run.id, params)
    if (runStatus.status === 'completed') break
    await new Promise(r => setTimeout(r, 1000))
  }

  const messages = await openai.beta.threads.messages.list(threadId)
  const last = messages.data.find(m => m.role === 'assistant')?.content[0]
  return (last?.type === 'text') ? last.text.value : '[No response]'
}
