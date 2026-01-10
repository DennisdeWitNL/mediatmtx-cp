#!/bin/bash

update_file() {
    local file="$1"
    
    # Import formatBytes
    if ! grep -q "import { formatBytes } from '../utils/format';" "$file"; then
        sed -i '' '/import { handleApiError, getUserFriendlyErrorMessage } from '"'"'..\/utils\/error-handler'"'"';/a\
import { formatBytes } from '"'"'..\/utils\/format'"'"';' "$file"
    fi
    
    # Replace toLocaleString with formatBytes
    sed -i '' 's/\.toLocaleString() B/Let/g' "$file"
    sed -i '' 's/\.toLocaleString() B//g' "$file"
    sed -i '' 's/\.toLocaleString()//g' "$file"
    
    # Replace specific patterns with formatBytes
    sed -i '' 's/toLocaleString()/formatBytes(/g' "$file"
    sed -i '' 's/sum + /sum + /g' "$file"
}

# Pages to update
pages=(
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/WebRTCSessionsPage.tsx"
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/RTSPSessionsPage.tsx"
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/RTMPConnectionsPage.tsx"
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/SRTConnectionsPage.tsx"
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/HLSMuxersPage.tsx"
)

for page in "${pages[@]}"; do
    echo "Updating $page"
    update_file "$page"
done