export function withPagesBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return __PAGES_BASE_PATH__ + path;
}

export function pagesHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;

  const projectMatch = href.match(/^\/projects\/([^/?#]+)/);
  if (projectMatch) {
    return __PAGES_BASE_PATH__ + '/#/projects/' + projectMatch[1];
  }

  return withPagesBase(href);
}
