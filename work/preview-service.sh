#!/bin/sh
# Local preview of the built site at http://localhost:8811, kept running by macOS launchd.
# It starts at login and restarts if it stops, so closing a terminal or the editor does not take it down.
# Usage: sh work/preview-service.sh install | uninstall | status
# After `npm run build:site` the new pages are served right away; no restart needed.
set -eu

label="ai.open-fde.preview"
port="${OPEN_FDE_PREVIEW_PORT:-8811}"
root="$(cd "$(dirname "$0")/.." && pwd)"
plist="$HOME/Library/LaunchAgents/$label.plist"
log="$HOME/Library/Logs/open-fde-preview.log"
python="$(command -v python3)"

case "${1:-status}" in
 install)
  mkdir -p "$root/site" "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
  cat > "$plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
 <key>Label</key><string>$label</string>
 <key>ProgramArguments</key>
 <array>
  <string>$python</string><string>-m</string><string>http.server</string><string>$port</string>
  <string>--bind</string><string>127.0.0.1</string><string>--directory</string><string>$root/site</string>
 </array>
 <key>RunAtLoad</key><true/>
 <key>KeepAlive</key><true/>
 <key>ThrottleInterval</key><integer>10</integer>
 <key>StandardOutPath</key><string>$log</string>
 <key>StandardErrorPath</key><string>$log</string>
</dict>
</plist>
EOF
  launchctl bootout "gui/$(id -u)/$label" 2>/dev/null || true
  launchctl bootstrap "gui/$(id -u)" "$plist"
  sleep 1
  echo "Installed. Preview: http://localhost:$port/  (log: $log)"
  ;;
 uninstall)
  launchctl bootout "gui/$(id -u)/$label" 2>/dev/null || true
  rm -f "$plist"
  echo "Removed the preview service."
  ;;
 status)
  if launchctl print "gui/$(id -u)/$label" >/dev/null 2>&1; then echo "Service installed."; else echo "Service not installed. Run: npm run preview:install"; fi
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$port/" || true)"
  echo "http://localhost:$port/ answers HTTP $code"
  ;;
 *) echo "Usage: sh work/preview-service.sh install | uninstall | status"; exit 1 ;;
esac
