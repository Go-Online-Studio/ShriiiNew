const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'https://go-online-studio.github.io/ShriiiNew';
const EXCLUDE_DIRS = ['.git', '.github', 'node_modules', 'css', 'js', 'images', 'data'];
const SITEMAP_FILE = 'sitemap.xml';

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        getFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function getGitLastMod(filePath) {
  try {
    const result = execSync(`git log -1 --format=%cI -- "${filePath}"`).toString().trim();
    if (result) {
      // Extract only the date part YYYY-MM-DD
      return result.split('T')[0];
    }
  } catch (err) {
    console.error(`Error getting git date for ${filePath}:`, err.message);
  }
  // Return current date as fallback if git history is not available
  return new Date().toISOString().split('T')[0];
}

function generateSitemap() {
  const files = getFiles('.');
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const file of files) {
    const relativePath = path.relative('.', file).replace(/\\/g, '/');
    const url = `${BASE_URL}/${relativePath}`.replace(/\/index\.html$/, '/');
    const lastmod = getGitLastMod(file);

    sitemap += '  <url>\n';
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
    sitemap += '  </url>\n';
  }

  sitemap += '</urlset>';

  fs.writeFileSync(SITEMAP_FILE, sitemap);
  console.log(`Successfully generated ${SITEMAP_FILE} with ${files.length} URLs.`);
}

generateSitemap();
