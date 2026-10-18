# Pharos Audit-Log Agent

Built for Pharos Season of AI. [Watch the video walkthrough](https://youtu.be/I1-n5D66MmU).

A browser-based wallet activity review tool for Pharos Mainnet, Atlantic Testnet, and Testnet. It reads current account state through JSON-RPC, queries PharosScan where available, classifies returned activity into five categories, and exports a ledger as Markdown, CSV, or a print-ready PDF via the browser print dialog.

## Features

- Audit a wallet address over a selected date range or connect an injected EVM wallet.
- Review incoming and outgoing transfers, swaps, token approvals, and contract interactions.
- Search and filter activity records; inspect transactions through PharosScan links.
- Export the report as Markdown or CSV, or use the browser print dialog to save a PDF.
- Inspect live network and RPC telemetry.

## Run locally

Requires Node.js and npm.

```sh
git clone https://github.com/isharik/Pharos-Audit-Log-Agent.git
cd Pharos-Audit-Log-Agent
npm install
npm run dev
```

Use `npm run build` to create a production bundle, `npm run preview` to serve it locally, and `npm run lint` to run Oxlint.

## Data and coverage

- Reads are made directly by the browser to the selected Pharos RPC endpoints and PharosScan APIs. Network access and endpoint CORS support are required; no server or credentials are configured by this project.
- Explorer transaction queries use the first response page and do not follow pagination. RPC log queries cover at most the most recent 1,000 blocks, while direct block inspection covers 10 blocks. These limits can omit historical activity.
- RPC log timestamps are estimated from block distance using an assumed 1.5 seconds per block. Explorer timestamps and direct block timestamps are used when available.
- The displayed balance and nonce are current snapshots, not values at the end of the chosen audit period. A zero-result query does not prove that an address had no activity.
- ERC-20 amounts have token-specific decimals. Category volume totals therefore include native-token amounts only. Approval records distinguish decoded zero allowances from unknown or nonzero allowances; the app does not query current allowance state.
- The narrative is generated deterministically from returned records. No AI service or API key is configured.
- The app does not sign transactions or modify wallet state. Wallet connection requests account access from an injected EVM provider; address auditing can also be done by pasting an address.

## Networks

Network names, chain IDs, RPC endpoints, and explorer endpoints are configured in `src/App.jsx`. Mainnet MCP requests are attempted for chain status, with JSON-RPC fallback. Test networks use their configured JSON-RPC endpoints.

## Security and status

Never put private keys, API secrets, or access tokens in source code. This tool provides activity records for review; it does not make a formal compliance determination.

## License

Not yet Approved by the team !
