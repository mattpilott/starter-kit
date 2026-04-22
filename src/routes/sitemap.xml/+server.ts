import { PUBLIC_PRODUCTION_DOMAIN, PUBLIC_STORYBLOK_ACCESS_TOKEN } from '$env/static/public'
import type { ISbLinks, ISbLink } from 'storyblok-js-client'

const domain = `https://${PUBLIC_PRODUCTION_DOMAIN}`

export async function GET({ fetch }) {
	const url = new URL('https://api.storyblok.com/v2/cdn/links')
	url.searchParams.set('per_page', '1000')
	url.searchParams.set('token', PUBLIC_STORYBLOK_ACCESS_TOKEN)

	const data = (await fetch(url).then((r) => r.json())) as ISbLinks

	const links = Object.values(data.links!).filter(({ is_folder }) => !is_folder)

	const response = new Response(sitemap(links))

	response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600')
	response.headers.set('Content-Type', 'application/xml')

	return response
}

const url = (path?: string) => new URL(path ?? '', domain).toString()

function sitemap(pages: Array<ISbLink>) {
	return `
<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.sitemaps.org/schemas/sitemap-image/1.1"
  xmlns:video="http://www.sitemaps.org/schemas/sitemap-video/1.1">
  <url><loc>${domain}</loc></url>
  ${pages.map(({ real_path }) => `<url><loc>${url(real_path)}</loc></url>`).join('')}
</urlset>`.trim()
}
