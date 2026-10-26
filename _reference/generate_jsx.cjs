const fs = require('fs');

const html = fs.readFileSync('clean_body.html', 'utf8');

// The clean body starts at <body> and ends before <script>
const bodyStart = html.indexOf('<body>') + 6;
const scriptStart = html.indexOf('<script>');
const bodyContent = html.substring(bodyStart, scriptStart).trim();

// Replace attributes for JSX:
let jsx = bodyContent
  // class="..." -> className="..."
  .replace(/\bclass="/g, 'className="')
  // style="--t:.05s" -> style={{ "--t": ".05s" }}
  .replace(/style="([^"]*)"/g, (match, p1) => {
    const entries = p1.split(';').map(s => s.trim()).filter(Boolean);
    const styleObj = entries.map(entry => {
      const colIdx = entry.indexOf(':');
      if (colIdx === -1) return '';
      const key = entry.substring(0, colIdx).trim();
      const val = entry.substring(colIdx + 1).trim();
      // Handle css vars like --t or standard properties
      if (key.startsWith('--')) {
        return `"${key}": "${val}"`;
      }
      const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${camelKey}: "${val}"`;
    }).filter(Boolean).join(', ');
    return `style={{ ${styleObj} }}`;
  })
  // aria-hidden="true" is fine
  // self close img and hr and br
  .replace(/<img([^>]*)(?<!\/)>/g, '<img$1 />')
  .replace(/<hr([^>]*)(?<!\/)>/g, '<hr$1 />')
  .replace(/<br([^>]*)(?<!\/)>/g, '<br$1 />')
  // replace html comments
  .replace(/<!--[\s\S]*?-->/g, '');

fs.writeFileSync('generated_body.jsx', jsx);
console.log('Generated JSX length:', jsx.length);
