import type { CSSProperties, ImgHTMLAttributes } from 'react';
import { withPagesBase } from '../paths';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
}

export default function Image({
  src,
  alt,
  fill,
  priority,
  unoptimized: _unoptimized,
  style,
  ...props
}: ImageProps) {
  const fillStyle: CSSProperties | undefined = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style,
      }
    : style;

  return (
    // oxlint-disable-next-line next/no-img-element
    <img
      {...props}
      src={withPagesBase(src)}
      alt={alt}
      style={fillStyle}
      loading={priority ? 'eager' : props.loading ?? 'lazy'}
    />
  );
}
