"use client"

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import CustomLink from '@/components/common/CustomLink'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import type { BaseComponent, Column as ColumnType, PageContent, Row as RowType, Section as SectionType } from '@/types/page-builder'
import React from 'react'

// Global col-span map
const COL_SPAN: Record<number, string> = {
    1: 'col-span-12 sm:col-span-1',
    2: 'col-span-12 sm:col-span-2',
    3: 'col-span-12 sm:col-span-3',
    4: 'col-span-12 sm:col-span-4',
    5: 'col-span-12 sm:col-span-5',
    6: 'col-span-12 sm:col-span-6',
    7: 'col-span-12 sm:col-span-7',
    8: 'col-span-12 sm:col-span-8',
    9: 'col-span-12 sm:col-span-9',
    10: 'col-span-12 sm:col-span-10',
    11: 'col-span-12 sm:col-span-11',
    12: 'col-span-12'
}

function getColumnSpanClasses(column: ColumnType) {
    const resp = (column as any).settings?.responsive?.widths
    if (resp && typeof resp === 'object') {
        const parts: string[] = []
        if (resp.base) parts.push(COL_SPAN[resp.base] ?? 'col-span-12')
        if (resp.sm) parts.push(`sm:${COL_SPAN[resp.sm] ?? 'col-span-12'}`)
        if (resp.md) parts.push(`md:${COL_SPAN[resp.md] ?? 'col-span-12'}`)
        if (resp.lg) parts.push(`lg:${COL_SPAN[resp.lg] ?? 'col-span-12'}`)
        if (resp.xl) parts.push(`xl:${COL_SPAN[resp.xl] ?? 'col-span-12'}`)
        return parts.join(' ')
    }

    const width = (column as any).width ?? 12
    return COL_SPAN[width] ?? 'col-span-12'
}

function getVisibilityClasses(settings?: any) {
    if (!settings) return ''
    const classes: string[] = []
    if (settings.hideOnMobile) classes.push('hidden', 'sm:block')
    if (settings.hideOnTablet) classes.push('hidden', 'lg:block')
    if (settings.hideOnDesktop) classes.push('lg:hidden')
    return classes.join(' ')
}

function getBackgroundFromSettings(settings?: any) {
    if (!settings || !settings.background) return { style: {}, classes: '', overlay: null as any }
    const bg = settings.background
    const style: React.CSSProperties = {}
    let classes = ''
    let overlay = null

    if (bg.type === 'color' && bg.color) {
        style.backgroundColor = bg.color
    }
    if (bg.type === 'image' && bg.image) {
        style.backgroundImage = `url(${bg.image})`
        classes += ' bg-cover bg-center'
    }
    if (bg.overlay && bg.overlay.enabled) {
        overlay = { color: bg.overlay.color, opacity: bg.overlay.opacity ?? 0.5 }
    }

    return { style, classes: classes.trim(), overlay }
}

function renderComponent(component: BaseComponent) {
    const props = component.props || {}
    const componentClassName = (component as any).settings?.className || ''
    const styleProps: React.CSSProperties = {}
    if (props.color) styleProps.color = props.color
    if (props.fontSize) styleProps.fontSize = props.fontSize
    if (props.lineHeight) styleProps.lineHeight = props.lineHeight
    if (props.fontWeight) styleProps.fontWeight = props.fontWeight

    // Debug log to verify className is being applied
    if (componentClassName) {
        console.log('[renderComponent] Applying className:', componentClassName, 'to component:', component.id, 'type:', component.type)
    }

    // Basic rendering mirroring admin previews (no editor chrome)
    switch (component.type) {
        case 'heading': {
            const { level = 'h2', text = '', align = 'left' } = props as any
            return (
                <Typography key={component.id} variant={level as any} weight={props.fontWeight || 'bold'} align={align as any} style={styleProps} className={componentClassName}>
                    {text}
                </Typography>
            )
        }

        case 'text': {
            const { text = '', align = 'left' } = props as any
            return (
                <Typography key={component.id} variant='body1' className={cn('text-gray-700', componentClassName)} align={align as any} style={styleProps}>
                    {text}
                </Typography>
            )
        }

        case 'button': {
            const { text = 'Click', url = '#', openInNewTab = false, variant = 'primary', size = 'medium' } = props as any

            const variantClass =
                variant === 'primary'
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : variant === 'secondary'
                        ? 'bg-secondary text-white hover:opacity-95'
                        : variant === 'outline'
                            ? 'border border-gray-300 text-gray-700 bg-transparent'
                            : 'bg-gray-100 text-gray-800'

            const sizeClass = size === 'small' ? 'px-3 py-1 text-sm' : size === 'large' ? 'px-6 py-3 text-lg' : 'px-4 py-2'

            return (
                <div key={component.id} className={componentClassName}>
                    <CustomLink href={url} className={`inline-block rounded ${variantClass} ${sizeClass}`} target={openInNewTab ? '_blank' : undefined}>
                        {text}
                    </CustomLink>
                </div>
            )
        }

        case 'image': {
            const { src, alt = '', link = '', openInNewTab = false, width: imgWidth, height: imgHeight } = props as any

            // Prepare props for CustomImage (prefer numeric values). If builder provides
            // percentage or 'auto' values, apply them via wrapper styles instead.
            const imageProps: any = {}
            const wrapperStyle: React.CSSProperties = {}

            if (typeof imgWidth === 'number') imageProps.width = imgWidth
            else if (typeof imgWidth === 'string') {
                // keep percent or px as wrapper style
                if (imgWidth !== 'auto') wrapperStyle.width = imgWidth
            }

            if (typeof imgHeight === 'number') imageProps.height = imgHeight
            else if (typeof imgHeight === 'string') {
                if (imgHeight !== 'auto') wrapperStyle.height = imgHeight
            }

            const imgElement = (
                <div style={wrapperStyle} className='max-w-full'>
                    <CustomImage src={src} alt={alt} className='w-full h-auto' {...imageProps} />
                </div>
            )

            return (
                <div key={component.id} className={componentClassName}>
                    {link ? (
                        <CustomLink href={link} target={openInNewTab ? '_blank' : undefined}>
                            {imgElement}
                        </CustomLink>
                    ) : (
                        imgElement
                    )}
                </div>
            )
        }

        case 'video': {
            const { url } = props as any
            // reuse simple embed for youtube/vimeo
            const getEmbed = (u: string) => {
                if (!u) return null
                if (u.includes('youtube') || u.includes('youtu.be')) {
                    let id = ''
                    if (u.includes('v=')) id = u.split('v=')[1]?.split('&')[0]
                    else if (u.includes('youtu.be/')) id = u.split('youtu.be/')[1]?.split('?')[0]
                    else if (u.includes('embed/')) id = u.split('embed/')[1]?.split('?')[0]
                    return id ? `https://www.youtube.com/embed/${id}` : null
                }
                if (u.includes('vimeo')) {
                    const m = u.match(/vimeo\.com\/(\d+)/)
                    return m ? `https://player.vimeo.com/video/${m[1]}` : null
                }
                return null
            }

            const embed = getEmbed(url)
            return (
                <div key={component.id} className={cn('w-full', componentClassName)}>
                    {embed ? (
                        <div style={{ paddingBottom: '56.25%', position: 'relative' }}>
                            <iframe src={embed} className='absolute inset-0 w-full h-full' allowFullScreen title={`video-${component.id}`} />
                        </div>
                    ) : (
                        <div className='bg-gray-100 p-4 text-gray-500 text-sm'>No video</div>
                    )}
                </div>
            )
        }

        case 'divider': {
            return <hr key={component.id} className={cn('my-4 border-t', componentClassName)} />
        }

        case 'spacer': {
            const { height = '40px' } = props as any
            return <div key={component.id} style={{ height }} className={componentClassName} />
        }

        default:
            return (
                <div key={component.id} className={cn('text-gray-500 text-sm', componentClassName)}>
                    {component.type}
                </div>
            )
    }
}

