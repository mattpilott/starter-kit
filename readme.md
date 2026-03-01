# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Additional Features

### Height & width shorthand

Define both height and width in a single line.

```css
div {
	size: 10rem;
}
```

### Variable media queries

Define your breakpoints just once in the Vite config and use them in your CSS and Svelte components.

```css
@media (--from-mobile) and (--until-tablet) {
	color: blue;
	size: 10px; /* this instead of height + width */
}
```

```svelte
<Overlay mobile="/mobile.jpg@393" desktop="/desktop.jpg@1920" />
```

## Notes

### Local SSL

For local trusted SSL's rather than untrusted self-signed (like that of vite-basic-ssl) use mkcert.

```bash
brew install mkcert nss

mkcert -install

mkcert localhost
```

Then add/edit the https object in svelte config

```js
server: {
	proxy: {},
	https: {
		key: readFileSync(new URL('localhost-key.pem', import.meta.url), 'utf8'),
		cert: readFileSync(new URL('localhost.pem', import.meta.url), 'utf8')
	}
},
```
