/* Brand logos from src/assets/brands, found by file name (the brand code in lower case, e.g.
   lady_care.png). Adding a logo is dropping a file there; nothing here needs to change. */

const files = import.meta.glob<string>('/src/assets/brands/*.{png,svg,webp,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byCode = new Map(
  Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace(/\.\w+$/, '').toLowerCase(), url]),
)

/** the logo's URL for a brand code, or undefined while there is no file for it */
export const brandLogo = (code: string) => byCode.get(code.toLowerCase())
