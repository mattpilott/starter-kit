import { DEFAULT_EMAIL_FROM, DEFAULT_EMAIL_TO, ZEPTO_TOKEN } from '$env/static/private'
import { fail } from '@sveltejs/kit'
import Postboi from 'postboi/zepto'

const mail = new Postboi({
	token: ZEPTO_TOKEN,
	default_from: DEFAULT_EMAIL_FROM,
	default_to: DEFAULT_EMAIL_TO
})

export const actions = {
	async contact(event) {
		try {
			await mail.send({ body: await event.request.formData() })
			return { success: true }
		} catch (error) {
			if (mail.is_error(error)) {
				console.dir(error.error.details, { depth: null })
				return fail(400, { message: 'Invalid form data' })
			}

			return fail(500, { message: 'Internal server error' })
		}
	}
}
