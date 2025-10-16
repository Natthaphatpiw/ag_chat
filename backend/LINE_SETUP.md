# LINE Messaging API Integration Setup

## Overview
This backend now includes LINE Messaging API integration that allows users to chat with your AI through LINE.

## Required Environment Variables

You need to set up the following environment variables:

```bash
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
LINE_CHANNEL_SECRET=81893e02e450aeda4b4b9bcc61ee3400
```

## LINE Developers Console Setup

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Create a new channel or use existing one with Channel ID: `2008279195`
3. Get your **Channel Access Token** from the console
4. Set the webhook URL to: `https://your-deployed-domain.com/api/line/webhook`

## Webhook URL Configuration

Set your webhook URL in LINE Developers Console to:
```
https://your-deployed-domain.com/api/line/webhook
```

Make sure to include the `/api/line/webhook` path.

## How it Works

1. User sends a message in LINE
2. LINE sends webhook to your `/api/line/webhook` endpoint
3. The webhook verifies the signature using your channel secret
4. Message is processed through your existing AI chat logic
5. AI response is sent back to LINE automatically

## Testing

After deployment and configuration:
1. Send a message to your LINE bot
2. The bot should respond with AI-generated content
3. Check server logs for any errors

## Security Notes

- The webhook verifies LINE signatures to ensure authenticity
- Channel secret is hardcoded for your specific channel
- Make sure to keep your Channel Access Token secure
