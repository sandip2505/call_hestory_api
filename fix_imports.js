import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk(path.resolve('src'));
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  let modified = false;
  
  const regex = /(import|export)\s+(?:(?:.|\n)*?)\s+from\s+['"](\.[^'"]+)['"]/g;
  content = content.replace(regex, (match, p1, p2) => {
    if (!p2.endsWith('.js') && !p2.endsWith('.json') && !p2.endsWith('.ts')) {
      modified = true;
      return match.replace(p2, p2 + '.js');
    }
    return match;
  });

  const sideEffectRegex = /import\s+['"](\.[^'"]+)['"]/g;
  content = content.replace(sideEffectRegex, (match, p1) => {
    if (!p1.endsWith('.js') && !p1.endsWith('.json') && !p1.endsWith('.ts')) {
      modified = true;
      return match.replace(p1, p1 + '.js');
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Done. Updated ${changedFiles} files.`);
