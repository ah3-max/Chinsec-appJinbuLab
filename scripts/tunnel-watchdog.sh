#!/usr/bin/env bash
# Cloudflared watchdog — restarts the tunnel if it dies or returns "Tunnel not found"
# Usage: nohup ./scripts/tunnel-watchdog.sh > /tmp/cf-watchdog.log 2>&1 &
#
# Why: Cloudflare's free quick-tunnels can be revoked after periods of inactivity
# or network blips, leaving the daemon spinning forever on "Unauthorized: Tunnel
# not found". This script catches that and restarts to get a fresh URL.

LOG_FILE="/tmp/cf.log"
LOCAL_URL="http://localhost:3003"
URL_FILE="/tmp/cf-current-url.txt"
CHECK_INTERVAL=30

start_tunnel() {
  echo "[$(date '+%H:%M:%S')] starting cloudflared..." >&2
  pkill -f "cloudflared tunnel" 2>/dev/null
  sleep 2
  cloudflared tunnel --protocol http2 --url "$LOCAL_URL" > "$LOG_FILE" 2>&1 &
  sleep 10
  local url
  url=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' "$LOG_FILE" | tail -1)
  if [ -n "$url" ]; then
    echo "$url" > "$URL_FILE"
    echo "[$(date '+%H:%M:%S')] new URL: $url" >&2
  else
    echo "[$(date '+%H:%M:%S')] failed to get URL — will retry" >&2
  fi
}

# First run
start_tunnel

while true; do
  sleep "$CHECK_INTERVAL"

  # Dead?
  if ! pgrep -f "cloudflared tunnel" > /dev/null; then
    echo "[$(date '+%H:%M:%S')] daemon dead — restarting" >&2
    start_tunnel
    continue
  fi

  # Stuck on "Tunnel not found" loop? Look at last 20 lines for repeated errors.
  recent_errors=$(tail -20 "$LOG_FILE" 2>/dev/null | grep -c "Tunnel not found" || true)
  if [ "$recent_errors" -ge 3 ]; then
    echo "[$(date '+%H:%M:%S')] tunnel revoked (3+ errors) — restarting" >&2
    start_tunnel
  fi
done
