import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  BookOpen,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  KeyRound,
  FileCode2,
  FileText,
  FileSpreadsheet,
  Printer,
  Search,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Wallet,
  Copy,
  Check,
  Layers,
  Scale,
  Bookmark,
  Radio,
  Server,
} from 'lucide-react';

const PHAROS_NETWORKS = {
  mainnet: {
    id: 'mainnet',
    name: 'Pharos Mainnet',
    chainId: 1672,
    chainIdHex: '0x688',
    symbol: 'PROS',
    mcpUrl: import.meta.env.VITE_PHAROS_MCP_URL || (import.meta.env.DEV ? '/__pharos_mcp' : 'https://mcp.pharos.xyz/mcp'),
    rpcUrls: [
      'https://rpc.pharos.xyz',
      'https://infra.originstake.com/pharos/evm',
      'https://pharos.drpc.org'
    ],
    explorerUrl: 'https://pharosscan.xyz',
    explorerApi: 'https://pharosscan.xyz/api',
    historyApi: 'https://api.socialscan.io/pharos-mainnet/v1/explorer'
  },
  atlantic: {
    id: 'atlantic',
    name: 'Pharos Atlantic Testnet',
    chainId: 688689,
    chainIdHex: '0xa8231',
    symbol: 'PHRS',
    mcpUrl: import.meta.env.VITE_PHAROS_MCP_URL || (import.meta.env.DEV ? '/__pharos_mcp' : 'https://mcp.pharos.xyz/mcp'),
    rpcUrls: [
      'https://atlantic.dplabs-internal.com'
    ],
    explorerUrl: 'https://atlantic.pharosscan.xyz',
    explorerApi: 'https://atlantic.pharosscan.xyz/api',
    historyApi: 'https://api.socialscan.io/pharos-atlantic-testnet/v1/explorer'
  },
  testnet: {
    id: 'testnet',
    name: 'Pharos Testnet',
    chainId: 688688,
    chainIdHex: '0xa8230',
    symbol: 'PHRS',
    mcpUrl: import.meta.env.VITE_PHAROS_MCP_URL || (import.meta.env.DEV ? '/__pharos_mcp' : 'https://mcp.pharos.xyz/mcp'),
    rpcUrls: [
      'https://testnet.dplabs-internal.com'
    ],
    explorerUrl: 'https://testnet.pharosscan.xyz',
    explorerApi: 'https://testnet.pharosscan.xyz/api'
  }
};

const TOPIC_ERC20_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const TOPIC_ERC20_APPROVAL = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925';
const TOPIC_WETH_DEPOSIT = '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c';
const TOPIC_UNISWAP_SWAP_V2 = '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822';
const TOPIC_UNISWAP_SWAP_V3 = '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67';

const METHOD_SIGNATURES = {
  '0xa9059cbb': { name: 'transfer(address,uint256)', category: 'transfer' },
  '0x23b872dd': { name: 'transferFrom(address,address,uint256)', category: 'transfer' },
  '0x095ea7b3': { name: 'approve(address,uint256)', category: 'approval' },
  '0x39509351': { name: 'increaseAllowance(address,uint256)', category: 'approval' },
  '0xa457c2d7': { name: 'decreaseAllowance(address,uint256)', category: 'approval' },
  '0xa22cb465': { name: 'setApprovalForAll(address,bool)', category: 'approval' },
  '0xd505accf': { name: 'permit(address,address,uint256,uint256,uint8,bytes32,bytes32)', category: 'approval' },
  '0x38ed1739': { name: 'swapExactTokensForTokens', category: 'swap' },
  '0x8803dbee': { name: 'swapTokensForExactTokens', category: 'swap' },
  '0x7ff36ab5': { name: 'swapExactETHForTokens', category: 'swap' },
  '0x18cbafe5': { name: 'swapExactTokensForETH', category: 'swap' },
  '0xfb3bdb41': { name: 'swapETHForExactTokens', category: 'swap' },
  '0x5c11d795': { name: 'swapExactTokensForTokensSupportingFeeOnTransferTokens', category: 'swap' },
  '0x414bf389': { name: 'exactInputSingle', category: 'swap' },
  '0xc04b8d59': { name: 'exactInput', category: 'swap' },
  '0xdb3e2198': { name: 'exactOutputSingle', category: 'swap' },
  '0x04e45aaf': { name: 'exactInputSingle (V3)', category: 'swap' },
  '0x5ae401dc': { name: 'multicall(uint256,bytes[])', category: 'swap' },
  '0xac9650d8': { name: 'multicall(bytes[])', category: 'swap' },
  '0x3593564c': { name: 'execute(bytes,bytes[],uint256)', category: 'swap' },
  '0x12aa3caf': { name: 'swap', category: 'swap' }
};

const PharosLogo = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Pharos Network Logo"
  >
    <defs>
      <linearGradient id="pharosFold1" x1="44" y1="30" x2="76" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#001AE6" />
        <stop offset="45%" stopColor="#5C73F2" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
      </linearGradient>
      <linearGradient id="pharosFold2" x1="39" y1="61" x2="82" y2="78" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#001AE6" />
        <stop offset="48%" stopColor="#546BF0" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
      </linearGradient>
    </defs>
    {/* Connecting Fold 1 (Top-to-Middle Z-Ribbon) */}
    <polygon points="44,33 74,26 80,39 62,43" fill="url(#pharosFold1)" />
    {/* Connecting Fold 2 (Middle-to-Bottom Z-Ribbon) */}
    <polygon points="39,63 63,57 86,68 61,75" fill="url(#pharosFold2)" />
    {/* Top Blue Bar */}
    <polygon points="44,23 74,16 74,26 44,33" fill="#001CE6" />
    {/* Middle Blue Bar */}
    <polygon points="39,47 79,38 79,53 39,63" fill="#001CE6" />
    {/* Bottom Blue Bar */}
    <polygon points="34,82 86,68 86,90 34,104" fill="#001CE6" />
  </svg>
);

const formatUnits = (weiHexOrStr, decimals = 18) => {
  if (!weiHexOrStr) return 0;
  try {
    const val = BigInt(weiHexOrStr);
    const divisor = BigInt(10) ** BigInt(decimals);
    const integerPart = val / divisor;
    const remainder = val % divisor;
    const remainderStr = remainder.toString().padStart(decimals, '0').slice(0, 6);
    return parseFloat(`${integerPart.toString()}.${remainderStr}`);
  } catch {
    return 0;
  }
};

const formatNumber = (num, maxDecimals = 4) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num === 0) return '0.00';
  if (num > 0 && num < 0.0001) return '< 0.0001';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals
  }).format(num);
};

const shortAddr = (addr) => {
  if (!addr || typeof addr !== 'string') return '—';
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
};

const padAddressTopic = (address) => {
  const clean = address.toLowerCase().replace(/^0x/, '');
  return '0x' + clean.padStart(64, '0');
};

const unpadAddressTopic = (topic) => {
  if (!topic || topic.length < 42) return null;
  return '0x' + topic.slice(-40).toLowerCase();
};

const CATEGORY_META = {
  transfers_in: {
    key: 'transfers_in',
    label: 'Transfers In',
    shortLabel: 'Inbound',
    code: 'CAT-01',
    icon: ArrowDownLeft,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    accent: '#047857',
    description: 'Incoming native token & ERC-20 credit settlements'
  },
  transfers_out: {
    key: 'transfers_out',
    label: 'Transfers Out',
    shortLabel: 'Outbound',
    code: 'CAT-02',
    icon: ArrowUpRight,
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    accent: '#be123c',
    description: 'Outgoing native token & ERC-20 debit disbursements'
  },
  swaps: {
    key: 'swaps',
    label: 'Swaps & DEX',
    shortLabel: 'Swaps',
    code: 'CAT-03',
    icon: Repeat,
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    accent: '#3730a3',
    description: 'Automated market maker exchanges & liquidity routing'
  },
  approvals: {
    key: 'approvals',
    label: 'Token Approvals',
    shortLabel: 'Approvals',
    code: 'CAT-04',
    icon: KeyRound,
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    accent: '#b45309',
    description: 'Spender allowance grants, permits & revocations'
  },
  contract_interactions: {
    key: 'contract_interactions',
    label: 'Contract Interactions',
    shortLabel: 'Contracts',
    code: 'CAT-05',
    icon: FileCode2,
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    accent: '#001CE6',
    description: 'Smart contract executions, deployments & state calls'
  }
};

class PharosLiveClient {
  constructor(networkConfig, onTelemetryLog) {
    this.network = networkConfig;
    this.log = onTelemetryLog || (() => {});
    this.rpcId = 1;
  }

  async readMcpResponse(response) {
    const body = await response.text();
    if (!body) return null;
    if ((response.headers.get('content-type') || '').includes('text/event-stream')) {
      const dataLine = body.split(/\r?\n/).find((line) => line.startsWith('data:'));
      if (!dataLine) throw new Error('Empty MCP event-stream response');
      return JSON.parse(dataLine.replace(/^data:\s*/, ''));
    }
    return JSON.parse(body);
  }

