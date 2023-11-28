export const fluid = (size = 1600, root = 16) => ({
	Function: {
		fluid({ arguments: [miny, _, maxy] }) {
			const min = miny.value.value + miny.value.unit
			const max = maxy.value.value + maxy.value.unit
			const view = ((maxy.value.value * root) / size) * 100 + 'vw'

			return { raw: `min(max(${min}, ${view}), ${max})` }
		}
	}
})

export const size = {
	Declaration: {
		custom: {
			size(property) {
				let value = { type: 'length-percentage' }
				if (property.value[0].type === 'length') {
					value.value = { type: 'dimension', value: property.value[0].value }
				}
				if (property.value[0].type === 'token') {
					value.value = { type: 'percentage', value: property.value[0].value.value }
				}
				return [
					{ property: 'width', value },
					{ property: 'height', value }
				]
			}
		}
	}
}

export const breakpoints = breakpoints => ({
	Rule: {
		media(media) {
			const [media_query] = media.value.query.mediaQueries
			const { operator, conditions, value } = media_query.condition
			const conds = value ? [{ value }] : conditions
			const queries = []

			conds.forEach(({ value: { name } }) => {
				const [till, device] = name.split('--').pop().split('-')
				const minmax = till === 'from' ? 'min' : 'max'
				const point = breakpoints[device]

				queries.push(`(${minmax}-width: ${point / 16}em)`)
			})
			const raw = queries.join(queries.length > 1 ? ` ${operator} ` : '')

			media.value.query = { mediaQueries: [{ raw }] }

			return media
		}
	}
})

// export const breakpoints = {
// 	Rule: {
// 		custom: {
// 			// prettier-ignore
// 			breakpoints({ loc, body: { value: { declarations } } }) {
// 				const ret = declarations.map(({ value: { name, value } }) => {
// 					const val = value[0].value.value
// 					return [
// 						{
// 							type: 'custom-media',
// 							value: {
// 								name: `--from-${name}`,
// 								loc,
// 								query: { mediaQueries: [{ raw: `(min-width: ${val / 16}em)` }] }
// 							}
// 						},
// 						{
// 							type: 'custom-media',
// 							value: {
// 								name: `--until-${name}`,
// 								loc,
// 								query: { mediaQueries: [{ raw: `(max-width: ${(val - 1) / 16}em)` }] }
// 							}
// 						}
// 					]
// 				})
// 				return ret.flat()
// 			}
// 		}
// 	}
// }
