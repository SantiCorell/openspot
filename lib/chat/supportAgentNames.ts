/** Nombres permitidos para el asistente del chat (cliente y API deben coincidir). */
export const SUPPORT_CHAT_AGENT_NAMES = [
  "Roberto",
  "Ana",
  "Lucía",
  "Marc",
  "Elena",
  "Pablo",
  "Sara",
  "Javier",
  "Marta",
  "Daniel",
  "Cristina",
  "Álvaro",
  "Nuria",
  "Iván",
  "Paula",
] as const;

export type SupportChatAgentName = (typeof SUPPORT_CHAT_AGENT_NAMES)[number];

export function isSupportChatAgentName(s: string): s is SupportChatAgentName {
  return (SUPPORT_CHAT_AGENT_NAMES as readonly string[]).includes(s);
}

export function pickRandomSupportAgentName(exclude?: string): SupportChatAgentName {
  const pool = exclude
    ? SUPPORT_CHAT_AGENT_NAMES.filter((n) => n !== exclude)
    : [...SUPPORT_CHAT_AGENT_NAMES];
  return pool[Math.floor(Math.random() * pool.length)] ?? "Ana";
}
