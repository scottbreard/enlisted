#!/bin/bash
# Weekly Enlisted data refresh — run by cron (see crontab).
# 1. Issuer sync from Cboe Canada CSV (upsert, catches new listings/delistings)
# 2. Newsfile scrape → new IR/PR firms discovered from press-release contacts
cd /Users/scottbreard/enlisted
PATH=/opt/homebrew/bin:/usr/bin:/bin
LOG=logs/weekly-sync-$(date +%Y-%m-%d).log
mkdir -p logs
{
  echo "=== Weekly sync $(date) ==="
  echo "--- Issuer sync (Cboe) ---"
  node scripts/seed/issuers.mjs
  echo "--- Newsfile scrape (400 releases) ---"
  node scripts/seed/ir-firms.mjs --releases 400
  echo "--- Load discovered firms ---"
  node scripts/seed/ir-firms.mjs --load
  echo "=== Done $(date) ==="
} >> "$LOG" 2>&1
# Keep last 8 logs
ls -t logs/weekly-sync-*.log 2>/dev/null | tail -n +9 | xargs rm -f 2>/dev/null
