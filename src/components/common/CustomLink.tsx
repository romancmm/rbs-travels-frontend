import { cn } from '@/lib/utils'
import Link, { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'

type CustomLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export default function CustomLink({ href, children, className, ...props }: CustomLinkProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
