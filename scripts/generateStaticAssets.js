/**
 * Generates static text assets that were previously served by Next.js routes.
 */

const fs = require('fs');
const path = require('path');
const {siteConfig} = require('../src/siteConfig');
const sidebarLearn = require('../src/sidebarLearn.json');
const sidebarReference = require('../src/sidebarReference.json');

const rootDir = path.join(__dirname, '..');
const contentDir = path.join(rootDir, 'src', 'content');
const outputDir = path.join(rootDir, 'dist');
const footer =
  '\n---\n\n## Sitemap\n\n[Overview of all docs pages](/llms.txt)\n';

function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function markdownOutputPath(file) {
  const relative = path.relative(contentDir, file).replace(/\\/g, '/');
  if (relative === 'index.md') return null;
  const outputName = relative.endsWith('/index.md')
    ? relative.slice(0, -'/index.md'.length) + '.md'
    : relative;
  return path.join(outputDir, outputName);
}

function pageUrl(route, baseUrl) {
  return `${baseUrl}${route.path}.md`;
}

function appendRoutes(lines, routes, baseUrl, headingLevel) {
  for (const route of routes) {
    if (!route.path || route.path.startsWith('http')) continue;
    lines.push(`- [${route.title}](${pageUrl(route, baseUrl)})`);
    if (route.routes?.length) {
      lines.push('');
      lines.push(`${headingLevel} ${route.title}`);
      appendRoutes(lines, route.routes, baseUrl, headingLevel + '#');
    }
  }
}

function generateLlmsTxt() {
  const subdomain =
    siteConfig.languageCode === 'en' ? '' : `${siteConfig.languageCode}.`;
  const baseUrl = `https://${subdomain}react.dev`;
  const lines = [
    '# React Documentation',
    '',
    '> The library for web and native user interfaces.',
  ];

  for (const sidebar of [sidebarLearn, sidebarReference]) {
    lines.push('', `## ${sidebar.title}`);
    appendRoutes(lines, sidebar.routes, baseUrl, '###');
  }

  fs.writeFileSync(path.join(outputDir, 'llms.txt'), `${lines.join('\n')}\n`);
}

if (!fs.existsSync(outputDir)) {
  throw new Error(
    'Missing dist directory. Run `next build` before generating static assets.'
  );
}

for (const file of walk(contentDir)) {
  if (!file.endsWith('.md')) continue;
  const destination = markdownOutputPath(file);
  if (!destination) continue;
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.writeFileSync(destination, fs.readFileSync(file, 'utf8') + footer);
}

generateLlmsTxt();