function ColumnRenderer({ column }: { column: ColumnType }) {
    const spanClass = getColumnSpanClasses(column)
    const columnSettings = (column as any).settings
    const columnClassName = columnSettings?.className || ''
    const visClass = getVisibilityClasses(columnSettings)
    const { style: colBgStyle, classes: colBgClasses, overlay: colOverlay } = getBackgroundFromSettings(columnSettings)

    // Debug log to verify className is being applied
    if (columnClassName) {
        console.log('[ColumnRenderer] Applying className:', columnClassName, 'to column:', column.id)
    }

    return (
        <div className={cn(spanClass, 'items-center px-3', visClass, colBgClasses, columnClassName)} style={colBgStyle}>
            <div className={`${colOverlay ? 'relative' : ''}`}>
                {colOverlay && (
                    <div
                        aria-hidden
                        className='absolute inset-0'
                        style={{ backgroundColor: colOverlay.color, opacity: colOverlay.opacity }}
                    />
                )}

                {column.components?.map((c) => (
                    <div key={c.id} className='mb-4'>
                        {renderComponent(c)}
                    </div>
                ))}
            </div>
        </div>
    )
}

function RowRenderer({ row }: { row: RowType }) {
    const rowSettings = (row as any).settings
    const rowClassName = rowSettings?.className || ''
    const visClass = getVisibilityClasses(rowSettings)
    const { style: rowBgStyle, classes: rowBgClasses, overlay: rowOverlay } = getBackgroundFromSettings(rowSettings)

    // Debug log to verify className is being applied
    if (rowClassName) {
        console.log('[RowRenderer] Applying className:', rowClassName, 'to row:', row.id)
    }

    return (
        <div className={cn('gap-4 grid grid-cols-12 -mx-3', visClass, rowBgClasses, rowClassName)} style={rowBgStyle}>
            {rowOverlay && (
                <div aria-hidden className='absolute inset-0 pointer-events-none' style={{ backgroundColor: rowOverlay.color, opacity: rowOverlay.opacity }} />
            )}
            {row.columns.map((col) => (
                <ColumnRenderer key={col.id} column={col} />
            ))}
        </div>
    )
}

function SectionRenderer({ section }: { section: SectionType }) {
    const sectionSettings = (section as any).settings
    const sectionClassName = sectionSettings?.className || ''
    const visClass = getVisibilityClasses(sectionSettings)
    const { style: secBgStyle, classes: secBgClasses, overlay: secOverlay } = getBackgroundFromSettings(sectionSettings)

    // Debug log to verify className is being applied
    if (sectionClassName) {
        console.log('[SectionRenderer] Applying className:', sectionClassName, 'to section:', section.id)
    }

    return (
        <Section className={cn('w-full', visClass, secBgClasses, sectionClassName)}>
            <Container>
                <div className='relative py-6'>
                    {secOverlay && (
                        <div aria-hidden className='absolute inset-0 pointer-events-none' style={{ backgroundColor: secOverlay.color, opacity: secOverlay.opacity }} />
                    )}

                    {/* {section.name && <PageHeader title={section.name} />} */}
                    {section.rows.map((r) => (
                        <div key={r.id} className='mb-6'>
                            <RowRenderer row={r} />
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    )
}

export default function PageBuilderRenderer({ content }: { content: PageContent }) {
    if (!content || !content.sections || content.sections.length === 0) return null

    return (
        <div>
            {content.sections.map((section) => (
                <SectionRenderer key={section.id} section={section} />
            ))}
        </div>
    )
}
