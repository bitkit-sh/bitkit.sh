// Minimal Markdown to HTML for brand books: headings, paragraphs, lists, tables, code, emphasis, links.
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const inline = (s: string) =>
  esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+|\/[^)\s]*|#[^)\s]*)\)/g, '<a href="$2">$1</a>');

export function markdown(src: string): string {
  const lines = src.replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let i = 0;
  if (lines[0] === "---") { i = lines.indexOf("---", 1) + 1; }
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (l.startsWith("```")) {
      const body: string[] = []; i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++; out.push(`<pre><code>${esc(body.join("\n"))}</code></pre>`); continue;
    }
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) { const n = h[1].length; const id = h[2].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); out.push(`<h${n} id="${id}">${inline(h[2])}</h${n}>`); i++; continue; }
    if (l.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) { rows.push(lines[i].split("|").slice(1, -1).map((c) => c.trim())); i++; }
      const [head, , ...body] = rows;
      out.push(`<div class="tw"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(l)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+(\[[ x]\]\s+)?/, ""));
      out.push(`<ul>${items.map((x) => `<li>${inline(x)}</li>`).join("")}</ul>`); continue;
    }
    if (l.startsWith(">")) { const q: string[] = []; while (i < lines.length && lines[i].startsWith(">")) q.push(lines[i++].replace(/^>\s?/, "")); out.push(`<blockquote>${inline(q.join(" "))}</blockquote>`); continue; }
    const p: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\||\s*[-*]\s|>)/.test(lines[i])) p.push(lines[i++]);
    out.push(`<p>${inline(p.join(" "))}</p>`);
  }
  return out.join("\n");
}
export { esc };
