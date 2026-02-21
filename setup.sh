#!/bin/bash

# OpenClaw Sales Agent Setup Script
# Run this to install all required skills and configure the agent

set -e

echo "🦞 Setting up OpenClaw Sales Agent..."

# Ensure we're using Node 22
source ~/.nvm/nvm.sh
nvm use 22

# Install required skills
echo "📦 Installing skills..."
npx clawhub install monday
npx clawhub install linkedin-autopilot
npx clawhub install apollo
npx clawhub install lead-hunter
npx clawhub install agent-browser

# Enable browser tools (required for LinkedIn automation)
echo "🔧 Configuring OpenClaw..."
openclaw config set tools.sandbox.tools.allow '["read","write","edit","apply_patch","browser","web_fetch","exec"]'
openclaw config set tools.sandbox.tools.deny '[]'

echo ""
echo "✅ Skills installed!"
echo ""
echo "Next steps:"
echo "  1. Set your Monday.com API token:"
echo "     openclaw config set skills.monday.apiToken '\"your-token\"'"
echo ""
echo "  2. Set your Apollo API key (optional):"
echo "     openclaw config set skills.apollo.apiKey '\"your-key\"'"
echo ""
echo "  3. Log into LinkedIn in the OpenClaw browser:"
echo "     openclaw browser open https://linkedin.com"
echo ""
echo "  4. Restart the gateway:"
echo "     openclaw gateway restart"
echo ""
echo "  5. Test by messaging your Telegram bot:"
echo "     'Find 5 manufacturing companies in Oregon with 50-200 employees'"
echo ""
