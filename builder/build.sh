#!/bin/sh
# Assembles the single-file builder (site/app-index.html) from its parts.
set -eu
cd "$(dirname "$0")"
{ cat head.html base.clean.css extra.css middle.html gen.js; echo '</script>'; echo '<script>'; cat ui.js; printf '</script>\n</body>\n</html>\n'; } > ../site/app-index.html
echo "built site/app-index.html"
