<p align="center">
  <img alt="Brand image for thumbnail of Autofarmers" src="https://u6mo491ntx4iwuoz.public.blob.vercel-storage.com/autofarmers/thumbnail-EiE2Vv5i2E5AYWjhYXRrJyGZmAeAor.png" width="50%" />
</p>

<h1 align="center">Autofarmers</h1>

## How to run Agent via `agentruntime`
1. Build `solana-mcp`

- Pre-requisites:
  - Node.js 22 or higher
  - pnpm

```bash
cd -
git clone https://github.com/habiliai/solana-mcp
cd solana-mcp
pnpm i
pnpm build
```

2. Install `agentruntime`

- Pre-requisites:
  - Go 1.24 or higher
  - Make

```bash
git clone github.com/habiliai/agentruntime
cd agentruntime
make install
```

3. Run `agentruntime`
- Write .env file for `agentruntime`:
```text
LOG_LEVEL=debug
# OpenAI API Config
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>

NETWORK_GRPC_ADDR=127.0.0.1:9080
NETWORK_GRPC_SECURE=false
```

- Run `agentruntime`. For example:
```bash
agentruntime ./agents/swavv.yaml
```