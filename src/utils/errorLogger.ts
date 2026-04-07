import envConfig from "../config";

interface SlackErrorPayload {
  timestamp: string;
  errorType: string;
  statusCode: number;
  message: string;
  stack?: string;
  url?: string;
  method?: string;
}

/**
 * Log errors to Slack (can be integrated with Slack webhook)
 */
export const sendToSlack = async (payload: SlackErrorPayload): Promise<void> => {
  try {
    const slackWebhookUrl = envConfig.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      console.warn('SLACK_WEBHOOK_URL is not configured');
      return;
    }

    const message = {
      text: `🚨 Server Error Occurred`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 Server Error Alert',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Error Type:*\n${payload.errorType}`,
            },
            {
              type: 'mrkdwn',
              text: `*Status Code:*\n${payload.statusCode}`,
            },
            {
              type: 'mrkdwn',
              text: `*Message:*\n${payload.message}`,
            },
            {
              type: 'mrkdwn',
              text: `*Timestamp:*\n${payload.timestamp}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Request Info:*\n${payload.method} ${payload.url}\n\n*Stack Trace:*\n\`\`\`${payload.stack || 'N/A'}\`\`\``,
          },
        },
      ],
    };

    await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Failed to send error to Slack:', error);
  }
};

/**
 * Log error to console in development
 */
export const logErrorToConsole = (
  error: any,
  isDevelopment: boolean,
): void => {
  if (!isDevelopment) return;

  console.error('='.repeat(80));
  console.error('ERROR:', error.message);
  console.error('STACK:', error.stack);
  console.error('='.repeat(80));
};

export type { SlackErrorPayload };
