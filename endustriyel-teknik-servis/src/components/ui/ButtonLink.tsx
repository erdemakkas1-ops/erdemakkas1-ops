import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'dark';
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
  external?: boolean;
};

export function ButtonLink({ href, children, variant = 'primary', arrow, icon, className = '', external }: Props) {
  const cls = `btn btn-${variant} ${className}`;
  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />}
    </>
  );
  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    const isWeb = href.startsWith('http');
    return (
      <a href={href} className={cls} {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
