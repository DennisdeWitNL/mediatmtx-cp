#!/bin/bash

update_file() {
    local file="$1"
    
    # Import formatDate
    if ! grep -q "import { formatDate, getTimeSince } from '../utils/date';" "$file"; then
        sed -i '' '/import { handleApiError, getUserFriendlyErrorMessage } from '"'"'..\/utils\/error-handler'"'"';/a\
import { formatDate, getTimeSince } from '"'"'..\/utils\/date'"'"';' "$file"
    fi
    
    # Replace date creation with formatDate
    sed -i '' 's/new Date(\(.*\))/formatDate(\1)/g' "$file"
    
    # Replace toLocaleString with formatDate
    sed -i '' 's/\.toLocaleString()/formatDate(/g' "$file"
    
    # Explicitly type guard the result
    sed -i '' 's/formatDate(/typeof formatDate(/g' "$file"
}

# Pages to update
pages=(
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/WebRTCSessionsPage.tsx"
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/RTSPSessionsPage.tsx"
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/RTMPConnectionsPage.tsx"
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/SRTConnectionsPage.tsx"
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/HLSMuxersPage.tsx"
    "/Users/dennisdewit/Documents/Dev/mediamtx-cp/mediamtx-control-panel/src/pages/PathConfigPage.tsx"
)

for page in "${pages[@]}"; do
    echo "Updating $page"
    update_file "$page"
done