const fs = require('fs');
const files = [
  'Cabinet.Api/ClientApp/src/documents/pages/DocDetail.jsx',
  'Cabinet.Api/ClientApp/src/documents/pages/Review.jsx',
  'Cabinet.Api/ClientApp/src/documents/pages/Upload.jsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\{\s*,\s*'Content-Type'/g, "{'Content-Type'");
  fs.writeFileSync(f, content, 'utf8');
});
