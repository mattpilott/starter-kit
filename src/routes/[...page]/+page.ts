import { client, handle_error, type Template } from '$library/storyblok.js'
import { error } from '@sveltejs/kit'

export async function load(event) {
	const {
		parent,
		params: { page: slug }
	} = event
	const { version } = await parent()

	const response = await client
		.get(`cdn/stories/${slug || 'home'}`, {
			version,
			resolve_links: 'url',
			resolve_relations: client.relations,
			resolve_assets: 1
		})
		.catch(handle_error)

	if (!response) error(404, { message: 'Story not found', code: 'NOT_FOUND' })

	const story = response.data.story as Template

	return { story }
}
