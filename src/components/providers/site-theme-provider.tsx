import { getSiteConfig } from '@/action/data'

const FALLBACK_THEME_COLORS: Record<string, string> = {
    primary: '#1677FF',
    secondary: '#13C2C2',
    accent: '#FAAD14',
    text: '#1F1F1F',
    'header-background': '#F5F5F5',
    'header-color': '#1F1F1F',
    'footer-background': '#001529',
    'footer-color': '#FFFFFF'
}

const HEX_COLOR_REGEX = /^#([0-9A-F]{6})$/i
const ALLOWED_THEME_KEYS = new Set(Object.keys(FALLBACK_THEME_COLORS))

function buildThemeStyles(siteConfig: any): Record<string, string> {
    const styles: Record<string, string> = {}
    const themeColors = siteConfig?.theme?.color as Record<string, unknown> | undefined

    if (!themeColors) return styles

    for (const [rawKey, rawValue] of Object.entries(themeColors)) {
        const key = rawKey.toString().toLowerCase()

        if (!ALLOWED_THEME_KEYS.has(key)) continue

        const fallback = FALLBACK_THEME_COLORS[key]
        const hexValue =
            typeof rawValue === 'string' && HEX_COLOR_REGEX.test(rawValue.trim())
                ? rawValue.trim().toUpperCase()
                : fallback

        styles[`--${key}`] = hexValue
    }

    return styles
}

export async function SiteThemeProvider({ children }: { children: React.ReactNode }) {
    const siteConfig: any = await getSiteConfig()
    const themeStyleVars = buildThemeStyles(siteConfig)
    const isDarkMode = siteConfig?.theme?.darkMode

    // Generate inline script to apply theme before paint
    const themeScript = `
    (function() {
      const root = document.documentElement;
      ${Object.entries(themeStyleVars)
            .map(([key, value]) => `root.style.setProperty('${key}', '${value}');`)
            .join('\n      ')}
      ${isDarkMode ? "root.classList.add('dark'); root.style.colorScheme = 'dark';" : "root.classList.remove('dark'); root.style.colorScheme = 'light';"}
    })();
  `

    return (
        <>
            <script dangerouslySetInnerHTML={{ __html: themeScript }} suppressHydrationWarning />
            {children}
        </>
    )
}
