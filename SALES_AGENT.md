# RoseVision CAD Studio - Sales Agent

Automated lead generation, LinkedIn outreach, and Monday.com deal tracking for RoseVision CAD Studio.

## Product Overview

**RoseVision CAD Studio** is a software-first defect detection platform that:
- Trains inspection models directly from your CAD files
- Deploys on edge hardware (NVIDIA Jetson) with off-the-shelf cameras
- Catches defects before first article production
- Replaces brittle rule-based vision systems that break when parts change

**Tagline:** *"Build inspection from your CAD — before you cut your first mold."*

## Target Market

### Manufacturing Processes
| Process | Description |
|---------|-------------|
| **CNC Machining** | Precision machining of metal/plastic parts |
| **Cast Metal / Die Casting** | Metal casting with frequent retooling |
| **Aerospace** | Precision components with strict quality requirements |
| **Stamping / Sheet Metal** | High-volume metal panels and parts |
| **Additive Manufacturing / 3D Printing** | 3D printed production parts |
| **Injection Molding** | High-volume plastic forming |

### Target Titles (Priority Order)

**Tier 1 - Decision Makers:**
- Director of Quality
- Director of Automation
- Director of Manufacturing
- VP of Manufacturing
- Quality Manager

**Tier 2 - Influencers:**
- Quality Supervisor
- Engineering Manager
- Operations Manager
- Plant Manager

**Tier 3 - Champions:**
- Quality Engineer
- Manufacturing Engineer
- Automation Engineer

### Company Profile
- **Size:** 50-500 employees
- **Type:** Tier 1/Tier 2 suppliers, contract manufacturers, OEM parts manufacturers
- **Regions:** Midwest (MI, OH, IN), Pacific Northwest (OR, WA), South (TX, NC)

## Pain Points We Solve

### Pre-Production (Test Market 1)
- No defect detection until first parts are produced
- Expensive tooling rework after defects found
- Long time-to-quality on new product launches

### Production (Test Market 2)
- High scrap rates and waste
- Manual inspection errors and inspector fatigue
- Vision systems that break when parts change
- Customer escapes and complaints

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

**Board Columns:**
| Column | Type | Purpose |
|--------|------|---------|
| Name | Text | Lead name |
| Company | Text | Company name |
| Title | Text | Job title |
| LinkedIn | Link | Profile URL |
| Status | Status | Lead stage |
| Manufacturing Process | Dropdown | CNC, Casting, Molding, etc. |
| Current Inspection | Text | Manual, Vision system, None |
| Pain Point | Text | What problem they have |
| Last Contact | Date | Last touchpoint |
| Notes | Long Text | Conversation notes |

**Status Options:**
- New Lead → Researching → Connection Sent → Connected
- → Message Sent → Replied → Discovery Call Scheduled
- → Discovery Complete → Demo Scheduled → Proposal Sent
- → Negotiating → Won / Lost / Nurture

### 2. LinkedIn Setup

Enable browser tools:
```bash
openclaw config set tools.sandbox.tools.deny '[]'
openclaw config set agents.defaults.sandbox.mode '"off"'
```

Log into LinkedIn:
```bash
openclaw browser open https://linkedin.com
```

### 3. Apollo.io Setup (Optional)

```bash
openclaw config set skills.apollo.apiKey '"your-apollo-api-key"'
```

## Prospecting Queries

### By Manufacturing Process

**CNC Machining:**
```
Find Quality Supervisors and Engineering Managers at CNC machining
companies with 50-500 employees in the Midwest. Look for companies
doing precision manufacturing or aerospace parts.
```

**Injection Molding:**
```
Find Directors of Quality and Quality Managers at injection molding
companies. Focus on automotive suppliers and medical device manufacturers
in Michigan, Ohio, and Texas.
```

**Die Casting / Cast Metal:**
```
Find Directors of Automation and Manufacturing Engineers at die casting
or metal casting companies. Look for automotive and industrial equipment
suppliers.
```

**Stamping:**
```
Find Quality Supervisors and Engineering Managers at metal stamping
companies producing automotive body panels or appliance parts.
```

**Additive Manufacturing:**
```
Find Directors of Quality at additive manufacturing or 3D printing
production facilities. Focus on aerospace and medical device companies.
```

## Message Templates

### Connection Request (300 char limit)

**For Quality Leaders:**
```
Hi {{first_name}}, I noticed {{company}} does {{process}} manufacturing.
We help quality teams catch defects earlier using CAD-based inspection.
Would love to connect and share some insights.
```

**For Engineering/Automation:**
```
Hi {{first_name}}, saw you're leading {{department}} at {{company}}.
We've helped similar {{process}} manufacturers build inspection from
CAD before first article. Happy to connect.
```

### Initial Message

