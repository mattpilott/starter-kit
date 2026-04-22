<script lang="ts">
	import { page } from '$app/state'
	import { PUBLIC_PRODUCTION_DOMAIN } from '$env/static/public'

	const str_check = (str?: string) => str?.length && str

	const has = <K extends 'photo' | 'image'>(value: unknown, key: K): value is Record<K, { filename?: string }> =>
		typeof value === 'object' && value !== null && key in (value as Record<string, unknown>)

	const { layout, story } = $derived(page.data)
	const layout_seo = $derived(layout.content.metatags)
	const story_seo = $derived(story && 'metatags' in story.content ? story.content.metatags : undefined)

	const name = $derived(story?.name)
	const title = $derived([name, str_check(story_seo?.title) || layout_seo?.title].filter(Boolean).join(' | '))
	const desc = $derived(str_check(story_seo?.description) || layout_seo?.description)
	const url = $derived(`https://${PUBLIC_PRODUCTION_DOMAIN}${page.url.pathname}`)
	const image = $derived.by(() => {
		const content = story?.content
		const photo = has(content, 'photo') ? content.photo?.filename : undefined
		const image = has(content, 'image') ? content.image?.filename : undefined
		if (!photo && !image) return undefined
		const filename = photo || image
		return `${filename}/m/1200x628/filters:quality(85)`
	})
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={desc} />

	<meta name="og:title" content={story_seo?.og_title || layout_seo?.og_title || title} />
	<meta name="og:description" content={story_seo?.og_description || layout_seo?.og_description || desc} />
	<meta
		name="og:image"
		content={image || story_seo?.og_image || layout_seo?.og_image || layout_seo?.twitter_image}
	/>
	<meta name="og:url" content={url} />

	<meta name="twitter:title" content={story_seo?.twitter_title || layout_seo?.twitter_title || title} />
	<meta
		name="twitter:description"
		content={story_seo?.twitter_description || layout_seo?.twitter_description || desc}
	/>
	<meta
		name="twitter:image"
		content={image || story_seo?.twitter_image || layout_seo?.twitter_image || layout_seo?.og_image}
	/>
	<meta name="twitter:url" content={url} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
