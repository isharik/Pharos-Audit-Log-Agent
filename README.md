# Built for Pharos Season of AI

Here is the Video Walkthrough to get started.

* https://youtu.be/I1-n5D66MmU

# Audit-Log Agent

Turn a wallet's on-chain history into a clear, human-readable activity report for a selected period.

## Overview

Audit-Log Agent accepts a wallet address and date range, groups relevant activity into useful categories, calculates category totals, and highlights notable transactions. The goal is to make wallet activity easier to review for accounting, compliance checks, and general record-keeping.

## Features

- Accepts a wallet address and reporting period.
- Categorizes activity into:
  - Incoming transfers
  - Outgoing transfers
  - Swaps
  - Token approvals
  - Contract interactions
- Summarizes totals for each category.
- Highlights notable transactions with explorer links.
- Exports reports as Markdown, PDF, or CSV.

## How It Works

1. Provide a wallet address and date range.
2. The agent retrieves and processes relevant on-chain activity.
3. Transactions are classified into supported categories.
4. The agent calculates totals and selects notable transactions.
5. A structured report is generated in the selected export format.



## Setup

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <REPOSITORY_DIRECTORY>
```

## Example Report

```markdown
# Wallet Activity Report

- Wallet: 0x...
- Period: YYYY-MM-DD to YYYY-MM-DD
- Data block: <block number, if available>

## Category Summary

| Category | Transaction Count | Total |
|---|---:|---:|
| Incoming transfers | — | — |
| Outgoing transfers | — | — |
| Swaps | — | — |
| Approvals | — | — |
| Contract interactions | — | — |

## Notable Transactions

- [Transaction description](<EXPLORER_TRANSACTION_URL>)
```

The values above are placeholders, not live chain data.

## Security and Data Notes

- Never put private keys, API secrets, or access tokens in source code.
- Link to transaction evidence where possible.
- Clearly label missing, incomplete, or unclassified activity.
- Avoid presenting the report as a formal compliance determination.

## Limitations

Coverage depends on the chain data and tools available to the implementation. Internal contract events, token transfers, and swaps may require different data sources. State any known coverage gaps here.

## Roadmap

- [ ] Improve transaction classification
- [ ] Add configurable report periods
- [ ] Validate export formatting
- [ ] Add tests for totals and categorization

## License

Not yet Approved by the team !


