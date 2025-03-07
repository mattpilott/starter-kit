import prettier from 'eslint-config-prettier'
import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import ts from 'typescript-eslint'

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			camelcase: [
				'error',
				{
					properties: 'always',
					ignoreDestructuring: false,
					ignoreImports: false,
					ignoreGlobals: false
				}
			],
			'id-match': [
				'error',
				'^([a-z]+([A-Z][a-z]+)*)|([A-Z][a-z]+([A-Z][a-z]+)*)|(^\\$[a-z]+([A-Z][a-z]+)*)$',
				{
					properties: true,
					onlyDeclarations: true
				}
			],
			'id-length': [
				'error',
				{
					min: 2,
					exceptions: ['i', 'j', 'x', 'y']
				}
			],
			'new-cap': [
				'error',
				{
					newIsCap: true,
					capIsNew: false,
					properties: true
				}
			],
			'no-underscore-dangle': [
				'error',
				{
					allowAfterThis: true,
					enforceInMethodNames: true
				}
			]
		}
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
)
