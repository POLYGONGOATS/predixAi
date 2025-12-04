# Prediction Market AI Agent

> AI-powered prediction market trading agent using Nullshot framework patterns and Model Context Protocol (MCP)

Built for the **NullShot Hacks Season 0** hackathon - Track 1a

## Overview

This agent analyzes prediction markets and provides AI-powered trading recommendations using Claude 3.5 Sonnet. It's built with the Vercel AI SDK and deployed on Cloudflare Workers with Durable Objects for stateful session management.

## Features

- 🤖 **AI-Powered Analysis** - Uses Claude 3.5 Sonnet for intelligent market analysis
- 📊 **Market Data Tools** - Fetch live market data, historical trends, and portfolio information
- 💡 **Trading Recommendations** - Get data-driven trade suggestions based on risk tolerance
- 🔒 **Safe by Default** - All trades are simulated unless explicitly enabled
- ⚡ **Real-time Streaming** - Streaming responses using AI SDK
- 🌐 **Serverless Deployment** - Runs on Cloudflare Workers with Durable Objects

## Architecture

### Tech Stack

- **AI Framework**: Vercel AI SDK with Anthropic provider
- **Runtime**: Cloudflare Workers + Durable Objects
- **Web Framework**: Hono
- **Type Safety**: TypeScript + Zod schemas
- **Tools**: Model Context Protocol (MCP) format

### MCP Tools

The agent has access to 5 prediction market tools:

1. **get_market_data** - Fetch current market prices, volume, and liquidity
2. **analyze_prediction** - Get AI-powered trading recommendations
3. **place_prediction** - Execute trades (simulated by default)
4. **get_user_portfolio** - View current positions and P&L
5. **get_market_history** - Analyze historical price trends

## Setup

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([get one here](https://console.anthropic.com/))
- Cloudflare account (for deployment)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .dev.vars.example .dev.vars
# Edit .dev.vars and add your ANTHROPIC_API_KEY
```

### Development

```bash
# Start development server
npm run dev

# The agent will be available at http://localhost:8787
```

### Testing

Send a POST request to test the agent:

```bash
curl -X POST http://localhost:8787/agent/test-session/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the best prediction markets to trade right now?"}'
```

### Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

## Usage Example

```typescript
// POST /agent/:sessionId/chat
{
  "message": "Analyze the BTC_PRICE market and recommend a trade with moderate risk"
}

// The agent will:
// 1. Fetch market data for BTC_PRICE
// 2. Analyze the market conditions
// 3. Provide a trading recommendation
// 4. Explain the reasoning
```

## Project Structure

```
prediction-market-agent/
├── src/
│   ├── index.ts           # Main entry point with Durable Object
│   ├── prompts.ts         # System prompts for the agent
│   └── mcp/
│       ├── handlers.ts    # MCP tool implementations
│       └── schemas.ts     # Zod schemas for tool inputs
├── wrangler.jsonc         # Cloudflare Workers config
├── mcp.json              # MCP server configuration
├── .dev.vars             # Development environment variables
└── package.json          # Dependencies and scripts
```

## Nullshot Framework Integration

This project follows Nullshot framework patterns:

- ✅ Uses Vercel AI SDK for model interactions
- ✅ MCP tools defined in standard format
- ✅ Cloudflare Workers deployment with Durable Objects
- ✅ Streaming responses for real-time interaction
- ✅ Type-safe tool definitions using Zod

## Hackathon Submission

**Track**: 1a - MCPs/Agents using the Nullshot Framework  
**Prize Pool**: $5,000 (4 winners)

### Submission Checklist

- ✅ Code Repository (public GitHub)
- ✅ Uses Nullshot-compatible patterns
- ✅ MCP tools properly implemented
- ⏳ Demo Video (3-5 minutes)
- ⏳ Project Write-Up
- ⏳ Submission on NullShot platform with "Nullshot Hacks S0" tag

## License

MIT

## Contributing

This project was created for the NullShot Hacks Season 0 hackathon. Contributions and feedback are welcome!

## Contact

For questions about this project or the hackathon, visit:
- [NullShot Platform](https://nullshot.ai/)
- [Edenlayer](https://edenlayer.com/)
