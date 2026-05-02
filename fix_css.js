const fs = require('fs');
let css = fs.readFileSync('c:/Users/tsubo/Desktop/開発中のアプリ共/2.1 - コピー/style.css', 'utf8');

// Fix broken characters caused by Shift-JIS / UTF-8 mishandling
css = css.replace(/content:\s*"✁E;"/g, 'content: "✓"');
css = css.replace(/content:\s*"色ｶ"/g, 'content: "▶"');

// Fix .card-title and .section-label inside .card for Main UI
css += `
.card .section-label {
    font-size: 11px;
    font-weight: 800;
    color: var(--text-main);
    text-transform: uppercase;
    margin: 15px 0 5px;
    opacity: 0.8;
}

.card .card-title {
    color: var(--text-main);
    opacity: 1;
}
`;

fs.writeFileSync('c:/Users/tsubo/Desktop/開発中のアプリ共/2.1 - コピー/style.css', css, 'utf8');
console.log('Fixed CSS.');
