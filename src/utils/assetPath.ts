const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefix a root-relative public asset with the deployed Next.js base path. */
export function assetPath(path: string): string {
  return path.startsWith('/') ? `${basePath}${path}` : path;
}
