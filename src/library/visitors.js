export const fluid = ({ vmin = 0, vmax = 1600, root = 16 } = {}) => ({
	Function: {
		fluid({ arguments: [{ value: miny }, _, { value: maxy }] }) {
			const toPx = (value, unit) => (unit === 'rem' ? value * root : value)

			const minyInPx = toPx(miny.value, miny.unit)
			const maxyInPx = toPx(maxy.value, maxy.unit)

			const min = `${miny.value}${miny.unit}`
			const max = `${maxy.value}${maxy.unit}`

			const rem = minyInPx / root

			const XX = vmin / 100
			const YY = (100 * (maxyInPx - minyInPx)) / (vmax - vmin)

			const scalar = `${rem.toFixed(4)}rem + ((1vw - ${XX.toFixed(1)}px) * ${YY.toFixed(4)})`

			return { raw: `clamp(${min}, ${scalar}, ${max});` }
		}
	}
})

export const size = {
	Declaration: {
		custom: {
			size({ value }) {
				const parseValue = ({ type, value, unit }) => {
					const obj = { type: 'length-percentage' }
					if (type === 'length') {
						return { ...obj, value: { type: 'dimension', value, unit } }
					}
					if (type === 'token') {
						return { ...obj, value: { type: 'percentage', value: value.value } }
					}
					throw new Error(`Unsupported value type: ${type}`)
				}

				const height = parseValue(value[0])
				const width = value[2] ? parseValue(value[2]) : height

				return [
					{ property: 'height', value: height },
					{ property: 'width', value: width }
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

			if (!JSON.stringify(conds).includes('--')) return media

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
