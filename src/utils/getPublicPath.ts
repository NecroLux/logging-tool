export function getPublicPath(path: string) {
  // In tests, use global override
  const globalBase = (globalThis as any).__BASE_URL__;
  if (globalBase) {
    return `${globalBase.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
  
  // In Vite, use import.meta.env.BASE_URL which is '/logging-tool/' in production
  // In dev it's '/' but Vite handles public asset serving automatically
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
