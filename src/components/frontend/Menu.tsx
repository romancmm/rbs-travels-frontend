'use client'

/**
 * Frontend Menu Rendering Component
 * Renders navigation menus with support for nested items
 */

import CustomLink from '@/components/common/CustomLink'
import { cn } from '@/lib/utils'
import type { MenuItem } from '@/types/menu.types'
import { getMenuItemUrl, hasChildren } from '@/types/menu.types'
import { ChevronDown, ExternalLink as ExternalLinkIcon } from 'lucide-react'
import { useState } from 'react'

interface MenuProps {
  items: MenuItem[]
  className?: string
  orientation?: 'horizontal' | 'vertical'
  showIcons?: boolean
}

export function Menu({
  items,
  className,
  orientation = 'horizontal',
  showIcons = false
}: MenuProps) {
  return (
    <nav className={cn('menu', className)}>
      <ul
        className={cn(
          'menu-list',
          orientation === 'horizontal' ? 'flex items-center gap-1' : 'flex flex-col space-y-1'
        )}
      >
        {items.map((item) => (
          <MenuItemComponent key={item.id} item={item} showIcons={showIcons} />
        ))}
      </ul>
    </nav>
  )
}

interface MenuItemComponentProps {
  item: MenuItem
  showIcons?: boolean
}

function MenuItemComponent({ item, showIcons = false }: MenuItemComponentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const children = hasChildren(item) ? item.children! : []

  const handleMouseEnter = () => setIsOpen(true)
  const handleMouseLeave = () => setIsOpen(false)

  return (
    <li
      className={cn('relative menu-item', item.cssClass)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MenuItemLink item={item} hasChildren={children.length > 0} showIcons={showIcons} />

      {/* Submenu */}
      {children.length > 0 && (
        <ul
          className={cn(
            'top-full left-0 z-50 absolute bg-background shadow-lg border rounded-lg min-w-[200px] transition-all submenu',
            isOpen ? 'block opacity-100' : 'hidden opacity-0'
          )}
        >
          {children.map((child) => (
            <li key={child.id} className='submenu-item'>
              <MenuItemLink item={child} isSubmenu showIcons={showIcons} />
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

interface MenuItemLinkProps {
  item: MenuItem
  hasChildren?: boolean
  isSubmenu?: boolean
  showIcons?: boolean
}

function MenuItemLink({
  item,
  hasChildren = false,
  isSubmenu = false,
  showIcons = false
}: MenuItemLinkProps) {
  const url = getMenuItemUrl(item)
  const isExternal = item.type === 'external'

  const content = (
    <>
      {showIcons && item.icon && <span className='mr-2 menu-icon'>{item.icon}</span>}
      <span className='menu-title'>{item.title}</span>
      {hasChildren && <ChevronDown className='ml-auto w-4 h-4' />}
      {isExternal && <ExternalLinkIcon className='ml-2 w-3 h-3' />}
    </>
  )

  const linkClassName = cn(
    'flex items-center gap-2 hover:bg-accent px-4 py-2 rounded-md transition-colors hover:text-accent-foreground menu-link',
    isSubmenu && 'px-3 py-2 text-sm'
  )

  // External links
  if (isExternal && url) {
    return (
      <a
        href={url}
        target={item.target || '_blank'}
        rel='noopener noreferrer'
        className={linkClassName}
      >
        {content}
      </a>
    )
  }

  // Internal links (entity types and custom links)
  if (url && url !== '#') {
    return (
      <CustomLink href={url} className={linkClassName}>
        {content}
      </CustomLink>
    )
  }

  // Parent items with no link
  return <span className={linkClassName}>{content}</span>
}

// Mobile Menu Component
interface MobileMenuProps {
  items: MenuItem[]
  className?: string
  showIcons?: boolean
}

export function MobileMenu({ items, className, showIcons = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={cn('mobile-menu', className)}>
      {/* Hamburger Button */}
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex flex-col gap-1.5 hover:bg-accent p-2 rounded-md'
        aria-label='Toggle menu'
      >
        <span
          className={cn(
            'block bg-current w-6 h-0.5 transition-transform',
            isOpen && 'rotate-45 translate-y-2'
          )}
        />
        <span
          className={cn('block bg-current w-6 h-0.5 transition-opacity', isOpen && 'opacity-0')}
        />
        <span
          className={cn(
            'block bg-current w-6 h-0.5 transition-transform',
            isOpen && '-rotate-45 -translate-y-2'
          )}
        />
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className='top-16 z-50 fixed inset-0 bg-background border-t overflow-y-auto mobile-menu-drawer'>
          <nav className='p-4'>
            <ul className='space-y-2'>
              {items.map((item) => (
                <MobileMenuItem
                  key={item.id}
                  item={item}
                  isExpanded={expandedItems.has(item.id)}
                  onToggle={() => toggleExpanded(item.id)}
                  showIcons={showIcons}
                />
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}

interface MobileMenuItemProps {
  item: MenuItem
  isExpanded: boolean
  onToggle: () => void
  showIcons?: boolean
  level?: number
}

function MobileMenuItem({
  item,
  isExpanded,
  onToggle,
  showIcons = false,
  level = 0
}: MobileMenuItemProps) {
  const children = hasChildren(item) ? item.children! : []
  const url = getMenuItemUrl(item)
  const isExternal = item.type === 'external'

  const content = (
    <>
      {showIcons && item.icon && <span className='menu-icon'>{item.icon}</span>}
      <span className='flex-1'>{item.title}</span>
      {children.length > 0 && (
        <button type='button' onClick={onToggle} className='p-1'>
          <ChevronDown className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')} />
        </button>
      )}
      {isExternal && <ExternalLinkIcon className='w-3 h-3' />}
    </>
  )

  const itemClassName = cn(
    'flex items-center gap-3 hover:bg-accent px-4 py-3 rounded-lg transition-colors',
    level > 0 && 'ml-4'
  )

  return (
    <li>
      {isExternal && url ? (
        <a
          href={url}
          target={item.target || '_blank'}
          rel='noopener noreferrer'
          className={itemClassName}
        >
          {content}
        </a>
      ) : url && url !== '#' ? (
        <CustomLink href={url} className={itemClassName}>
          {content}
        </CustomLink>
      ) : (
        <div className={itemClassName}>{content}</div>
      )}

      {/* Children */}
      {children.length > 0 && isExpanded && (
        <ul className='space-y-1 mt-2'>
          {children.map((child) => (
            <MobileMenuItem
              key={child.id}
              item={child}
              isExpanded={false}
              onToggle={() => {}}
              showIcons={showIcons}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default Menu