  async callMcpTool(toolName, args = {}) {
    if (this.network.id !== 'mainnet') {
      throw new Error('The hosted Pharos MCP endpoint only serves Mainnet.');
    }

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'MCP-Protocol-Version': '2025-03-26'
    };

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const initializeResponse = await fetch(this.network.mcpUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: this.rpcId++,
          method: 'initialize',
          params: {
            protocolVersion: '2025-03-26',
            capabilities: {},
            clientInfo: { name: 'pharos-audit-ledger', version: '1.0.0' }
          }
        })
      });
      if (!initializeResponse.ok) {
        throw new Error(`MCP initialize returned HTTP ${initializeResponse.status}`);
      }
      const initializeData = await this.readMcpResponse(initializeResponse);
      if (initializeData?.error) {
        throw new Error(initializeData.error.message || 'MCP initialization failed');
      }

      const sessionId = initializeResponse.headers.get('mcp-session-id');
      const requestHeaders = sessionId ? { ...headers, 'Mcp-Session-Id': sessionId } : headers;
      const initializedResponse = await fetch(this.network.mcpUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })
      });
      if (!initializedResponse.ok) {
        const message = await initializedResponse.text();
        if (attempt === 0 && /unknown mcp session/i.test(message)) continue;
        throw new Error(`MCP session setup returned HTTP ${initializedResponse.status}`);
      }

      const callResponse = await fetch(this.network.mcpUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: this.rpcId++,
          method: 'tools/call',
          params: { name: toolName, arguments: args }
        })
      });
      if (!callResponse.ok) {
        const message = await callResponse.text();
        if (attempt === 0 && /unknown mcp session/i.test(message)) continue;
        throw new Error(`MCP tool call returned HTTP ${callResponse.status}`);
      }

      const data = await this.readMcpResponse(callResponse);
      if (data?.error) throw new Error(data.error.message || 'MCP tool call failed');
      const toolResult = data?.result;
      if (toolResult?.isError) {
        throw new Error(toolResult.content?.[0]?.text || 'Pharos MCP reported a tool error');
      }
      const textContent = toolResult?.content?.find((item) => item.type === 'text')?.text;
      this.log({ source: 'PharosMCP', method: `mcp:${toolName}`, status: 'ok' });
      if (!textContent) return toolResult;
      try {
        return JSON.parse(textContent);
      } catch {
        return textContent;
      }
    }

    throw new Error('Pharos MCP session could not be established after retry.');
  }

  // Direct JSON-RPC call across configured Pharos RPC endpoints
  async rpcCall(method, params = []) {
    let lastErr = null;
    for (const url of this.network.rpcUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        let res;
        try {
          res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: this.rpcId++,
              method,
              params
            }),
            signal: controller.signal
          });
        } finally {
          clearTimeout(timeoutId);
        }
        if (!res.ok) continue;
        const json = await res.json();
        if (json.error) {
          lastErr = new Error(json.error.message || 'RPC Error');
          continue;
        }
        this.log({
          source: 'PharosRPC',
          method,
          endpoint: url.replace('https://', ''),
          status: 'ok'
        });
        return json.result;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error(`All RPC endpoints failed for ${method}`);
  }

  async getChainStatus() {
    // Try MCP get_chain_info first on Mainnet, then standard RPC
    if (this.network.id === 'mainnet') {
      try {
        const mcpInfo = await this.callMcpTool('get_chain_info', {});
        if (mcpInfo && (mcpInfo.blockNumber || mcpInfo.latestBlock)) {
          const bn = Number(mcpInfo.blockNumber || mcpInfo.latestBlock);
          const gasHex = await this.rpcCall('eth_gasPrice', []);
          return {
            blockNumber: bn,
            gasPriceGwei: formatUnits(gasHex, 9),
            via: 'Pharos Chain MCP'
          };
        }
      } catch (err) {
        this.log({
          source: 'PharosMCP',
          method: 'get_chain_info',
          status: `unavailable; RPC fallback (${err.message || 'connection failed'})`
        });
      }
    }

    const [blockHex, gasHex] = await Promise.all([
      this.rpcCall('eth_blockNumber', []),
      this.rpcCall('eth_gasPrice', []).catch(() => '0x3b9aca00')
    ]);

    return {
      blockNumber: parseInt(blockHex, 16),
      gasPriceGwei: formatUnits(gasHex, 9),
      via: 'Pharos JSON-RPC'
    };
  }

  async getAccountSummary(address) {
    const [balHex, nonceHex, codeHex] = await Promise.all([
      this.rpcCall('eth_getBalance', [address, 'latest']),
      this.rpcCall('eth_getTransactionCount', [address, 'latest']),
      this.rpcCall('eth_getCode', [address, 'latest']).catch(() => '0x')
    ]);
    return {
      balance: formatUnits(balHex, 18),
      balanceRaw: balHex,
      txCount: parseInt(nonceHex, 16) || 0,
      isContract: Boolean(codeHex && codeHex !== '0x' && codeHex !== '0x0')
    };
  }

  // Discover live active addresses straight from the most recent Pharos blocks
  async discoverLiveActiveAddresses(latestBlockNumber, count = 6) {
    const discovered = new Map();
    const blocksToScan = 6;
    const promises = [];

    for (let i = 0; i < blocksToScan; i++) {
      const targetBlock = latestBlockNumber - i;
      if (targetBlock <= 0) continue;
      const hexBlock = '0x' + targetBlock.toString(16);
      promises.push(
        this.rpcCall('eth_getBlockByNumber', [hexBlock, true]).catch(() => null)
      );
    }

    const blocks = await Promise.all(promises);
    let sampleRecentTxs = [];

    for (const blk of blocks) {
      if (!blk || !Array.isArray(blk.transactions)) continue;
      const ts = parseInt(blk.timestamp, 16) * 1000;
      for (const tx of blk.transactions) {
        if (typeof tx !== 'object' || !tx.from) continue;
        sampleRecentTxs.push({ ...tx, blockTimestamp: ts });
        const fromAddr = tx.from.toLowerCase();
        if (!discovered.has(fromAddr)) {
          discovered.set(fromAddr, {
            address: tx.from,
            role: 'Active Sender',
            blockNumber: parseInt(blk.number, 16),
            txHash: tx.hash
          });
        }
        if (tx.to && !discovered.has(tx.to.toLowerCase())) {
          discovered.set(tx.to.toLowerCase(), {
            address: tx.to,
            role: tx.input && tx.input !== '0x' ? 'Active Contract' : 'Active Recipient',
            blockNumber: parseInt(blk.number, 16),
            txHash: tx.hash
          });
        }
        if (discovered.size >= count * 2) break;
      }
    }

    return {
      addresses: Array.from(discovered.values()).slice(0, count),
      recentBlockTxs: sampleRecentTxs
    };
  }
}

function classifyActivityRecord(rawTx, targetAddress, symbol) {
  const wallet = targetAddress.toLowerCase();
  const from = (rawTx.from || '').toLowerCase();
  const to = (rawTx.to || '').toLowerCase();
  const input = (rawTx.input || rawTx.data || '0x').toLowerCase();
  const methodId = input.length >= 10 ? input.slice(0, 10) : '0x';
  const methodMeta = METHOD_SIGNATURES[methodId];
  const decodedApprovalAmount = rawTx.approvalAmount ?? (
    methodId === '0x095ea7b3' && /^[0-9a-f]{64}$/i.test(input.slice(74, 138))
      ? BigInt(`0x${input.slice(74, 138)}`).toString()
      : undefined
  );
  const valueFloat = typeof rawTx.valueFloat === 'number'
    ? rawTx.valueFloat
    : formatUnits(rawTx.value || '0x0', rawTx.tokenDecimals || 18);
  const assetSymbol = rawTx.assetSymbol || symbol;

  let category = 'contract_interactions';
  let plainAction = '';
  let direction = from === wallet ? 'OUT' : to === wallet ? 'IN' : 'SELF';
  const methodName =
    rawTx.methodName ||
    methodMeta?.name ||
    (methodId !== '0x' ? `Contract Call (${methodId})` : 'Native Transfer');

  // 1. Explicit approval events or approval method selectors
  if (
    rawTx.eventType === 'APPROVAL' ||
    methodMeta?.category === 'approval' ||
    methodName.toLowerCase().includes('approve') ||
    methodName.toLowerCase().includes('permit')
  ) {
    category = 'approvals';
    const spender = rawTx.spender || rawTx.to || 'Spender Contract';
    const approvalAmount = decodedApprovalAmount;
    plainAction = approvalAmount === '0'
      ? `Revoked token spending allowance for ${shortAddr(spender)}`
      : approvalAmount === undefined
      ? `Changed token spending approval for ${shortAddr(spender)} (allowance not decoded)`
      : `Set token spending approval for ${shortAddr(spender)} (allowance not valued)`;
  }
  // 2. Explicit swap events or DEX router selectors
  else if (
    rawTx.eventType === 'SWAP' ||
    methodMeta?.category === 'swap' ||
    methodName.toLowerCase().includes('swap') ||
    methodName.toLowerCase().includes('exactinput') ||
    methodName.toLowerCase().includes('exactoutput') ||
    methodName.toLowerCase().includes('multicall')
  ) {
    category = 'swaps';
    plainAction = `Executed on-chain swap via ${shortAddr(rawTx.to)} (${methodName.split('(')[0]}) involving ${formatNumber(valueFloat)} ${assetSymbol}`;
  }
  // 3. Transfers In & Out (Native value transfers or ERC-20 Transfer events/calls)
  else if (
    rawTx.eventType === 'TRANSFER' ||
    methodMeta?.category === 'transfer' ||
    ((input === '0x' || input === '0x00') && valueFloat >= 0)
  ) {
    if (to === wallet && from !== wallet) {
      category = 'transfers_in';
      direction = 'IN';
      plainAction = `Received ${formatNumber(valueFloat)} ${assetSymbol} from ${shortAddr(rawTx.from)}`;
    } else {
      category = 'transfers_out';
      direction = 'OUT';
      plainAction = `Transferred ${formatNumber(valueFloat)} ${assetSymbol} to ${shortAddr(rawTx.to || 'Contract')}`;
    }
  }
  // 4. Contract interaction that also carries significant native value inbound/outbound
  else {
    category = 'contract_interactions';
    if (!rawTx.to) {
      plainAction = `Deployed new smart contract on Pharos Network`;
    } else {
      plainAction = `Invoked ${methodName.split('(')[0]} on contract ${shortAddr(rawTx.to)}${
        valueFloat > 0 ? ` with ${formatNumber(valueFloat)} ${assetSymbol}` : ''
      }`;
    }
  }

  return {
    id: rawTx.id || `${rawTx.hash}-${rawTx.logIndex || 0}`,
    hash: rawTx.hash,
    blockNumber: Number(rawTx.blockNumber || 0),
    timestamp: Number(rawTx.timestamp || Date.now()),
    from: rawTx.from || '0x0000000000000000000000000000000000000000',
    to: rawTx.to || 'Contract Creation',
    valueFloat,
    assetSymbol,
    isNativeAsset: rawTx.assetSymbol === undefined,
    gasFeeFloat: rawTx.gasFeeFloat || 0,
    methodId,
    methodName,
    category,
    direction,
    plainAction,
    status: rawTx.status || 'Confirmed',
    source: rawTx.source || 'Pharos Live RPC'
  };
}

