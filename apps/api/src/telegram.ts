import { getEnv } from './env';

interface ContactNotification {
  name: string;
  email: string;
  message: string;
}

export async function sendTelegramContactNotification(
  notification: ContactNotification,
): Promise<boolean> {
  const env = getEnv();
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;

  const text = [
    '📨 New portfolio message',
    '',
    `Name: ${notification.name}`,
    `Email: ${notification.email}`,
    '',
    notification.message,
  ].join('\n');

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(8_000),
      },
    );

    if (!response.ok) {
      console.error(`Telegram notification failed with status ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Telegram notification failed', error);
    return false;
  }
}
