import type { AnchorHTMLAttributes } from 'react';
import { pagesHref } from '../paths';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

export default function Link({ href, children, ...props }: LinkProps) {
  return (
    <a {...props} href={pagesHref(href)}>
      {children}
    </a>
  );
}