async function fetchLiveWalletAuditData({
  client,
  address,
  startDateStr,
  endDateStr,
  latestBlockNumber,
  onProgress
}) {
  const cleanAddr = address.trim();
  const startMs = new Date(`${startDateStr}T00:00:00`).getTime();
  const endMs = new Date(`${endDateStr}T23:59:59.999`).getTime();
  const symbol = client.network.symbol;
  const collectedMap = new Map();
  const dataSourcesUsed = new Set();
  const dataWarnings = [];

  if (client.network.historyApi) {
    const pageSize = 500;
    const maxPages = 20;
    const pagesPerBatch = 3;
    let reachedStartDate = false;
    let reachedEndOfHistory = false;

    try {
      for (let firstPage = 1; firstPage <= maxPages; firstPage += pagesPerBatch) {
        const pageNumbers = Array.from(
          { length: Math.min(pagesPerBatch, maxPages - firstPage + 1) },
          (_, index) => firstPage + index
        );
        onProgress(`Loading PharosScan wallet history (pages ${pageNumbers[0]}–${pageNumbers.at(-1)})…`);

        const pageResults = await Promise.all(
          pageNumbers.map(async (page) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);
            try {
              const url = `${client.network.historyApi}/address/${cleanAddr}/transactions?size=${pageSize}&page=${page}`;
              const res = await fetch(url, {
                headers: { Accept: 'application/json' },
                signal: controller.signal
              });
              if (!res.ok) throw new Error(`Explorer HTTP ${res.status}`);
              return await res.json();
            } finally {
              clearTimeout(timeoutId);
            }
          })
        );

        dataSourcesUsed.add('PharosScan SocialScan API');
        let oldestTimestamp = Infinity;

        for (const result of pageResults) {
          const items = Array.isArray(result.data) ? result.data : [];
          if (items.length < pageSize) reachedEndOfHistory = true;

          for (const item of items) {
            const timestamp = new Date(item.block_timestamp || item.timestamp || '').getTime();
            if (!Number.isFinite(timestamp)) continue;
            oldestTimestamp = Math.min(oldestTimestamp, timestamp);
            if (timestamp < startMs || timestamp > endMs) continue;

            const rec = classifyActivityRecord(
              {
                id: item.hash,
                hash: item.hash,
                blockNumber: item.block_number,
                timestamp,
                from: item.from_address,
                to: item.to_address || item.receipt_contract_address,
                value: item.value || '0',
                input: item.method_id || '0x',
                methodName: item.method || undefined,
                gasFeeFloat: Number(item.transaction_fee || item.total_transaction_fee || 0),
                status: Number(item.receipt_status) === 0 ? 'Failed' : 'Confirmed',
                source: 'PharosScan SocialScan API'
              },
              cleanAddr,
              symbol
            );
            collectedMap.set(rec.id, rec);
          }
        }

        if (oldestTimestamp <= startMs) {
          reachedStartDate = true;
          break;
        }
        if (reachedEndOfHistory) break;
      }

      if (!reachedStartDate && !reachedEndOfHistory) {
        dataWarnings.push(
          `Explorer history was capped at ${(pageSize * maxPages).toLocaleString()} most-recent transactions; this date range may be incomplete.`
        );
      }
      client.log({
        source: 'PharosScan',
        method: 'SocialScan address transactions',
        status: `${collectedMap.size} records`
      });
    } catch (err) {
      dataWarnings.push(`Explorer history could not be loaded: ${err.message || 'request failed'}.`);
      client.log({
        source: 'PharosScan',
        method: 'SocialScan address transactions',
        status: 'unavailable; trying RPC'
      });
    }
  }

  // Step 1: Query Blockscout V2 API & Etherscan-compatible API on PharosScan if reachable
  onProgress('Querying PharosScan Explorer indexer for historical transactions...');
  if (!client.network.historyApi) {
  try {
    const v2Url = `${client.network.explorerUrl}/api/v2/addresses/${cleanAddr}/transactions`;
    const res = await fetch(v2Url, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const json = await res.json();
      const items = json.items || [];
      dataSourcesUsed.add('PharosScan API v2');
      client.log({
        source: 'PharosScan',
        method: 'GET /api/v2/addresses/transactions',
        status: `${items.length} txs`
      });
      for (const item of items) {
        const ts = item.timestamp ? new Date(item.timestamp).getTime() : Date.now();
        if (ts < startMs || ts > endMs) continue;
        const gasFee = item.fee?.value ? formatUnits(item.fee.value, 18) : 0;
        const rec = classifyActivityRecord(
          {
            hash: item.hash,
            blockNumber: item.block_number || item.block,
            timestamp: ts,
            from: item.from?.hash || item.from,
            to: item.to?.hash || item.to,
            value: item.value || '0',
            input: item.raw_input || '0x',
            methodName: item.method || undefined,
            gasFeeFloat: gasFee,
            status: item.status === 'error' ? 'Failed' : 'Confirmed',
            source: 'PharosScan v2'
          },
          cleanAddr,
          symbol
        );
        collectedMap.set(rec.id, rec);
      }
    }
  } catch {
    // Continue to Etherscan-style endpoint & direct RPC/MCP log queries
  }

  // Step 1B: Query PharosScan token transfers v2 endpoint
  try {
    const tokenUrl = `${client.network.explorerUrl}/api/v2/addresses/${cleanAddr}/token-transfers`;
    const res = await fetch(tokenUrl, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const json = await res.json();
      const items = json.items || [];
      dataSourcesUsed.add('PharosScan Token Indexer');
      for (const item of items) {
        const ts = item.timestamp ? new Date(item.timestamp).getTime() : Date.now();
        if (ts < startMs || ts > endMs) continue;
        const txHash = item.tx_hash || item.transaction_hash;
        const decimals = Number(item.token?.decimals || 18);
        const tokenSym = item.token?.symbol || 'ERC20';
        const valFloat = formatUnits(item.total?.value || '0', decimals);
        const rec = classifyActivityRecord(
          {
            id: `${txHash}-${item.log_index || Math.random()}`,
            hash: txHash,
            blockNumber: item.block_number || 0,
            timestamp: ts,
            from: item.from?.hash || item.from,
            to: item.to?.hash || item.to,
            valueFloat: valFloat,
            assetSymbol: tokenSym,
            eventType: item.type === 'token_spawning' ? 'CONTRACT' : 'TRANSFER',
            methodName: `ERC20 ${tokenSym} Transfer`,
            source: 'PharosScan Token v2'
          },
          cleanAddr,
          symbol
        );
        collectedMap.set(rec.id, rec);
      }
    }
  } catch {
    // Fallback handled below
  }

  // Step 1C: Try standard ?module=account&action=txlist on PharosScan
  if (collectedMap.size === 0) {
    try {
      const txListUrl = `${client.network.explorerApi}?module=account&action=txlist&address=${cleanAddr}&sort=desc`;
      const res = await fetch(txListUrl);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.result)) {
          dataSourcesUsed.add('PharosScan Account API');
          for (const tx of json.result) {
            const ts = Number(tx.timeStamp) * 1000;
            if (ts < startMs || ts > endMs) continue;
            const gasFee =
              tx.gasUsed && tx.gasPrice
                ? formatUnits((BigInt(tx.gasUsed) * BigInt(tx.gasPrice)).toString(), 18)
                : 0;
            const rec = classifyActivityRecord(
              {
                hash: tx.hash,
                blockNumber: Number(tx.blockNumber),
                timestamp: ts,
                from: tx.from,
                to: tx.to,
                value: tx.value,
                input: tx.input,
                methodName: tx.functionName ? tx.functionName.split('(')[0] : undefined,
                gasFeeFloat: gasFee,
                status: tx.isError === '1' ? 'Failed' : 'Confirmed',
                source: 'PharosScan API'
              },
              cleanAddr,
              symbol
            );
            collectedMap.set(rec.id, rec);
          }
        }
      }
    } catch {
      // Proceed to direct on-chain RPC / MCP eth_getLogs & block inspection
    }
  }
  }

  // Step 2: Query Live On-Chain Logs via Pharos RPC / MCP (1000-block window per Pharos MCP spec)
  onProgress('Querying Pharos RPC & MCP eth_getLogs (Transfer & Approval events)...');
  try {
    const fromBlockNum = Math.max(1, latestBlockNumber - 995);
    const fromBlockHex = '0x' + fromBlockNum.toString(16);
    const toBlockHex = '0x' + latestBlockNumber.toString(16);
    const paddedWallet = padAddressTopic(cleanAddr);

    const logQueries = [
      // Outbound ERC-20 Transfers
      client.rpcCall('eth_getLogs', [
        {
          fromBlock: fromBlockHex,
          toBlock: toBlockHex,
          topics: [TOPIC_ERC20_TRANSFER, paddedWallet]
        }
      ]).catch(() => []),
      // Inbound ERC-20 Transfers
      client.rpcCall('eth_getLogs', [
        {
          fromBlock: fromBlockHex,
          toBlock: toBlockHex,
          topics: [TOPIC_ERC20_TRANSFER, null, paddedWallet]
        }
      ]).catch(() => []),
      // Token Approvals granted by Wallet
      client.rpcCall('eth_getLogs', [
        {
          fromBlock: fromBlockHex,
          toBlock: toBlockHex,
          topics: [TOPIC_ERC20_APPROVAL, paddedWallet]
        }
      ]).catch(() => []),
      // Logs emitted directly by address (if address is a contract)
      client.rpcCall('eth_getLogs', [
        {
          fromBlock: fromBlockHex,
          toBlock: toBlockHex,
          address: cleanAddr
        }
      ]).catch(() => [])
    ];

    const [outLogs, inLogs, approvalLogs, contractLogs] = await Promise.all(logQueries);
    const allLogs = [
      ...(Array.isArray(outLogs) ? outLogs : []),
      ...(Array.isArray(inLogs) ? inLogs : []),
      ...(Array.isArray(approvalLogs) ? approvalLogs : []),
      ...(Array.isArray(contractLogs) ? contractLogs.slice(0, 40) : [])
    ];

    if (allLogs.length > 0) {
      dataSourcesUsed.add('Pharos JSON-RPC eth_getLogs');
    }

    // Fetch full transaction details for unique tx hashes discovered in logs
    const uniqueHashes = Array.from(
      new Set(allLogs.map((l) => l.transactionHash).filter(Boolean))
    ).slice(0, 25);

    const txDetailsMap = new Map();
    await Promise.all(
      uniqueHashes.map(async (h) => {
        try {
          const txObj = await client.rpcCall('eth_getTransactionByHash', [h]);
          if (txObj) txDetailsMap.set(h.toLowerCase(), txObj);
        } catch {
          // ignore individual failure
        }
      })
    );

    for (const log of allLogs) {
      const txHash = log.transactionHash;
      if (!txHash) continue;
      const blkNum = parseInt(log.blockNumber, 16) || latestBlockNumber;
      // Estimate timestamp from block delta (~1.5s per block on Pharos) if block header not cached
      const blockAgeMs = Math.max(0, (latestBlockNumber - blkNum) * 1500);
      const approxTs = Date.now() - blockAgeMs;
      if (approxTs < startMs || approxTs > endMs) continue;

      const topic0 = (log.topics?.[0] || '').toLowerCase();
      const parentTx = txDetailsMap.get(txHash.toLowerCase());

      let eventType = 'CONTRACT';
      let fromAddr = parentTx?.from || unpadAddressTopic(log.topics?.[1]) || cleanAddr;
      let toAddr = parentTx?.to || unpadAddressTopic(log.topics?.[2]) || log.address;
      let spenderAddr = null;
      let methodName = 'Contract Event';

      if (topic0 === TOPIC_ERC20_TRANSFER) {
        eventType = 'TRANSFER';
        fromAddr = unpadAddressTopic(log.topics?.[1]) || fromAddr;
        toAddr = unpadAddressTopic(log.topics?.[2]) || toAddr;
        methodName = 'ERC-20 Transfer';
      } else if (topic0 === TOPIC_ERC20_APPROVAL) {
        eventType = 'APPROVAL';
        fromAddr = unpadAddressTopic(log.topics?.[1]) || fromAddr;
        spenderAddr = unpadAddressTopic(log.topics?.[2]);
        toAddr = log.address;
        methodName = 'ERC-20 Approval';
      } else if (topic0 === TOPIC_UNISWAP_SWAP_V2 || topic0 === TOPIC_UNISWAP_SWAP_V3) {
        eventType = 'SWAP';
        methodName = 'DEX Pool Swap';
      } else if (topic0 === TOPIC_WETH_DEPOSIT) {
        eventType = 'CONTRACT';
        methodName = 'Wrapped Token Deposit';
      }

      const logValueFloat =
        log.data && log.data !== '0x' && log.data.length <= 66
          ? formatUnits(log.data, 18)
          : parentTx?.value
          ? formatUnits(parentTx.value, 18)
          : 0;

      const rec = classifyActivityRecord(
        {
          id: `${txHash}-${parseInt(log.logIndex || '0x0', 16)}`,
          hash: txHash,
          blockNumber: blkNum,
          timestamp: approxTs,
          from: fromAddr,
          to: toAddr,
          spender: spenderAddr,
          valueFloat: logValueFloat,
          assetSymbol: topic0 === TOPIC_ERC20_TRANSFER || topic0 === TOPIC_ERC20_APPROVAL ? `TOKEN (${shortAddr(log.address)})` : symbol,
          input: parentTx?.input || '0x',
          approvalAmount: topic0 === TOPIC_ERC20_APPROVAL && /^0x[0-9a-f]{64}$/i.test(log.data || '')
            ? BigInt(log.data).toString()
            : undefined,
          eventType,
          methodName,
          source: 'Pharos RPC Logs'
        },
        cleanAddr,
        symbol
      );

      if (!collectedMap.has(rec.id)) {
        collectedMap.set(rec.id, rec);
      }
    }
  } catch {
    // Continue to recent block scan
  }

  // SocialScan has already indexed address history, so avoid a duplicate and
  // incomplete last-10-block scan when that source succeeded.
  const shouldScanRecentBlocks = !dataSourcesUsed.has('PharosScan SocialScan API');
  if (shouldScanRecentBlocks) {
  // Step 3: Scan recent blocks for direct native transactions involving the address
  onProgress('Scanning recent Pharos blocks for direct wallet transactions...');
  try {
    const blocksToCheck = 10;
    const blockPromises = [];
    for (let i = 0; i < blocksToCheck; i++) {
      const bNum = latestBlockNumber - i;
      if (bNum <= 0) continue;
      blockPromises.push(
        client.rpcCall('eth_getBlockByNumber', ['0x' + bNum.toString(16), true]).catch(() => null)
      );
    }
    const recentBlocks = await Promise.all(blockPromises);
    dataSourcesUsed.add('Pharos Direct Block Scanner');

    for (const blk of recentBlocks) {
      if (!blk || !Array.isArray(blk.transactions)) continue;
      const blkTs = parseInt(blk.timestamp, 16) * 1000;
      if (blkTs < startMs || blkTs > endMs) continue;
      const blkNum = parseInt(blk.number, 16);

      for (const tx of blk.transactions) {
        if (typeof tx !== 'object') continue;
        const isParticipant =
          tx.from?.toLowerCase() === cleanAddr.toLowerCase() ||
          tx.to?.toLowerCase() === cleanAddr.toLowerCase();
        if (!isParticipant) continue;

        const gasFee =
          tx.gas && tx.gasPrice
            ? formatUnits((BigInt(tx.gas) * BigInt(tx.gasPrice)).toString(), 18)
            : 0;

        const rec = classifyActivityRecord(
          {
            id: `${tx.hash}-0`,
            hash: tx.hash,
            blockNumber: blkNum,
            timestamp: blkTs,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            input: tx.input,
            gasFeeFloat: gasFee,
            source: 'Pharos Block RPC'
          },
          cleanAddr,
          symbol
        );
        collectedMap.set(rec.id, rec);
      }
    }
  } catch {
    // ignore block scan error
  }
  }

  const records = Array.from(collectedMap.values()).sort(
    (a, b) => b.timestamp - a.timestamp || b.blockNumber - a.blockNumber
  );

  return {
    records,
    sources: Array.from(dataSourcesUsed),
    warnings: dataWarnings
  };
}

