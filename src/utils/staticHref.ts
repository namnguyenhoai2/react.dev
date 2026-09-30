import {assetPath} from './assetPath';

/**
 * Turns an internal route into the matching exported HTML file when the site
 * is deployed below the R2 bucket base path.
 */
export function staticHref(href: string): string {
  if (!href.startsWith('/')) {
    return href;
  }

  const path = href.replace(/\/$/, '');
  return assetPath(path ? `${path}/index.html` : '/index.html');
}