```
Thanks for connecting, {{first_name}}!

I've been following {{company}}'s work in {{industry}}. Impressive
operation you're running.

Quick question: how are you currently handling defect detection on
your {{process}} line? Manual inspection, vision system, or a mix?

We recently helped a {{similar_process}} manufacturer reduce their
scrap rate by 40% by building inspection models directly from their
CAD files — ready before they cut their first mold.

Would love to hear what's working (or not) for you.

Best,
Duncan
```

### Pain Point Follow-Up

```
Hi {{first_name}},

Thought you might find this relevant —

We just published a case study on how {{similar_company}} solved their
{{pain_point}} problem. They were dealing with:
• Vision systems breaking every time parts changed
• Manual inspectors missing defects due to fatigue
• 2-week delays getting inspection ready for new products

Now they have inspection models ready from CAD before first article.

Happy to share the details if useful.

Duncan
```

### Discovery Call Ask

```
Hi {{first_name}},

Based on our conversation, it sounds like {{company}} might benefit
from what we're doing with CAD-based defect detection.

Would a 20-minute call make sense to explore whether RoseVision could
help with your {{specific_challenge}}?

Here's my calendar: {{calendly_link}}

Or just let me know a few times that work.

Best,
Duncan
```

## Daily Agent Tasks

### Morning Prospecting (9 AM)
```
Find 10 new leads matching our ICP:
- Quality Supervisors, Engineering Managers, Directors of Quality,
  or Directors of Automation
- At CNC machining, casting, stamping, injection molding, or additive
  manufacturing companies
- 50-500 employees in Midwest or Pacific Northwest
- Add qualified leads to Monday.com as "New Lead"
```

### Outreach (10 AM)
```
Send LinkedIn connection requests to qualified leads in Monday.com
with status "New Lead". Use personalized connection request based on
their manufacturing process. Update status to "Connection Sent".
```

### Follow-Up (2 PM)
```
Check for new LinkedIn connections. Send initial message to anyone
who connected in the last 24 hours. Update Monday.com status to
"Connected" then "Message Sent".

Follow up with leads per the sequence:
- Day 3: Value-add message
- Day 7: Case study
- Day 14: Soft ask for call
- Day 21: Final follow-up or move to nurture
```

### End of Day (5 PM)
```
Update Monday.com with all activity from today:
- New leads added
- Connections sent/accepted
- Messages sent
- Replies received
- Meetings scheduled
```

## Cron Schedule

```bash
# Morning prospecting
openclaw cron add "0 9 * * 1-5" "rosevision-prospecting" \
  --message "Find 10 new leads: Quality Supervisors, Engineering Managers, Directors of Quality/Automation at CNC, casting, stamping, molding, or additive companies. Add to Monday.com."

# Daily outreach
openclaw cron add "0 10 * * 1-5" "rosevision-outreach" \
  --message "Send connection requests to New Leads in Monday.com. Update statuses."

# Follow-up sequence
openclaw cron add "0 14 * * 1-5" "rosevision-followup" \
  --message "Follow up with connected leads per sequence. Check for replies. Update Monday.com."
```

## Tracking & Metrics

| Metric | Weekly Target |
|--------|---------------|
| New leads identified | 50 |
| Connection requests sent | 30-50 |
| Connection rate | >30% |
| Messages sent | 20-30 |
| Response rate | >15% |
| Discovery calls booked | 3-5 |

## Qualification Questions

When a lead responds positively, qualify with:

1. **Process:** What manufacturing processes do you run? (CNC, molding, casting, etc.)
2. **Current state:** How do you handle defect inspection today?
3. **Pain:** What's the biggest quality challenge you're facing?
4. **Timeline:** Are you launching any new products/lines in the next 6 months?
5. **Decision:** Who else would be involved in evaluating a solution like this?

## Competitive Positioning

**vs. Rule-based vision systems:**
"Your system breaks every time the part changes. Ours adapts because it's trained on CAD geometry, not brittle rules."

**vs. AI-in-a-box vendors:**
"They give you a black box you can't tune. We give you real models, real support, and real integration from engineers who know factories."

**vs. Manual inspection:**
"Your inspectors are fatigued and missing defects. Our system catches cosmetic flaws at line speed, consistently."

## Files

```
claw/
├── SALES_AGENT.md              # This documentation
├── icp.json                    # Ideal Customer Profile
├── setup.sh                    # Installation script
├── templates/
│   ├── connection_request.md   # LinkedIn connection templates
│   └── follow_up_sequence.md   # Message sequence templates
├── leads/                      # Exported lead data
└── RoseVision CAD Studio Bot/  # Product knowledge base
    ├── Customer Profile.docx
    ├── brand statement.docx
    ├── Marketing Copy.docx
    └── ...
```