function generateComplianceNarrative({
  accountSummary,
  categoryTotals,
  notableTxs
}) {
  const deterministicSummary = buildDeterministicComplianceSummary({
    address,
    networkName,
    symbol,
    startDate,
    endDate,
    accountSummary,
    categoryTotals,
    notableTxs
  });

  return deterministicSummary;
}

function buildDeterministicComplianceSummary({
  address,
  networkName,
  symbol,
  startDate,
  endDate,
  accountSummary,
  categoryTotals,
  notableTxs
}) {
  const totalTxCount = Object.values(categoryTotals).reduce((acc, c) => acc + c.count, 0);
  const netFlow = categoryTotals.transfers_in.volume - categoryTotals.transfers_out.volume;

  const p1 = `During the audit window from ${startDate} through ${endDate} on ${networkName}, account ${address} (${
    accountSummary.isContract ? 'Contract account (bytecode detected)' : 'Address with no bytecode detected'
  }) had a current balance snapshot of ${formatNumber(
    accountSummary.balance
  )} ${symbol}; its current transaction nonce is ${
    accountSummary.txCount
  }. The available explorer and recent RPC queries returned ${totalTxCount} activity records for the selected date range. Coverage depends on the indexer and recent-block limits described in the report.`;

  const p2 = `In the returned activity, inbound transfers totaled ${formatNumber(
    categoryTotals.transfers_in.volume
  )} ${symbol} across ${
    categoryTotals.transfers_in.count
  } credit entries, while outbound disbursements (Transfers Out) totaled ${formatNumber(
    categoryTotals.transfers_out.volume
  )} ${symbol} across ${
    categoryTotals.transfers_out.count
  } debit entries, resulting in a net transfer position of ${
    netFlow >= 0 ? '+' : ''
  }${formatNumber(netFlow)} ${symbol}. Additionally, the wallet executed ${
    categoryTotals.swaps.count
  } swap operations (${formatNumber(
    categoryTotals.swaps.volume
  )} ${symbol} notional) and ${
    categoryTotals.contract_interactions.count
  } smart contract interactions.`;

  const p3 =
    notableTxs.length > 0
      ? `Review note: ${
          categoryTotals.approvals.count > 0
            ? `The indexer returned ${categoryTotals.approvals.count} approval event(s); current allowance state was not queried. `
            : 'No approval events were returned by the available queries. '
        }The largest value-based entry in the returned sample occurred in block #${
          notableTxs[0].blockNumber
        } (${notableTxs[0].plainAction}, tx ${shortAddr(
          notableTxs[0].hash
        )}). Transaction links open PharosScan for independent inspection.`
      : `Review note: The address has a current balance snapshot of ${formatNumber(
          accountSummary.balance
        )} ${symbol} and ${
          accountSummary.txCount
        } current transaction nonce, no transactions were returned for ${startDate} – ${endDate}. Explorer pagination, recent-block RPC coverage, or endpoint availability may limit this result; it does not establish that the address had no activity.`;

  return `${p1}\n\n${p2}\n\n${p3}`;
}

