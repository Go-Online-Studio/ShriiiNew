const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'https://shriiitrackingsolution.in';
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
      return result.split('T')[0];
    }
  } catch (err) {
    // ignore
  }
  return new Date().toISOString().split('T')[0];
}

function generateSitemap() {
  const files = getFiles('.');
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const file of files) {
    const relativePath = path.relative('.', file).replace(/\\/g, '/');
    let url = `${BASE_URL}/${relativePath}`.replace(/\.html$/, '');
    if (url.endsWith('/index')) {
      url = url.replace(/\/index$/, '/');
    }

    const lastmod = getGitLastMod(file);
    const priority = url === `${BASE_URL}/` ? '1.0' : (url.includes('/services/') ? '0.85' : '0.8');

    sitemap += '  <url>\n';
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${url === `${BASE_URL}/` ? 'weekly' : 'monthly'}</changefreq>\n`;
    sitemap += `    <priority>${priority}</priority>\n`;
    sitemap += '  </url>\n';
  }

  sitemap += '</urlset>\n';

  fs.writeFileSync(SITEMAP_FILE, sitemap);
  console.log(`Successfully generated ${SITEMAP_FILE} with ${files.length} clean URLs.`);
}

generateSitemap();
