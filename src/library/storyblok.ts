import { PUBLIC_STORYBLOK_ACCESS_TOKEN } from '$env/static/public'
import { error } from '@sveltejs/kit'
import { editable, StoryblokClient, type Storyblok } from 'storyloco'
import type { ISbStoryData } from '@storyblok/svelte'
import type { Component } from 'svelte'
import type { Page, StoryblokRichtext, Blok, Layout } from './components.schema.build.js'
import { createAttachmentKey as attach } from 'svelte/attachments'

/* Export for convenience in other files */
export { Block } from 'storyloco'

class Client extends StoryblokClient {
	relations = []

	/**
	 * Get the appropriate template component for a story
	 * @param story - The story data
	 * @returns The template component or null
	 *
	 * @example
	 * ```typescript
	 * const Template = $derived(client.template(data.story))
	 * // Template will be the correct component based on story.content.component
	 * ```
	 */
	template(story: ISbStoryData | null): Component | null | undefined {
		if (!story) return null
		const component_name = story.content.component || 'page'
		return this.components.get(component_name) || this.components.get('page')
	}
}

const instance = new Client(
	PUBLIC_STORYBLOK_ACCESS_TOKEN,
	import.meta.glob(['$blocks/*.svelte', '$templates/*.svelte'])
)

export const client = Object.assign(instance, { handle_error })

function is_known_error(err: unknown): err is { status: number } {
	return typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number'
}

/**
 * Handle errors from Storyblok. Avoids try/catch boilerplate and keeps error handling consistent.
 *
 * @param err - The error to handle
 * @returns A SvelteKit error and never returns
 */
export function handle_error(err: unknown): never {
	console.error(err)

	if (is_known_error(err)) {
		const status = err.status
		if (status === 404) throw error(status, { message: 'Story not found', code: 'NOT_FOUND' })
		else error(status, { message: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' })
	}

	error(500, { message: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' })
}

/* Map of template names to their types */
type TemplateMap = {
	Page: ISbStoryData<Page>
}

/* Union type for all content types - derived from TemplateMap */
export type Template = TemplateMap[keyof TemplateMap]

/* Mapped type that creates props for each template */
export type TemplateProps = {
	[K in keyof TemplateMap]: {
		data: Storyblok<TemplateMap[K]>
	}
}

/** Correct the type information for the RichtextStoryblok */
export interface Richtext extends StoryblokRichtext {
	attrs?: {
		body: Page['blocks']
	}
	content?: Array<Richtext>
	marks?: Array<Richtext>
}

export function attrs<T>(blok: Blok<T>) {
	const { padding_top, padding_bottom } = blok
	const start = padding_top ? `padding-top: var(--s-${padding_top});` : ''
	const end = padding_bottom ? `padding-bottom: var(--s-${padding_bottom});` : ''

	const style = start + end

	return {
		[attach()](node: HTMLElement) {
			editable(node, blok)
		},
		id: blok._uid,
		style
	}
}

export type Version = 'draft' | 'published'