export default function App() {
  // Default date range: past 30 days through today
  const [todayStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [thirtyDaysAgoStr] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });

  const [selectedNetKey, setSelectedNetKey] = useState('mainnet');
  const network = PHAROS_NETWORKS[selectedNetKey];

  const [walletInput, setWalletInput] = useState('');
  const [startDate, setStartDate] = useState(thirtyDaysAgoStr);
  const [endDate, setEndDate] = useState(todayStr);
  const auditInputsRef = useRef({ walletInput, startDate, endDate });
  const runLiveAuditRef = useRef(null);

  // Live chain telemetry
  const [chainTelemetry, setChainTelemetry] = useState({
    blockNumber: null,
    gasPriceGwei: null,
    via: 'Connecting…',
    loading: true,
    error: null
  });
  const [liveActiveAddresses, setLiveActiveAddresses] = useState([]);
  const [telemetryLogs, setTelemetryLogs] = useState([]);

  // Audit Report State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState('');
  const [auditError, setAuditError] = useState(null);
  const [auditReport, setAuditReport] = useState(null);

  // Book UI Controls
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookLayout, setBookLayout] = useState('spread'); // 'spread' | 'folio'
  const [copiedHash, setCopiedHash] = useState(null);
  const [exportToast, setExportToast] = useState(null);

  const appendTelemetryLog = useCallback((entry) => {
    setTelemetryLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString([], { hour12: false }),
        ...entry
      },
      ...prev.slice(0, 19)
    ]);
  }, []);

  // Connect & fetch live Pharos block & active addresses on mount or network switch
  const syncLiveNetworkState = useCallback(
    async (autoAuditFirstAddress = false) => {
      setChainTelemetry((prev) => ({ ...prev, loading: true, error: null }));
      const client = new PharosLiveClient(network, appendTelemetryLog);
      try {
        const status = await client.getChainStatus();
        setChainTelemetry({
          blockNumber: status.blockNumber,
          gasPriceGwei: status.gasPriceGwei,
          via: status.via,
          loading: false,
          error: null
        });

        const discovery = await client.discoverLiveActiveAddresses(status.blockNumber, 6);
        setLiveActiveAddresses(discovery.addresses);

        const { walletInput: currentWallet, startDate: currentStart, endDate: currentEnd } = auditInputsRef.current;
        if (autoAuditFirstAddress && discovery.addresses.length > 0 && !currentWallet) {
          const firstAddr = discovery.addresses[0].address;
          setWalletInput(firstAddr);
          runLiveAuditRef.current?.(firstAddr, currentStart, currentEnd, status.blockNumber, network);
        }
      } catch (err) {
        setChainTelemetry({
          blockNumber: null,
          gasPriceGwei: null,
          via: 'Offline',
          loading: false,
          error: err.message || 'Unable to reach Pharos RPC'
        });
      }
    },
    [network, appendTelemetryLog]
  );

  // Execute full live wallet audit
  const runLiveAudit = useCallback(
    async (targetAddr, startStr, endStr, knownBlockNum, netConfig = network) => {
      const addr = (targetAddr || walletInput).trim();
      if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
        setAuditError(
          'Please enter a valid 42-character hexadecimal EVM wallet address (0x…) or select a live active address from the latest Pharos block.'
        );
        return;
      }
      if (new Date(startStr) > new Date(endStr)) {
        setAuditError('Start date must be on or before the end date.');
        return;
      }

      setIsAuditing(true);
      setAuditError(null);
      setAuditProgress('Connecting to Pharos Chain MCP & JSON-RPC node…');

      const client = new PharosLiveClient(netConfig, appendTelemetryLog);

      try {
        let currentBlock = knownBlockNum;
        if (!currentBlock) {
          const status = await client.getChainStatus();
          currentBlock = status.blockNumber;
          setChainTelemetry({
            blockNumber: status.blockNumber,
            gasPriceGwei: status.gasPriceGwei,
            via: status.via,
            loading: false,
            error: null
          });
        }

        setAuditProgress('Reading live account balance, nonce & bytecode state…');
        const accountSummary = await client.getAccountSummary(addr);

        const { records, sources, warnings } = await fetchLiveWalletAuditData({
          client,
          address: addr,
          startDateStr: startStr,
          endDateStr: endStr,
          latestBlockNumber: currentBlock,
          onProgress: setAuditProgress
        });

        // Group into the 5 mandatory categories:
        // transfers_in, transfers_out, swaps, approvals, contract_interactions
        const grouped = {
          transfers_in: [],
          transfers_out: [],
          swaps: [],
          approvals: [],
          contract_interactions: []
        };

        const categoryTotals = {
          transfers_in: { count: 0, volume: 0, gasFees: 0 },
          transfers_out: { count: 0, volume: 0, gasFees: 0 },
          swaps: { count: 0, volume: 0, gasFees: 0 },
          approvals: { count: 0, volume: 0, gasFees: 0 },
          contract_interactions: { count: 0, volume: 0, gasFees: 0 }
        };

        for (const r of records) {
          const cat = grouped[r.category] ? r.category : 'contract_interactions';
          grouped[cat].push(r);
          categoryTotals[cat].count += 1;
          // ERC-20 amounts use token-specific units. Only aggregate native-token values here.
          if (r.isNativeAsset) {
            categoryTotals[cat].volume += r.valueFloat || 0;
          }
          categoryTotals[cat].gasFees += r.gasFeeFloat || 0;
        }

        // Notable transactions: sorted by materiality (valueFloat, approvals, swaps, recency)
        const notableTxs = [...records]
          .sort((a, b) => {
            const scoreA =
              (a.valueFloat || 0) * 10 +
              (a.category === 'approvals' ? 5 : 0) +
              (a.category === 'swaps' ? 8 : 0);
            const scoreB =
              (b.valueFloat || 0) * 10 +
              (b.category === 'approvals' ? 5 : 0) +
              (b.category === 'swaps' ? 8 : 0);
            return scoreB - scoreA || b.timestamp - a.timestamp;
          })
          .slice(0, 6);

        setAuditProgress('Synthesizing plain-language compliance narrative…');
        const narrative = generateComplianceNarrative({
          accountSummary,
          categoryTotals,
          notableTxs
        });

        setAuditReport({
          auditId: `PHR-AUD-${currentBlock}-${addr.slice(2, 6).toUpperCase()}`,
          generatedAt: new Date().toISOString(),
          address: addr,
          network: netConfig,
          blockHeight: currentBlock,
          startDate: startStr,
          endDate: endStr,
          accountSummary,
          records,
          grouped,
          categoryTotals,
          notableTxs,
          narrative,
          sources,
          warnings
        });
      } catch (err) {
        setAuditError(err.message || 'Live audit query failed.');
      } finally {
        setIsAuditing(false);
        setAuditProgress('');
      }
    },
    [walletInput, network, appendTelemetryLog]
  );

  useEffect(() => {
    auditInputsRef.current = { walletInput, startDate, endDate };
    runLiveAuditRef.current = runLiveAudit;
  }, [walletInput, startDate, endDate, runLiveAudit]);

  useEffect(() => {
    syncLiveNetworkState(true);
  }, [syncLiveNetworkState]);

  // Connect injected EVM wallet (MetaMask / OKX / Bitget)
  const handleConnectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        if (accounts && accounts[0]) {
          setWalletInput(accounts[0]);
          runLiveAudit(accounts[0], startDate, endDate, chainTelemetry.blockNumber, network);
        }
      } catch {
        setAuditError('Wallet connection request was declined.');
      }
    } else {
      setAuditError('No injected Web3 wallet detected in browser. Paste any Pharos address or pick a live active wallet below.');
    }
  };

  // Filtered ledger rows for the active tab and search query
  const filteredRecords = useMemo(() => {
    if (!auditReport) return [];
    const base =
      activeCategoryTab === 'all'
        ? auditReport.records
        : auditReport.grouped[activeCategoryTab] || [];
    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(
      (r) =>
        r.hash.toLowerCase().includes(q) ||
        r.plainAction.toLowerCase().includes(q) ||
        r.methodName.toLowerCase().includes(q) ||
        r.from.toLowerCase().includes(q) ||
        r.to.toLowerCase().includes(q)
    );
  }, [auditReport, activeCategoryTab, searchQuery]);

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  const showExportNotification = (format) => {
    setExportToast(`Exported wallet activity ledger as ${format}`);
    setTimeout(() => setExportToast(null), 3200);
  };

  const handleExportMarkdown = () => {
    if (!auditReport) return;
    const {
      auditId,
      address,
      network: net,
      blockHeight,
      startDate: sDate,
      endDate: eDate,
      accountSummary,
      categoryTotals,
      notableTxs,
      records,
      narrative
    } = auditReport;

    const md = [
      `# PHAROS NETWORK — WALLET ACTIVITY LEDGER`,
      `**Audit Reference:** \`${auditId}\`  `,
      `**Wallet Audited:** \`${address}\`  `,
      `**Network:** ${net.name} (Chain ID: ${net.chainId})  `,
      `**Audit Period:** ${sDate} to ${eDate}  `,
      `**Snapshot Block Height:** #${blockHeight}  `,
      `**Explorer Profile:** [${net.explorerUrl}/address/${address}](${net.explorerUrl}/address/${address})`,
      ``,
      `---`,
      ``,
      `## I. EXECUTIVE COMPLIANCE NARRATIVE`,
      narrative,
      ``,
      `---`,
      ``,
      `## II. ON-CHAIN ACCOUNT STANDING & CATEGORY TOTALS`,
      `- **Closing Balance:** ${formatNumber(accountSummary.balance)} ${net.symbol}`,
      `- **Current Transaction Nonce:** ${accountSummary.txCount}`,
      `- **Bytecode Check:** ${accountSummary.isContract ? 'Bytecode detected at the current block' : 'No bytecode detected at the current block'}`,
      ``,
      `| Category Code | Activity Category | Tx Count | Native-Token Volume (${net.symbol}) | Gas Fees (${net.symbol}) |`,
      `| :--- | :--- | ---: | ---: | ---: |`,
      ...Object.keys(CATEGORY_META).map((k) => {
        const meta = CATEGORY_META[k];
        const tot = categoryTotals[k];
        return `| ${meta.code} | **${meta.label}** | ${tot.count} | ${formatNumber(tot.volume)} | ${formatNumber(tot.gasFees, 6)} |`;
      }),
      ``,
      `---`,
      ``,
      `## III. NOTABLE TRANSACTIONS WITH VERIFICATION LINKS`,
      ...(notableTxs.length === 0
        ? [`_No transactions recorded inside this period._`]
        : notableTxs.map(
            (tx, i) =>
              `${i + 1}. **[${CATEGORY_META[tx.category]?.label || tx.category}]** ${tx.plainAction} — **${formatNumber(tx.valueFloat)} ${tx.assetSymbol}** (Block #${tx.blockNumber}) · [Verify on PharosScan](${net.explorerUrl}/tx/${tx.hash})`
          )),
      ``,
      `---`,
      ``,
      `## IV. COMPLETE CATEGORIZED LEDGER ENTRIES (${records.length})`,
      `| Timestamp (UTC) | Category | Plain-Language Description | Value | Counterparty | Tx Hash Link |`,
      `| :--- | :--- | :--- | ---: | :--- | :--- |`,
      ...records.map((tx) => {
        const iso = new Date(tx.timestamp).toISOString().replace('T', ' ').slice(0, 19);
        const cp = tx.direction === 'IN' ? tx.from : tx.to;
        return `| ${iso} | ${CATEGORY_META[tx.category]?.shortLabel || tx.category} | ${tx.plainAction} | ${formatNumber(tx.valueFloat)} ${tx.assetSymbol} | \`${shortAddr(cp)}\` | [\`${shortAddr(tx.hash)}\`](${net.explorerUrl}/tx/${tx.hash}) |`;
      })
    ].join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${auditId}-${address.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showExportNotification('Markdown (.md)');
  };

  const handleExportCSV = () => {
    if (!auditReport) return;
    const { auditId, address, network: net, records } = auditReport;
    const headers = [
      'Audit_ID',
      'Timestamp_ISO',
      'Block_Number',
      'Category_Code',
      'Category_Name',
      'Direction',
      'Plain_Language_Activity',
      'Method',
      'From_Address',
      'To_Address',
      'Amount',
      'Asset_Symbol',
      'Gas_Fee',
      'Status',
      'Transaction_Hash',
      'Explorer_URL'
    ];

    const escapeCsv = (val) => {
      const value = String(val ?? '');
      const str = typeof val === 'string' && /^[=+@\-\t\r]/.test(value)
        ? `'${value}`
        : value;
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = records.map((tx) => [
      auditId,
      new Date(tx.timestamp).toISOString(),
      tx.blockNumber,
      CATEGORY_META[tx.category]?.code || 'CAT-05',
      CATEGORY_META[tx.category]?.label || tx.category,
      tx.direction,
      tx.plainAction,
      tx.methodName,
      tx.from,
      tx.to,
      tx.valueFloat,
      tx.assetSymbol,
      tx.gasFeeFloat,
      tx.status,
      tx.hash,
      `${net.explorerUrl}/tx/${tx.hash}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map(escapeCsv).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${auditId}-${address.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showExportNotification('CSV Spreadsheet (.csv)');
  };

  const handleExportPDF = () => {
    if (!auditReport) return;
    showExportNotification('PDF Audit Ledger (Print Dialog)');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#EAE5DB] text-[#18181B] font-sans antialiased selection:bg-[#001CE6]/15 selection:text-[#001CE6] overflow-x-hidden print:bg-white print:pb-0">
      {/* Custom Editorial Book Typography, Fluid Scaling & Print Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-editorial { font-family: 'Newsreader', Georgia, Cambria, serif; }
        .font-mono-ledger { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
        .ledger-paper {
          background-color: #FAF8F3;
          background-image: 
            radial-gradient(rgba(24, 24, 27, 0.028) 1px, transparent 0),
            linear-gradient(to bottom, rgba(24, 24, 27, 0.022) 1px, transparent 1px);
          background-size: 24px 24px, 100% 34px;
        }
        .book-spine-shadow {
          background: linear-gradient(
            90deg,
            rgba(24, 24, 27, 0) 0%,
            rgba(24, 24, 27, 0.035) 42%,
            rgba(24, 24, 27, 0.11) 50%,
            rgba(24, 24, 27, 0.035) 58%,
            rgba(24, 24, 27, 0) 100%
          );
        }
        .book-outer-shadow {
          box-shadow: 
            0 24px 54px -16px rgba(24, 20, 12, 0.14),
            0 6px 18px -4px rgba(24, 20, 12, 0.07),
            0 0 0 1px rgba(24, 24, 27, 0.09),
            5px 7px 0 0 #E4DECFE6,
            10px 14px 0 0 #D6CEBFE6;
        }
        .folio-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(24, 24, 27, 0.09);
          box-shadow: 0 2px 8px -2px rgba(24, 20, 12, 0.04);
        }
        @media print {
          .no-print { display: none !important; }
          .book-outer-shadow { box-shadow: none !important; }
          .ledger-paper { background-image: none !important; background-color: #ffffff !important; }
        }
      `}</style>

      {/* Top Toast Notification */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#18181B] text-[#FAF8F3] px-4 py-2.5 rounded-full shadow-2xl border border-white/10 text-xs font-medium no-print animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportToast}</span>
        </div>
      )}

      {}
      {/* Compact Apple-style Top Command & Telemetry Ribbon */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#EAE5DB]/90 border-b border-zinc-900/10 px-4 sm:px-6 lg:px-10 2xl:px-14 py-3 no-print">
        <div className="w-full max-w-[1860px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* App Title with Attached Pharos Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-zinc-900/10 flex items-center justify-center p-1.5 shrink-0">
              <PharosLogo className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-editorial text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 leading-none">
                  Pharos Audit-Log Agent
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-ledger font-semibold uppercase tracking-wider bg-[#001CE6]/10 text-[#001CE6] border border-[#001CE6]/20">
                  LIVE AUDIT
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-600 mt-0.5">
                On-Chain Compliance Ledger & Plain-Language Financial Audit Book
              </p>
            </div>
          </div>

          {/* Center: Live Pharos MCP + RPC Telemetry Pill */}
          <div className="flex items-center gap-2.5 bg-[#FAF8F3] px-3.5 py-1.5 rounded-full border border-zinc-900/10 shadow-2xs text-xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  chainTelemetry.error ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  chainTelemetry.error ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
              />
            </span>

            {/* Network Selector */}
            <select
              value={selectedNetKey}
              onChange={(e) => setSelectedNetKey(e.target.value)}
              className="bg-transparent font-medium text-zinc-900 focus:outline-none cursor-pointer pr-1 text-xs"
              aria-label="Select Pharos Network"
            >
              {Object.values(PHAROS_NETWORKS).map((net) => (
                <option key={net.id} value={net.id}>
                  {net.name} (#{net.chainId})
                </option>
              ))}
            </select>

            <span className="text-zinc-300">|</span>

            <div className="flex items-center gap-1.5 font-mono-ledger text-[11px] text-zinc-700">
              <Server className="w-3.5 h-3.5 text-[#001CE6]" />
              <span>{chainTelemetry.via}</span>
            </div>

            {chainTelemetry.blockNumber && (
              <>
                <span className="text-zinc-300 hidden sm:inline">|</span>
                <span className="hidden sm:inline font-mono-ledger text-[11px] text-zinc-800 font-medium">
                  Block #{chainTelemetry.blockNumber.toLocaleString()}
                </span>
              </>
            )}

            <button
              onClick={() => syncLiveNetworkState(false)}
              title="Refresh Live Pharos Block & Active Wallets"
              className="p-1 rounded-full hover:bg-zinc-200/70 text-zinc-600 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${chainTelemetry.loading ? 'animate-spin text-[#001CE6]' : ''}`}
              />
            </button>
          </div>

          {/* Right: Book View Toggle & Export Quick Bar */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center bg-[#FAF8F3] p-0.5 rounded-lg border border-zinc-900/10 text-xs">
              <button
                onClick={() => setBookLayout('spread')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  bookLayout === 'spread'
                    ? 'bg-zinc-900 text-[#FAF8F3] shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Open Spread
              </button>
              <button
                onClick={() => setBookLayout('folio')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  bookLayout === 'folio'
                    ? 'bg-zinc-900 text-[#FAF8F3] shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Single Folio
              </button>
            </div>

            <button
              onClick={handleConnectWallet}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-900/15 text-xs font-medium shadow-2xs transition-all cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-[#001CE6]" />
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>
      </header>

      {}
      {/* Main Container: Full-Viewport Fluid Canvas with Balanced Breathing Room */}
      <main className="flex-1 w-full max-w-[1860px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-5 lg:py-7 flex flex-col gap-5">
        {/* Requirement Compliance Verification Bar (Compact Pinterest-style Status Pills) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F3]/95 border border-zinc-900/10 rounded-2xl px-4 sm:px-5 py-2.5 shadow-xs no-print">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="font-mono-ledger uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5 mr-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#001CE6]" />
              Spec Checks:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              01 Wallet + Date Range
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              02 5-Category Grouping
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              03 Category Totals + Notable Links
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              04 Export MD / PDF / CSV
            </span>
          </div>

          {/* Live Discovered Addresses on Pharos right now */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-0.5">
            <span className="text-[11px] font-mono-ledger text-zinc-500 shrink-0 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-[#001CE6] animate-pulse" />
              Live Block Wallets:
            </span>
            {liveActiveAddresses.length === 0 ? (
              <span className="text-[11px] text-zinc-400 italic">Scanning live blocks…</span>
            ) : (
              liveActiveAddresses.slice(0, 5).map((item) => (
                <button
                  key={item.address}
                  onClick={() => {
                    setWalletInput(item.address);
                    runLiveAudit(
                      item.address,
                      startDate,
                      endDate,
                      chainTelemetry.blockNumber,
                      network
                    );
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono-ledger text-[11px] border transition-all shrink-0 cursor-pointer ${
                    walletInput.toLowerCase() === item.address.toLowerCase()
                      ? 'bg-[#001CE6] text-white border-[#001CE6] shadow-2xs'
                      : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-300/80'
                  }`}
                  title={`${item.role} in Block #${item.blockNumber}`}
                >
                  {shortAddr(item.address)}
                </button>
              ))
            )}
          </div>
        </div>

        {/* THE AUDIT BOOK SPREAD — Expands to fill available viewport height on 1080p+ */}
        <div className="flex-1 flex flex-col relative rounded-2xl ledger-paper book-outer-shadow border border-zinc-900/15 overflow-hidden">
          {/* Decorative Top Binding Stitch Bar */}
          <div className="h-2 bg-gradient-to-r from-[#001CE6] via-[#2942F5] to-[#001CE6] shrink-0" />

          {/* Book Header / Ledger Control Strip (Requirement 01: Wallet Address + Date Range + Exports) */}
          <div className="border-b border-zinc-900/10 bg-[#F4EFE4]/90 px-5 sm:px-7 lg:px-9 py-4 lg:py-5 no-print shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runLiveAudit(
                  walletInput,
                  startDate,
                  endDate,
                  chainTelemetry.blockNumber,
                  network
                );
              }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-end"
            >
              {/* Wallet Address Input */}
              <div className="lg:col-span-5">
                <label className="block text-[10px] font-mono-ledger uppercase tracking-widest text-zinc-600 font-semibold mb-1.5">
                  01A · Target Wallet or Contract Address (Pharos {network.name})
                </label>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                    placeholder="0x… Enter any live Pharos wallet or click a Live Block Wallet above"
                    className="w-full pl-10 pr-20 py-2.5 bg-white rounded-xl border border-zinc-900/15 font-mono-ledger text-xs text-zinc-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#001CE6]/25 focus:border-[#001CE6] transition-all"
                  />
                  {walletInput && (
                    <button
                      type="button"
                      onClick={() => handleCopy(walletInput)}
                      className="absolute right-2.5 px-2.5 py-1 text-[10px] font-mono-ledger bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-md border border-zinc-300/80 cursor-pointer transition-colors"
                    >
                      {copiedHash === walletInput ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>

              {/* Start Date & End Date Inputs */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-ledger uppercase tracking-widest text-zinc-600 font-semibold mb-1.5">
                    01B · Period Start
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white rounded-xl border border-zinc-900/15 font-mono-ledger text-xs text-zinc-900 shadow-2xs focus:outline-none focus:border-[#001CE6] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono-ledger uppercase tracking-widest text-zinc-600 font-semibold mb-1.5">
                    01C · Period End
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white rounded-xl border border-zinc-900/15 font-mono-ledger text-xs text-zinc-900 shadow-2xs focus:outline-none focus:border-[#001CE6] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Run Audit Button & Requirement 04 Export Actions */}
              <div className="lg:col-span-3 flex items-center gap-2.5">
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#001CE6] hover:bg-[#0015B3] disabled:opacity-60 text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
                >
                  {isAuditing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Auditing Chain…</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Compile Audit Folio</span>
                    </>
                  )}
                </button>

                {/* Export Dropdown / Buttons (Requirement 04: Markdown, PDF, CSV) */}
                <div className="flex items-center bg-white rounded-xl border border-zinc-900/15 p-1 shadow-2xs">
                  <button
                    type="button"
                    disabled={!auditReport}
                    onClick={handleExportMarkdown}
                    title="Export Audit Report as Markdown (.md)"
                    className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-40 text-zinc-800 text-[11px] font-mono-ledger font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#001CE6]" />
                    <span>MD</span>
                  </button>
                  <button
                    type="button"
                    disabled={!auditReport}
                    onClick={handleExportPDF}
                    title="Export / Print Audit Report as PDF"
                    className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-40 text-zinc-800 text-[11px] font-mono-ledger font-medium flex items-center gap-1 cursor-pointer border-x border-zinc-200 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#001CE6]" />
                    <span>PDF</span>
                  </button>
                  <button
                    type="button"
                    disabled={!auditReport}
                    onClick={handleExportCSV}
                    title="Export Audit Report as CSV (.csv)"
                    className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-40 text-zinc-800 text-[11px] font-mono-ledger font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#001CE6]" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Error or Progress Banner */}
            {auditError && (
              <div className="mt-3.5 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{auditError}</span>
              </div>
            )}
            {auditReport?.warnings?.length > 0 && (
              <div className="mt-3.5 space-y-1 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                {auditReport.warnings.map((warning) => (
                  <p key={warning} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                    <span>{warning}</span>
                  </p>
                ))}
              </div>
            )}
            {isAuditing && auditProgress && (
              <div className="mt-3.5 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#001CE6]/5 border border-[#001CE6]/15 text-[#001CE6] text-xs font-mono-ledger">
                <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>{auditProgress}</span>
              </div>
            )}
          </div>

          {}
          {/* TWO-PAGE OPEN AUDIT BOOK SPREAD */}
          <div
            className={`flex-1 relative grid grid-cols-1 ${
              bookLayout === 'spread' ? 'xl:grid-cols-12' : 'xl:grid-cols-1'
            }`}
          >
            {/* Center Spine Shadow (visible in 2-page spread mode on desktop) */}
            {bookLayout === 'spread' && (
              <div className="hidden xl:block pointer-events-none absolute inset-y-0 left-[41.666667%] -translate-x-1/2 w-14 book-spine-shadow z-10" />
            )}

            {/* ===================================================================
                LEFT PAGE (FOLIO I): EXECUTIVE AUDIT REPORT, TOTALS & NOTABLE TXS
               =================================================================== */}
            <section
              className={`${
                bookLayout === 'spread'
                  ? 'xl:col-span-5 xl:border-r border-zinc-900/10'
                  : ''
              } p-6 sm:p-8 lg:p-9 2xl:p-10 flex flex-col justify-between gap-7`}
            >
              <div className="space-y-6">
                {/* Folio Header */}
                <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-3.5">
                  <div className="flex items-center gap-3">
                    <PharosLogo className="w-6 h-6 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono-ledger uppercase tracking-widest text-zinc-500 block">
                        FOLIO I · COMPLIANCE & ACCOUNTING SUMMARY
                      </span>
                      <h2 className="font-editorial text-xl sm:text-2xl font-semibold text-zinc-900 leading-tight">
                        Executive Audit Dossier
                      </h2>
                    </div>
                  </div>
                  <div className="text-right font-mono-ledger">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                      LEDGER REF
                    </span>
                    <span className="text-xs font-semibold text-[#001CE6]">
                      {auditReport?.auditId || 'AWAITING-INPUT'}
                    </span>
                  </div>
                </div>

                {auditReport ? (
                  <>
                    {/* Audited Entity Metadata Stamp Card */}
                    <div className="folio-card rounded-2xl p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-dashed border-zinc-200">
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono-ledger uppercase tracking-wider text-zinc-500 block">
                            Audited Wallet Address
                          </span>
                          <div className="flex items-center gap-2.5 mt-1">
                            <span className="font-mono-ledger text-xs sm:text-sm font-semibold text-zinc-900 break-all">
                              {auditReport.address}
                            </span>
                            <a
                              href={`${auditReport.network.explorerUrl}/address/${auditReport.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#001CE6] hover:underline inline-flex items-center gap-1 text-[11px] font-mono-ledger shrink-0 px-2 py-0.5 rounded-md bg-[#001CE6]/8"
                              title="Open Address on PharosScan"
                            >
                              <span>Explorer</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono-ledger font-semibold uppercase bg-zinc-900 text-[#FAF8F3]">
                          {auditReport.accountSummary.isContract
                            ? 'Smart Contract'
                            : 'EOA Wallet'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 font-mono-ledger">
                        <div className="bg-[#FAF8F3] rounded-xl p-2.5 border border-zinc-900/5">
                          <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">
                            Closing Balance
                          </span>
                          <span className="text-sm font-semibold text-zinc-900">
                            {formatNumber(auditReport.accountSummary.balance)}{' '}
                            <span className="text-[11px] text-[#001CE6]">
                              {auditReport.network.symbol}
                            </span>
                          </span>
                        </div>
                        <div className="bg-[#FAF8F3] rounded-xl p-2.5 border border-zinc-900/5">
                          <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">
                            Current Nonce
                          </span>
                          <span className="text-sm font-semibold text-zinc-900">
                            {auditReport.accountSummary.txCount.toLocaleString()} txs
                          </span>
                        </div>
                        <div className="bg-[#FAF8F3] rounded-xl p-2.5 border border-zinc-900/5">
                          <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">
                            Audit Window
                          </span>
                          <span className="text-[11px] font-medium text-zinc-800 block truncate">
                            {auditReport.startDate} → {auditReport.endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Plain-Language Activity Report for Compliance Officer / Accountant */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono-ledger uppercase tracking-wider font-semibold text-zinc-700 flex items-center gap-1.5">
                          <Scale className="w-3.5 h-3.5 text-[#001CE6]" />
                          Plain-Language Activity Summary
                        </h3>
                        <span className="text-[10px] font-mono-ledger text-zinc-500">
                          Compliance & Accounting Narrative
                        </span>
                      </div>
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#F4EFE4] border border-zinc-900/10 font-editorial text-[15px] leading-relaxed text-zinc-800 space-y-3 whitespace-pre-line shadow-2xs">
                        {auditReport.narrative}
                      </div>
                    </div>

                    {/* Requirement 02 & 03: Category Totals Ledger Table */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono-ledger uppercase tracking-wider font-semibold text-zinc-700 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#001CE6]" />
                          Schedule A · Totals Per Activity Category
                        </h3>
                        <span className="text-[10px] font-mono-ledger text-zinc-500">
                          INDEXED ACTIVITY SAMPLE
                        </span>
                      </div>

                      <div className="folio-card rounded-2xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-zinc-200 bg-zinc-50/90 text-[10px] font-mono-ledger uppercase text-zinc-500">
                              <th className="py-2.5 px-3.5">Category</th>
                              <th className="py-2.5 px-2.5 text-right">Count</th>
                              <th className="py-2.5 px-3.5 text-right">
                                Native Volume ({auditReport.network.symbol})
                              </th>
                              <th className="py-2.5 px-3.5 text-right">Gas Fees</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200/70 text-xs">
                            {Object.keys(CATEGORY_META).map((catKey) => {
                              const meta = CATEGORY_META[catKey];
                              const tot = auditReport.categoryTotals[catKey];
                              const Icon = meta.icon;
                              const isSelected = activeCategoryTab === catKey;
                              return (
                                <tr
                                  key={catKey}
                                  onClick={() =>
                                    setActiveCategoryTab(
                                      isSelected ? 'all' : catKey
                                    )
                                  }
                                  className={`cursor-pointer transition-colors ${
                                    isSelected
                                      ? 'bg-[#001CE6]/8 font-medium'
                                      : 'hover:bg-zinc-50/90'
                                  }`}
                                >
                                  <td className="py-3 px-3.5">
                                    <div className="flex items-center gap-2.5">
                                      <span
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${meta.badgeBg}`}
                                      >
                                        <Icon className="w-3.5 h-3.5" />
                                      </span>
                                      <div>
                                        <div className="font-medium text-zinc-900 leading-tight">
                                          {meta.label}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 mt-0.5">
                                          {meta.description}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-2.5 text-right font-mono-ledger font-semibold text-zinc-900">
                                    {tot.count}
                                  </td>
                                  <td className="py-3 px-3.5 text-right font-mono-ledger text-zinc-800">
                                    {formatNumber(tot.volume)}
                                  </td>
                                  <td className="py-3 px-3.5 text-right font-mono-ledger text-zinc-500 text-[11px]">
                                    {formatNumber(tot.gasFees, 5)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="border-t-2 border-zinc-900 bg-[#F4EFE4] font-mono-ledger text-xs font-semibold">
                              <td className="py-2.5 px-3.5 text-zinc-900">
                                TOTAL AUDIT LEDGER
                              </td>
                              <td className="py-2.5 px-2.5 text-right text-[#001CE6]">
                                {auditReport.records.length}
                              </td>
                              <td className="py-2.5 px-3.5 text-right text-zinc-900">
                                {formatNumber(
                                  Object.values(
                                    auditReport.categoryTotals
                                  ).reduce((s, c) => s + c.volume, 0)
                                )}{' '}
                                {auditReport.network.symbol}
                              </td>
                              <td className="py-2.5 px-3.5 text-right text-zinc-600 text-[11px]">
                                {formatNumber(
                                  Object.values(
                                    auditReport.categoryTotals
                                  ).reduce((s, c) => s + c.gasFees, 0),
                                  5
                                )}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <p className="text-[10px] leading-relaxed text-zinc-500">
                        Volume totals include native-token amounts only. ERC-20 amounts use token-specific decimals and are shown per record without being combined here.
                      </p>
                    </div>

                    {/* Requirement 03: Notable Transactions With Direct Explorer Links */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono-ledger uppercase tracking-wider font-semibold text-zinc-700 flex items-center gap-1.5">
                          <Bookmark className="w-3.5 h-3.5 text-[#001CE6]" />
                          Schedule B · Notable Transactions (Materiality Ranked)
                        </h3>
                        <span className="text-[10px] font-mono-ledger text-zinc-500">
                          Direct PharosScan Links
                        </span>
                      </div>

                      {auditReport.notableTxs.length === 0 ? (
                        <div className="p-4 rounded-2xl bg-white/80 border border-zinc-200 text-xs text-zinc-600">
                          No notable transactions recorded in this date window. Select a live active wallet from the top bar to inspect recent high-value transactions.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {auditReport.notableTxs.map((tx, idx) => {
                            const meta =
                              CATEGORY_META[tx.category] ||
                              CATEGORY_META.contract_interactions;
                            return (
                              <div
                                key={tx.id}
                                className="p-3.5 rounded-2xl folio-card hover:border-[#001CE6]/40 transition-all flex items-start justify-between gap-3.5"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="font-mono-ledger text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-white">
                                      #{idx + 1}
                                    </span>
                                    <span
                                      className={`text-[10px] font-mono-ledger font-semibold px-2 py-0.5 rounded border ${meta.badgeBg}`}
                                    >
                                      {meta.label}
                                    </span>
                                    <span className="text-[11px] font-mono-ledger text-zinc-500">
                                      Block #{tx.blockNumber}
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium text-zinc-900 leading-snug">
                                    {tx.plainAction}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2 text-[11px] font-mono-ledger text-zinc-500">
                                    <span>
                                      {new Date(tx.timestamp).toLocaleString()}
                                    </span>
                                    <span>·</span>
                                    <a
                                      href={`${auditReport.network.explorerUrl}/tx/${tx.hash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#001CE6] hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                      <span>{shortAddr(tx.hash)}</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>

                                <div className="text-right font-mono-ledger shrink-0">
                                  <div className="text-xs font-semibold text-zinc-900">
                                    {formatNumber(tx.valueFloat)}
                                  </div>
                                  <div className="text-[10px] text-zinc-500">
                                    {tx.assetSymbol}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center text-zinc-500 text-sm">
                    Connecting to live Pharos Network RPC & compiling initial wallet audit…
                  </div>
                )}
              </div>

              {/* Left Folio Footer */}
              <div className="pt-4 border-t border-zinc-900/10 flex items-center justify-between text-[11px] font-mono-ledger text-zinc-500">
                <span>PHAROS AUDIT BOOK · PAGE 01</span>
                <span>CHAIN ID {network.chainId} ({network.symbol})</span>
              </div>
            </section>

            {}
            {/* ===================================================================
                RIGHT PAGE (FOLIO II): CATEGORIZED ON-CHAIN TRANSACTION LEDGER
               =================================================================== */}
            <section
              className={`${
                bookLayout === 'spread' ? 'xl:col-span-7' : 'border-t border-zinc-900/10'
              } p-6 sm:p-8 lg:p-9 2xl:p-10 flex flex-col justify-between gap-7`}
            >
              <div className="flex-1 flex flex-col space-y-5">
                {/* Folio II Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-zinc-900 pb-3.5">
                  <div>
                    <span className="text-[10px] font-mono-ledger uppercase tracking-widest text-zinc-500 block">
                      FOLIO II · ITEMIZED CHRONOLOGICAL JOURNAL
                    </span>
                    <h2 className="font-editorial text-xl sm:text-2xl font-semibold text-zinc-900 leading-tight">
                      Categorized On-Chain Activity Ledger
                    </h2>
                  </div>

                  {/* Search inside Ledger */}
                  <div className="relative w-full sm:w-64 no-print">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter hash, method, address…"
                      className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-zinc-900/15 text-xs font-mono-ledger shadow-2xs focus:outline-none focus:border-[#001CE6] transition-all"
                    />
                  </div>
                </div>

                {/* Book Index Tabs for the 5 Required Categories */}
                <div className="flex flex-wrap items-center gap-2 no-print">
                  <button
                    onClick={() => setActiveCategoryTab('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeCategoryTab === 'all'
                        ? 'bg-zinc-900 text-[#FAF8F3] shadow-2xs'
                        : 'bg-white/90 hover:bg-white text-zinc-700 border border-zinc-900/10'
                    }`}
                  >
                    <span>All Entries</span>
                    <span className="font-mono-ledger text-[10px] px-1.5 py-0.5 rounded-md bg-white/20">
                      {auditReport?.records.length || 0}
                    </span>
                  </button>

                  {Object.keys(CATEGORY_META).map((catKey) => {
                    const meta = CATEGORY_META[catKey];
                    const count =
                      auditReport?.categoryTotals?.[catKey]?.count || 0;
                    const Icon = meta.icon;
                    const active = activeCategoryTab === catKey;
                    return (
                      <button
                        key={catKey}
                        onClick={() => setActiveCategoryTab(catKey)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                          active
                            ? 'bg-[#001CE6] text-white border-[#001CE6] shadow-2xs'
                            : 'bg-white/90 hover:bg-white text-zinc-700 border-zinc-900/10'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{meta.shortLabel}</span>
                        <span
                          className={`font-mono-ledger text-[10px] px-1.5 py-0.5 rounded-md ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Ledger Entries Table — Expands fluidly on 1080p screens */}
                <div className="flex-1 folio-card rounded-2xl overflow-hidden flex flex-col">
                  <div className="overflow-x-auto flex-1 max-h-[640px] 2xl:max-h-[720px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 z-10 bg-[#F4EFE4] border-b border-zinc-300 text-[10px] font-mono-ledger uppercase text-zinc-600">
                        <tr>
                          <th className="py-3 px-4">Date / Block</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-4">Plain-Language Audit Entry</th>
                          <th className="py-3 px-4 text-right">Amount</th>
                          <th className="py-3 px-4 text-right">Tx Proof</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200/80 text-xs">
                        {filteredRecords.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-16 px-6 text-center text-zinc-500"
                            >
                              <div className="max-w-md mx-auto space-y-3">
                                <p className="font-editorial text-base text-zinc-800 font-medium">
                                  No Ledger Entries Found in Selected Filter
                                </p>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                  Click any of the live active wallets discovered on Pharos block #{chainTelemetry.blockNumber || 'latest'} below to inspect live transactions immediately:
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 pt-1">
                                  {liveActiveAddresses.map((item) => (
                                    <button
                                      key={item.address}
                                      onClick={() => {
                                        setActiveCategoryTab('all');
                                        setWalletInput(item.address);
                                        runLiveAudit(
                                          item.address,
                                          startDate,
                                          endDate,
                                          chainTelemetry.blockNumber,
                                          network
                                        );
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-[#001CE6]/10 hover:bg-[#001CE6] text-[#001CE6] hover:text-white font-mono-ledger text-[11px] transition-colors cursor-pointer"
                                    >
                                      Audit {shortAddr(item.address)} ({item.role})
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredRecords.map((tx) => {
                            const meta =
                              CATEGORY_META[tx.category] ||
                              CATEGORY_META.contract_interactions;
                            const Icon = meta.icon;
                            return (
                              <tr
                                key={tx.id}
                                className="hover:bg-[#FAF8F3] transition-colors group"
                              >
                                <td className="py-3.5 px-4 font-mono-ledger whitespace-nowrap">
                                  <div className="text-[11px] font-medium text-zinc-900">
                                    {new Date(tx.timestamp).toLocaleDateString(
                                      undefined,
                                      {
                                        month: 'short',
                                        day: '2-digit',
                                        year: 'numeric'
                                      }
                                    )}
                                  </div>
                                  <div className="text-[10px] text-zinc-500 mt-0.5">
                                    {new Date(tx.timestamp).toLocaleTimeString(
                                      [],
                                      { hour12: false }
                                    )}{' '}
                                    · #{tx.blockNumber}
                                  </div>
                                </td>

                                <td className="py-3.5 px-3 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono-ledger font-semibold border ${meta.badgeBg}`}
                                  >
                                    <Icon className="w-3 h-3" />
                                    <span>{meta.shortLabel}</span>
                                  </span>
                                </td>

                                <td className="py-3.5 px-4">
                                  <div className="font-medium text-zinc-900 leading-snug">
                                    {tx.plainAction}
                                  </div>
                                  <div className="text-[11px] font-mono-ledger text-zinc-500 mt-1 flex flex-wrap items-center gap-2">
                                    <span>Method: {tx.methodName}</span>
                                    <span>·</span>
                                    <span>
                                      {tx.direction === 'IN'
                                        ? `From ${shortAddr(tx.from)}`
                                        : `To ${shortAddr(tx.to)}`}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 text-right font-mono-ledger whitespace-nowrap">
                                  <div
                                    className={`font-semibold ${
                                      tx.category === 'transfers_in'
                                        ? 'text-emerald-700'
                                        : tx.category === 'transfers_out'
                                        ? 'text-rose-700'
                                        : 'text-zinc-900'
                                    }`}
                                  >
                                    {tx.category === 'transfers_in'
                                      ? '+'
                                      : tx.category === 'transfers_out'
                                      ? '-'
                                      : ''}
                                    {formatNumber(tx.valueFloat)}
                                  </div>
                                  <div className="text-[10px] text-zinc-500 mt-0.5">
                                    {tx.assetSymbol}
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 text-right font-mono-ledger whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5">
                                    <a
                                      href={`${network.explorerUrl}/tx/${tx.hash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-[#001CE6] text-zinc-800 hover:text-white text-[11px] transition-colors inline-flex items-center gap-1"
                                      title="Verify Transaction on PharosScan"
                                    >
                                      <span>{shortAddr(tx.hash)}</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(tx.hash)}
                                      className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                                      title="Copy Transaction Hash"
                                    >
                                      {copiedHash === tx.hash ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Live Pharos Chain MCP & JSON-RPC Verification Log Drawer */}
                <div className="bg-[#18181B] text-zinc-200 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-inner no-print">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2 text-[11px] font-mono-ledger">
                      <Terminal className="w-3.5 h-3.5 text-[#5C73F2]" />
                      <span className="font-semibold text-white">
                        LIVE PHAROS CHAIN MCP & RPC AUDIT STREAM
                      </span>
                      <span className="text-zinc-500 hidden sm:inline">
                        ({network.mcpUrl} · {network.rpcUrls[0]})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-ledger text-emerald-400">
                      Live endpoints · coverage varies by source
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-28 overflow-y-auto font-mono-ledger text-[11px]">
                    {telemetryLogs.length === 0 ? (
                      <div className="text-zinc-500">
                        Initializing Pharos RPC handshake…
                      </div>
                    ) : (
                      telemetryLogs.slice(0, 6).map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between gap-2 bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-800/80"
                        >
                          <div className="truncate">
                            <span className="text-zinc-500 mr-1.5">
                              [{log.time}]
                            </span>
                            <span className="text-[#788BFF] font-medium">
                              {log.source}:
                            </span>{' '}
                            <span className="text-zinc-300">{log.method}</span>
                          </div>
                          <span className="text-emerald-400 text-[10px] shrink-0">
                            {log.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Folio Footer */}
              <div className="pt-4 border-t border-zinc-900/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-ledger text-zinc-500">
                <span>PHAROS AUDIT BOOK · PAGE 02</span>
                <span>
                  SOURCES:{' '}
                  {auditReport?.sources?.length
                    ? auditReport.sources.join(' + ')
                    : 'Pharos Live JSON-RPC & MCP'}
                </span>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
