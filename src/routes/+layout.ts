import type { Layout } from '$library/components.schema.build'
import { client } from '$library/storyblok.js'
import type { ISbStoryData } from '@storyblok/svelte'

export async function load({ data: { version, auth_state, current_user } }) {
	await client.init().catch(client.handle_error)

	const response = await client
		.getStory('layout', {
			version,
			resolve_links: 'url',
			resolve_relations: client.relations,
			resolve_assets: 1
		})
		.catch(client.handle_error)

	const layout = response.data.story as ISbStoryData<Layout>

	return { layout, version, auth_state, current_user }
}
