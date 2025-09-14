export type Color = `#${string}`;

/**
 * Type guard for Color: must be a string starting with # and followed by 6 hex digits
 */
export function isColor(value: string): value is Color {
	return /^#[0-9A-Fa-f]{6}$/.test(value);
}
