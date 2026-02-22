# RoseVision Sales Agent

An OpenClaw-powered sales automation agent for **RoseVision CAD Studio** — a software-first defect detection platform that trains inspection models directly from CAD files.

## What This Does

This agent automates B2B sales outreach for RoseVision:

- **Lead Generation** — Finds quality and manufacturing leaders at target companies
- **LinkedIn Outreach** — Sends personalized connection requests and follow-up messages
- **Pipeline Management** — Tracks deals and conversations in Monday.com
- **Scheduled Tasks** — Runs prospecting, outreach, and follow-up on a daily cadence

## Target Market

| Segment | Details |
|---------|---------|
| **Industries** | CNC Machining, Die Casting, Injection Molding, Stamping, Additive Manufacturing, Aerospace |
| **Company Size** | 50-500 employees |
| **Titles** | Directors of Quality/Automation, Quality Managers, Engineering Managers |
| **Regions** | Midwest (MI, OH, IN), Pacific Northwest (OR, WA), South (TX, NC) |

## Project Structure

```
claw/
├── README.md                    # This file
├── SALES_AGENT.md               # Full agent documentation & playbook
├── soul.md                      # Agent identity & personality
├── icp.json                     # Ideal Customer Profile (structured)
├── setup.sh                     # Installation script
├── templates/
│   ├── connection_request.md    # LinkedIn connection templates
│   └── follow_up_sequence.md    # Message sequence templates
├── leads/                       # Exported lead data
└── RoseVision CAD Studio Bot/   # Product knowledge base
```

## OpenClaw Configuration

### Gateway Binding

The OpenClaw gateway is configured for **local-only access**:

```json
"gateway": {
  "mode": "local",
  "bind": "loopback",
  "trustedProxies": ["127.0.0.1"]
}
```

- **bind: loopback** — Gateway only listens on `127.0.0.1:18789`
- **trustedProxies: ["127.0.0.1"]** — Only trust connections from localhost

This means the Control UI and API are only accessible from this machine. External network access is blocked.

### Required Skills

```bash
nvm use 22
npx clawhub install monday
npx clawhub install linkedin-autopilot
npx clawhub install apollo
npx clawhub install lead-hunter
npx clawhub install agent-browser
```

### Integrations

| Service | Purpose |
|---------|---------|
| **Monday.com** | CRM & pipeline tracking |
| **LinkedIn** | Prospecting & outreach |
| **Apollo.io** | Lead enrichment (optional) |
| **Telegram/Signal** | Agent communication channels |

## Useful Commands

```bash
# Check OpenClaw status
openclaw status --all

# Security audit
openclaw security audit --deep

# Gateway management
openclaw gateway start
openclaw gateway stop
openclaw gateway restart

# View logs
tail -f ~/.openclaw/logs/gateway.log

# Browser control (for LinkedIn)
openclaw browser open https://linkedin.com
```

## Config Location

- **OpenClaw config:** `~/.openclaw/openclaw.json`
- **Agent workspace:** `~/OpenClawSandbox`
- **Logs:** `~/.openclaw/logs/`

## Getting Started

1. Ensure Node 22 is active: `nvm use 22`
2. Start the gateway: `openclaw gateway start`
3. Open the Control UI: http://127.0.0.1:18789
4. Review `SALES_AGENT.md` for the full playbook
