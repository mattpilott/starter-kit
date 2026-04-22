<script lang="ts" module>
	import type { StoryblokRichTextOptions } from '@storyblok/svelte'
	import { richtext as loco_richtext } from 'storyloco'
	import { BlockTypes } from '@storyblok/richtext'
	import { Block, type Richtext } from '$library/storyblok.js'
	import type { StoryblokRichtext } from '$library/components.schema.build.js'
	import type { HTMLAttributes } from 'svelte/elements'
	import { image } from '$library/image.js'

	interface Props extends HTMLAttributes<HTMLDivElement> {
		content?: StoryblokRichtext | string
		options?: StoryblokRichTextOptions
	}

	const SELF_CLOSING_TAGS = [
		'area',
		'base',
		'br',
		'col',
		'embed',
		'hr',
		'img',
		'input',
		'link',
		'meta',
		'param',
		'source',
		'track',
		'wbr'
	]

	interface Attributes {
		custom?: Record<string, unknown>
		[key: string]: unknown
	}

	const attrs_to_str = (attrs: Attributes = {}) => {
		const { custom = {}, ...attrs_without_custom } = attrs
		const normalized_attrs = { ...attrs_without_custom, ...custom }
		return Object.keys(normalized_attrs)
			.map((key) => `${key}="${normalized_attrs[key]}"`)
			.join(' ')
	}

	function render<T = string | null>(tag: string, attrs: Attributes = {}, children?: T): string {
		const attrs_str = attrs_to_str(attrs)
		const tag_str = attrs_str ? `${tag} ${attrs_str}` : tag
		const content = Array.isArray(children) ? children.join('') : children || ''

		// prettier-ignore
		if (!tag)
			return content as unknown as string

		else if (SELF_CLOSING_TAGS.includes(tag))
			return `<${tag_str}>`

		else
			return `<${tag_str}>${content}</${tag}>`
	}

	function richtext_fn(content?: StoryblokRichtext, options?: StoryblokRichTextOptions) {
		if (!content) return ''
		return loco_richtext(content as never, options)
	}

	function has_content(value?: StoryblokRichtext): value is StoryblokRichtext {
		if (!value) return false

		if ('content' in value && value.content?.length === 1) {
			if ('content' in value.content[0]) return true
			else if ('text' in value.content[0]) return true
			else return false
		}

		return true
	}

	function truncate(text: string, limit: number) {
		if (text.length <= limit) return text
		const truncated = text.substring(0, limit)
		const last_space = truncated.lastIndexOf(' ')
		const cut_point = last_space > 0 ? last_space : limit
		return truncated.substring(0, cut_point) + '...'
	}

	export const richtext = Object.assign(richtext_fn, { has_content, truncate, render })

	function render_img(tag: string, attrs: Attributes, children?: string) {
		const optimised = image({ ...attrs, filename: attrs.src } as never)
		const img = richtext.render(tag, optimised || attrs, children)

		if ('title' in attrs && attrs.title) {
			return `
				<figure>
					${img}
					<figcaption>
					${attrs.title}
				</figcaption>
			</figure>
		`.trim()
		}

		return img
	}

	function render_blockquote(tag: string, attrs: Attributes, children?: Array<string> | string) {
		if (!children) return ''
		if (typeof children === 'string') children = [children]

		// remove “ and " in children, since pseudo handles that
		children = children.map((child) => child.replace(/“|”/g, ''))
		children = children.map((child) => child.replace(/"/g, ''))

		return render(tag, attrs, children.join(''))
	}

	function render_node(node: Richtext, options?: StoryblokRichTextOptions) {
		return richtext(
			{
				type: BlockTypes.DOCUMENT,
				content: [node]
			},
			{
				renderFn(tag, attrs, children) {
					if ('style' in attrs) delete attrs.style

					switch (tag) {
						case 'img':
							return render_img(tag, attrs, children)

						case 'blockquote':
							return render_blockquote(tag, attrs, children)

						default:
							return render(tag, attrs, children)
					}
				},
				...options
			}
		)
	}
</script>

<script lang="ts">
	let { content, options, ...props }: Props = $props()
</script>

{#if typeof content === 'string'}
	{content}
{:else if richtext.has_content(content)}
	<div {...props}>
		{#if content?.content}
			{#each content.content as Array<Richtext> as node, index (index)}
				{#if node.type === 'blok' && node.attrs?.body}
					{#each node.attrs.body as blok (blok._uid)}
						<span class="not-prose contents">
							<Block {blok} richtext />
						</span>
					{/each}
				{:else}
					{@html render_node(node, options)}
				{/if}
			{/each}
		{:else}
			{content}
		{/if}
	</div>
{/if}
