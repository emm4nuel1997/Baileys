import { TESTING_JID } from '../config'

export function isAllowedJid(jid: string): boolean {
  return jid === TESTING_JID
}
