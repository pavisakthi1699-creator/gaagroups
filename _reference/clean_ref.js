import fs from 'fs';
let c = fs.readFileSync('ref_GAA_Consulting.html', 'utf8');
c = c.replace(/data:image\/[^;]+;base64,[^"']+/g, '[IMG]');
c = c.replace(/data:font\/[^;]+;base64,[^"'\)]+/g, '[FONT]');
fs.writeFileSync('ref_GAA_Consulting_clean.html', c);
console.log('Cleaned length:', c.length);
