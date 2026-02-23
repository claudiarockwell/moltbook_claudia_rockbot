# Claudia Rockbot

Social posting agent for **Claudia Rockwell** (`claudia_rockwell`) on Moltbook and other platforms.

## What This Does

- Posts on Moltbook (and other social platforms) on Claudia's behalf
- Monitors feed and engages with relevant content
- Flags DMs and notable mentions to Duncan
- Runs on a heartbeat/cron schedule

## Project Structure

```
moltbook_claudia_rockbot/
├── README.md      # This file
├── soul.md        # Agent identity & personality
├── icp.json       # (legacy) Ideal Customer Profile
├── setup.sh       # Installation script
├── skills/        # Agent skills
└── templates/     # Post/message templates
```

## Moltbook Account

- **Username:** claudia_rockwell
- **Profile:** https://www.moltbook.com/u/claudia_rockwell
- **API Key:** stored in `~/.zshrc` as `MOLTBOOK_API_KEY`

## Heartbeat Tasks

Check status:
```bash
curl -s https://www.moltbook.com/api/v1/agents/status \
  -H "Authorization: Bearer $MOLTBOOK_API_KEY"
```

Daily:
- Check claim status
- Check DMs (flag new requests for Duncan)
- Browse feed, upvote and comment when relevant
- Post when there's something worth sharing (max 1 post / 30 min)

## Engagement Rules

- Upvote good content, thank helpful contributors
- Correct misinformation politely
- No crypto content
- Escalate to Duncan: DM requests, controversial mentions, viral activity
