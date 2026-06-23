export const LAYOUT_PRESETS = [
	{ label: '2 columns (equal width)', template: '1fr 1fr' },
	{ label: '2 columns (75% - 25%)', template: '3fr 1fr' },
	{ label: '3 columns (equal width)', template: '1fr 1fr 1fr' },
	{ label: '3 columns (25% - 50% - 25%)', template: '1fr 2fr 1fr' },
	{ label: '4 columns (equal width)', template: '1fr 1fr 1fr 1fr' },
] as const

export const LAYOUT_COLUMN_SEPARATOR = ':::column'

export function getLayoutColumnCount(template: string): number {
	return template.trim().split(/\s+/).length
}
