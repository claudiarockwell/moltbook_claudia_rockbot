# OpenClaw Sales Agent

Automated lead generation, LinkedIn outreach, and Monday.com deal tracking.

## Overview

This agent automates the B2B sales prospecting workflow:

1. **Find companies** matching your Ideal Customer Profile (ICP)
2. **Identify decision makers** with specific titles
3. **Outreach via LinkedIn** with personalized messages
4. **Track everything** in Monday.com

## Required Skills

```bash
nvm use 22
npx clawhub install monday
npx clawhub install linkedin-autopilot
npx clawhub install apollo
npx clawhub install lead-hunter
npx clawhub install agent-browser
```

## Configuration

### 1. Monday.com Setup

Get your API token from Monday.com:
- Go to your avatar → Admin → API
- Generate a new token

```bash
openclaw config set skills.monday.apiToken '"your-monday-api-token"'
```

Create a board with these columns:
| Column | Type | Purpose |
|--------|------|---------|
| Name | Text | Lead name |
| Company | Text | Company name |
| Title | Text | Job title |
| LinkedIn | Link | Profile URL |
| Status | Status | Lead stage |
| Last Contact | Date | Last touchpoint |
| Notes | Long Text | Conversation notes |
| Source | Text | How we found them |

Status options:
- New Lead
- Connection Sent
- Connected
- Message Sent
- Replied
- Meeting Scheduled
- Qualified
- Not Interested
- No Response

### 2. LinkedIn Setup

Enable browser tools in OpenClaw config:

```bash
openclaw config set tools.sandbox.tools.deny '[]'
openclaw config set agents.defaults.sandbox.mode '"off"'
```

Log into LinkedIn:
```bash
openclaw browser open https://linkedin.com
```

### 3. Apollo.io Setup (Optional)

For enrichment and contact data:

```bash
openclaw config set skills.apollo.apiKey '"your-apollo-api-key"'
```

## Ideal Customer Profile (ICP)

Edit this section to match your target market:

### Company Criteria
- **Industry**: Manufacturing, Industrial Automation, Logistics
- **Size**: 50-500 employees
- **Revenue**: $10M - $100M
- **Location**: United States, Canada
- **Tech indicators**: Uses PLCs, considering automation, legacy systems

### Target Titles
- Chief Technology Officer (CTO)
- VP of Engineering
- VP of Operations
- Director of Manufacturing
- Head of Automation
- Plant Manager
- Director of Innovation

### Qualifying Signals
- Recently raised funding
- Expanding manufacturing capacity
- Mentioned automation in job postings
- Attending industry trade shows
- Using outdated equipment (5+ years)

## Workflow

### Phase 1: Prospecting

Tell the agent:
```
Search for manufacturing companies in the Pacific Northwest with 50-200
employees that might need robotics or automation solutions. Find the
VP of Engineering or Director of Operations at each company.
```

### Phase 2: Outreach

Tell the agent:
```
Send a LinkedIn connection request to [Name] at [Company].
Use this angle: [specific reason for reaching out based on research].
Log the outreach in Monday.com.
```

### Phase 3: Follow-up Sequence

**Day 0**: Connection request with personalized note
**Day 3**: If connected, send intro message
**Day 7**: Follow-up with value (case study, insight)
**Day 14**: Soft ask for call
**Day 21**: Final follow-up or move to nurture

### Phase 4: Meeting Booking

When a lead responds positively:
```
Send [Name] my Calendly link for a 30-minute discovery call.
Update their status in Monday.com to "Meeting Scheduled".
```

## Message Templates

### Connection Request (300 char limit)
```
Hi [First Name], I noticed [Company] is [specific observation].
We help manufacturers like you [specific benefit].
Would love to connect and share some insights.
```

### Initial Message
```
Thanks for connecting, [First Name]!

I've been following [Company]'s work in [industry/area].
Impressive what you're doing with [specific detail].

We recently helped [similar company] achieve [specific result]
with our [solution type].

Would you be open to a quick chat about how you're handling
[relevant challenge]?

Best,
[Your name]
```

### Follow-up
```
Hi [First Name],

Wanted to share this case study from [similar company] -
they were facing [challenge] and achieved [result].

[Link]

Thought it might be relevant given [Company]'s focus on [area].

Happy to walk you through it if helpful.
```

## Daily Agent Tasks

Set up a cron job to run daily:

```bash
openclaw cron add "0 9 * * 1-5" "sales-prospecting" \
  --message "Run daily sales prospecting: find 10 new leads matching our ICP, send connection requests to qualified prospects, follow up with connected leads per sequence, update all activity in Monday.com"
```

## Tracking & Metrics

The agent should track in Monday.com:

| Metric | Target |
|--------|--------|
| New leads/week | 50 |
| Connection requests/day | 20 |
| Connection rate | >30% |
| Response rate | >15% |
| Meetings booked/week | 3-5 |

## Safety & Compliance

### LinkedIn Limits
- **Connection requests**: Max 100/week (start with 20-30)
- **Messages**: Max 50/day to new connections
- **Profile views**: Keep natural patterns

### Best Practices
- Always personalize messages
- Don't spam or use aggressive tactics
- Respect "Not Interested" responses
- Keep messaging professional
- Comply with LinkedIn ToS

## Troubleshooting

### Agent can't access LinkedIn
```bash
openclaw browser profiles
openclaw browser open https://linkedin.com --profile default
```

### Monday.com not updating
```bash
openclaw config get skills.monday
# Verify API token is set
```

### Rate limited on LinkedIn
- Reduce daily outreach volume
- Add more randomization to timing
- Take a 24-48 hour break

## Files

- `SALES_AGENT.md` - This documentation
- `icp.json` - Ideal Customer Profile definition
- `templates/` - Message templates
- `leads/` - Lead export data
