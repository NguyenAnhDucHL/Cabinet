/**
 * Hệ thống theme màu sắc cho Cabinet
 * Mỗi theme ghi đè các CSS variables chính trên :root
 */

export const THEMES = [
  {
    id: 'red',
    name: 'Đỏ Rouge Écarlate',
    primary: '#c8102e',
    primaryDark: '#a50d25',
    sidebar: ['#c8102e', '#a50d25', '#8c0b1f'],
    textColor: '#c8102e',
    preview: ['#c8102e', '#a50d25', '#8c0b1f'],
  },
  {
    id: 'dark-cerulean',
    name: 'Xanh Dark Cerulean',
    primary: '#004282',
    primaryDark: '#002f5e',
    sidebar: ['#004282', '#002f5e', '#001c3a'],
    textColor: '#004282',
    preview: ['#004282', '#002f5e', '#001c3a'],
  },
  {
    id: 'brandeis',
    name: 'Xanh Brandeis',
    primary: '#0061ff',
    primaryDark: '#004bcc',
    sidebar: ['#0061ff', '#004bcc', '#0038a0'],
    textColor: '#0061ff',
    preview: ['#0061ff', '#004bcc', '#0038a0'],
  },
]

const CSS_VARS = {
  red: {
    '--color-primary': '#c8102e',
    '--color-primary-foreground': '#ffffff',
    '--color-ring': '#c8102e',
    '--color-sidebar-primary': '#c8102e',
    '--color-sidebar-primary-foreground': '#ffffff',
    '--color-sidebar-accent': 'rgba(200,16,46,0.08)',
    '--color-sidebar-accent-foreground': '#c8102e',
    '--color-sidebar-ring': '#c8102e',
    '--color-sidebar-start': '#c8102e',
    '--color-sidebar-mid': '#a50d25',
    '--color-sidebar-end': '#8c0b1f',
    '--primary': '#c8102e',
    '--primary-color': '#c8102e',
    '--sidebar-primary': '4 70% 46%',
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': '4 70% 96%',
    '--sidebar-accent-foreground': '4 70% 46%',
    '--sidebar-ring': '4 70% 46%',
  },
  'dark-cerulean': {
    '--color-primary': '#004282',
    '--color-primary-foreground': '#ffffff',
    '--color-ring': '#004282',
    '--color-sidebar-primary': '#004282',
    '--color-sidebar-primary-foreground': '#ffffff',
    '--color-sidebar-accent': 'rgba(0,66,130,0.08)',
    '--color-sidebar-accent-foreground': '#004282',
    '--color-sidebar-ring': '#004282',
    '--color-sidebar-start': '#004282',
    '--color-sidebar-mid': '#002f5e',
    '--color-sidebar-end': '#001c3a',
    '--primary': '#004282',
    '--primary-color': '#004282',
    '--sidebar-primary': '213 100% 25%',
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': '213 100% 95%',
    '--sidebar-accent-foreground': '213 100% 25%',
    '--sidebar-ring': '213 100% 25%',
  },
  brandeis: {
    '--color-primary': '#0061ff',
    '--color-primary-foreground': '#ffffff',
    '--color-ring': '#0061ff',
    '--color-sidebar-primary': '#0061ff',
    '--color-sidebar-primary-foreground': '#ffffff',
    '--color-sidebar-accent': 'rgba(0,97,255,0.08)',
    '--color-sidebar-accent-foreground': '#0061ff',
    '--color-sidebar-ring': '#0061ff',
    '--color-sidebar-start': '#0061ff',
    '--color-sidebar-mid': '#004bcc',
    '--color-sidebar-end': '#0038a0',
    '--primary': '#0061ff',
    '--primary-color': '#0061ff',
    '--sidebar-primary': '220 100% 50%',
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': '220 100% 95%',
    '--sidebar-accent-foreground': '220 100% 50%',
    '--sidebar-ring': '220 100% 50%',
  },
}

export function applyTheme(themeId) {
  const vars = CSS_VARS[themeId]
  if (!vars) return
  const root = document.documentElement
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  localStorage.setItem('cabinet_theme', themeId)
}

export function getCurrentTheme() {
  return localStorage.getItem('cabinet_theme') || 'red'
}

/** Gọi khi app khởi động */
export function initTheme() {
  applyTheme(getCurrentTheme())
}
