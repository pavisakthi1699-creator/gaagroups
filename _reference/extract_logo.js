import fs from 'fs';

const content = fs.readFileSync('ref_GAA_Consulting.html', 'utf8');
const match = content.match(/src="(data:image\/png;base64,[^"]+)"/);
if (match) {
  const base64Data = match[1].replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('public/gaa-consulting-logo.png', Buffer.from(base64Data, 'base64'));
  console.log('Saved public/gaa-consulting-logo.png successfully!');
} else {
  console.log('No logo match found');
}
