<script lang="ts">
	function highlight(code: string): string {
		return code
			.replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, (m) => `<span class=hl-s>${m}</span>`)
			.replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, (m) => `<span class=hl-s>${m}</span>`)
			.replace(/\/\*[\s\S]*?\*\//g, (m) => `<span class=hl-c>${m}</span>`)
			.replace(/\/\/[^\n]*/g, (m) => `<span class=hl-c>${m}</span>`)
			.replace(/&lt;\/?[\w-]+[^&]*&gt;/g, (m) => `<span class=hl-t>${m}</span>`)
			.replace(/(--[\w-]+)/g, (m) => `<span class=hl-v>${m}</span>`)
			.replace(/@(media|import)/g, (m) => `<span class=hl-k>${m}</span>`)
			.replace(/\b(media|import|var|if|export|return|const|let|and)\b/g, (m) => `<span class=hl-k>${m}</span>`)
			.replace(
				/\b(fluid|breakpoints|size|composeVisitors|storable|set)\b/g,
				(m) => `<span class=hl-f>${m}</span>`
			)
			.replace(/(\.[a-zA-Z][\w-]*)(?=[\s{,])/g, (m) => `<span class=hl-sel>${m}</span>`)
			.replace(/\b(?<![\w-]-)(\d+\.?\d*)(px|rem|em|%)?\b/g, (m) => `<span class=hl-n>${m}</span>`)
	}

	const items = [
		{
			title: 'TypeScript, lint, and checks',
			badge: 'package.json',
			desc: 'TypeScript across the app, Prettier and ESLint (with the Svelte plugin), and `svelte-check-rs` via `bun run check`. Dependencies and scripts assume Bun.',
			example: `"scripts": {
  "check": "svelte-kit sync && svelte-check-rs --tsconfig ./tsconfig.json",
  "lint": "prettier --check . && eslint ."
}`
		},
		{
			title: 'LightningCSS + kitto visitors',
			badge: 'vite.config.ts',
			desc: 'CSS is processed with LightningCSS. Breakpoints are defined once in Vite; `fluid()` gives responsive `clamp()` values; `size` is a width+height shorthand. All three come from `kitto/lightningcss`.',
			examples: [
				{
					label: 'vite.config.ts',
					code: `visitor: composeVisitors([
  breakpoints({ mobile: 640, tablet: 1024, laptop: 1280, desktop: 1440 }),
  fluid({ vmax: 1600 }),
  size
])`
				},
				{
					label: 'breakpoints()',
					explain:
						'Use `--from-*` for min-width and `--until-*` for max-width. Pair them to target a range without repeating pixel values in every file.',
					code: `&lt;style lang="css"&gt;
  @media (--from-mobile) { .sidebar { display: block; } }
  @media (--from-mobile) and (--until-tablet) {
    .hero { padding: 2rem; }  /* 640px – 1023px */
  }
&lt;/style&gt;`
				},
				{
					label: 'fluid()',
					explain:
						'Resolves to `clamp(min, preferred, max)` so type and spacing can scale smoothly between viewports instead of fixed jumps.',
					code: `&lt;style lang="css"&gt;
  --f-h1: fluid(2.5rem, 5rem) / 1.2 var(--f-family);
  padding: fluid(1rem, 3rem);
&lt;/style&gt;`
				},
				{
					label: 'size()',
					explain: 'Sets `width` and `height` to the same value—handy for icons and square thumbnails.',
					code: `&lt;style lang="css"&gt;
  .icon { size: 24px; }
  .avatar { size: 3rem; }
&lt;/style&gt;`
				}
			]
		},
		{
			title: 'Design tokens',
			badge: 'app.css',
			desc: '`:root` holds fluid type steps (`--f-h1` … `--f-body`), radii (`--r-*`), layout width (`--s-wrap`), and base color. Reach for variables before new one-off numbers.',
			example: `&lt;style lang="css"&gt;
  .container { max-width: var(--s-wrap); }
  .card { border-radius: var(--r-14); }
  .title { font: var(--f-h2); }
&lt;/style&gt;`
		},
		{
			title: 'kitto unify',
			badge: 'app.css',
			desc: 'Imported first: sensible defaults for type smoothing, links, and buttons, plus a small reset-style baseline. Your tokens and overrides sit in the same file after the import.',
			example: `@import 'kitto/unify';

:root {
  --c-black: hsl(230 50% 4%);
  --f-h1: fluid(2.5rem, 5rem) / 1.2 var(--f-family);
  /* … */
}`
		},
		{
			title: 'Security headers',
			badge: 'hooks.server.ts',
			desc: 'Every response gets cache control, CSP (`frame-ancestors`), permissions policy, referrer policy, X-Content-Type-Options, and X-Frame-Options—reasonable defaults you can tighten per app.',
			example: `response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
response.headers.set('X-Frame-Options', 'SAMEORIGIN')`
		},
		{
			title: 'handleError',
			badge: 'hooks.server.ts',
			desc: 'In production, users see a short generic message so stack traces are not exposed. In development you still get the real `error.message` for debugging.',
			example: `// Production: "Whoa there!"
// Development: actual error.message`
		},
		{
			title: 'ENVIRONMENT',
			badge: '.env',
			desc: 'Server-only env var used in `hooks.server.ts` to control how much error detail is exposed to users. Set it to `production` in real deployments to avoid leaking stack traces and internal messages.',
			examples: [
				{
					label: 'local dev',
					explain: 'During development, keep it non-production so you see real error messages.',
					code: `ENVIRONMENT=development`
				},
				{
					label: 'production',
					explain: 'In production, set it to `production` so `handleError` returns a generic message.',
					code: `ENVIRONMENT=production`
				}
			]
		},
		{
			title: 'HTTPS in dev (optional)',
			badge: 'vite.config.ts',
			desc: 'If `localhost.pem` and `localhost-key.pem` exist (e.g. from mkcert), the dev server serves HTTPS—useful for OAuth redirects, `Secure` cookies, or APIs that need a secure context. Otherwise Vite logs a warning and runs over HTTP.',
			example: `# After mkcert localhost (+ key files next to vite.config.ts)
bun dev   # https://localhost:5173 when certs are present`
		},
		{
			title: 'Version and build metadata',
			badge: 'vite.config.ts · +layout.svelte',
			desc: '`import.meta.env` exposes package name, version, and a build timestamp; the layout also mirrors version/build in `<meta>` tags for quick checks in the DOM.',
			example: `import.meta.env.name    // "starter-kit"
import.meta.env.version // "2.0.0"
import.meta.env.build   // "24-03-2026@14:32:01"`
		},
		{
			title: 'Path aliases',
			badge: 'svelte.config.js',
			desc: '`$components` and `$library` map to `src/components` and `src/library` so imports stay short and consistent.',
			example: `import Loader from '$components/loader.svelte'
import { prefs } from '$library/stores'`
		},
		{
			title: 'Route loader',
			badge: 'Loader.svelte',
			desc: 'A slim progress bar runs along the top during client-side navigations. It is already mounted in `+layout.svelte`; adjust or remove there.',
			example: `// Wired in +layout.svelte — no extra setup on routes`
		},
		{
			title: 'Cookie banner (optional)',
			badge: 'Cookie.svelte',
			desc: 'A simple consent UI that reads/writes preferences through `storable`. The layout import is commented out—uncomment when you need GDPR-style consent.',
			example: `{#if browser && !$prefs?.cookie}
  &lt;Cookie /&gt;
{/if}`
		},
		{
			title: 'Google Analytics helper',
			badge: 'Analytics.svelte',
			desc: 'Loads gtag and sends a page view on `afterNavigate`, so SPA route changes count as separate pages in GA4.',
			example: `import Analytics from '$components/analytics.svelte'

&lt;Analytics id="G-XXXXXXXXXX" /&gt;`
		},
		{
			title: 'Overlay (pixel perfect helper)',
			badge: 'kitto/svelte',
			desc: 'Optional full-viewport design overlay tool with separate mobile and desktop sources, enabling you to achieve pixel perfect design your designer would approve of. Commented in `+layout.svelte`; pass your asset paths when you enable it.',
			example: `import { Overlay } from 'kitto/svelte'

&lt;Overlay mobile="/mobile.jpg@393" desktop="/desktop.jpg@1920" /&gt;`
		},
		{
			title: 'Storable stores',
			badge: 'kitto/svelte',
			desc: 'Svelte stores that sync to `localStorage`—used for cookie prefs and a good fit for theme or UI toggles that should survive refresh.',
			example: `import { storable } from 'kitto/svelte'

export const prefs = storable({ cookie: false }, 'prefs')`
		}
	]
</script>

<main class="page">
	<section class="hero">
		<h1 class="hero-title">Starter Kit</h1>
		<p class="hero-desc">
			This repo is a working SvelteKit app not a tutorial site. It comes with Bun-friendly scripts, TypeScript,
			linting and formatting, LightningCSS helpers for breakpoints and fluid type, basic security headers, and a
			few small UI pieces (loader, optional cookie banner, analytics helper) already imported or one comment
			away. Use it as a shortcut so you are not redoing the same wiring on every new project. When you are
			ready,
			<span>replace or delete this page</span>
			and ship your own home screen.
		</p>
	</section>

	<section class="items">
		{#each items as item (item)}
			<article class="item">
				<div class="item-header">
					<h2 class="item-title">{item.title}</h2>
					<div class="item-badge">{item.badge}</div>
				</div>
				<p class="item-desc">{item.desc}</p>
				{#if item.examples}
					{#each item.examples as ex (ex)}
						<div class="item-example-block">
							<span class="item-example-label">{ex.label}</span>
							{#if ex.explain}
								<p class="item-explain">{ex.explain}</p>
							{/if}
							<pre class="item-example"><code>{@html highlight(ex.code)}</code></pre>
						</div>
					{/each}
				{:else}
					<pre class="item-example"><code>{@html highlight(item.example)}</code></pre>
				{/if}
			</article>
		{/each}
	</section>

	<section class="footer">
		<p class="footer-links">
			<a href="https://kit.svelte.dev/docs">SvelteKit documentation</a>
			<span class="separator">·</span>
			<a href="https://github.com/mattpilott/starter-kit">Starter kit source</a>
		</p>
	</section>
</main>

<style lang="css">
	:global(html, body) {
		background: hsl(230 50% 4%);
	}

	.page {
		--page-bg: hsl(230 50% 4%);
		--page-surface: hsl(230 30% 8%);
		--page-text: hsl(230 15% 95%);
		--page-muted: hsl(230 15% 65%);
		--page-accent: hsl(13 83% 54%);
		--page-border: hsl(230 20% 18%);
	}

	.page {
		min-height: 100vh;
		background: var(--page-bg);
		color: var(--page-text);
	}

	.hero {
		margin: 0 auto;
		max-width: 52rem;
		width: 90vw;
		padding: clamp(4rem, 10vw, 8rem) 0 clamp(4rem, 8vw, 6rem);
	}

	.hero-title {
		font: var(--f-h1);
		font-weight: 600;
		margin: 0 0 1rem;
		letter-spacing: -0.02em;
	}

	.hero-desc {
		font: var(--f-body);
		color: var(--page-muted);
		max-width: 62ch;
		margin: 0;
		line-height: 1.6;

		span {
			color: var(--page-text);
			text-decoration: underline;
		}
	}

	.items {
		margin: 0 auto;
		max-width: 52rem;
		width: 90vw;
		padding: clamp(2rem, 5vw, 3rem) 0 clamp(4rem, 8vw, 6rem);
		border-top: 0.5px solid var(--page-border);
	}

	.item {
		padding: 2rem 0;
		border-bottom: 0.5px solid var(--page-border);
	}

	.item:last-of-type {
		border-bottom: none;
	}

	.item-header {
		display: flex;
		align-items: center;
		gap: 0.75rem 1rem;
		margin-bottom: 0.5rem;
	}

	.item-badge {
		font: var(--f-label);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--page-accent);
		background: hsl(13 83% 54% / 0.12);
		padding: 0.2rem 0.5rem;
		border-radius: var(--r-x);
	}

	.item-title {
		font: var(--f-h4);
		font-weight: 600;
		margin: 0;
		letter-spacing: -0.01em;
	}

	.item-desc {
		font: var(--f-body);
		color: var(--page-muted);
		margin: 0 0 1rem;
		line-height: 1.5;
	}

	.item-example-block {
		margin-bottom: 1rem;
	}

	.item-example-block:last-child {
		margin-bottom: 0;
	}

	.item-example-label {
		display: block;
		font: var(--f-label);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: white;
		margin-bottom: 0.35rem;
	}

	.item-explain {
		font: var(--f-excerpt);
		color: var(--page-muted);
		margin: 0 0 0.5rem;
		line-height: 1.5;
	}

	.item-example {
		background: var(--page-surface);
		border: 0.5px solid var(--page-border);
		border-radius: var(--r-6);
		font:
			0.8125rem / 1.5 ui-monospace,
			'Cascadia Code',
			'Fira Code',
			monospace;
		margin: 0 0 2rem;
		overflow-x: auto;
		padding: 1rem 1.25rem;
	}

	.item-example code {
		color: var(--page-muted);
		white-space: pre;
	}

	.item-example :global(.hl-c) {
		color: hsl(230 15% 50%);
		font-style: italic;
	}
	.item-example :global(.hl-s) {
		color: hsl(85 45% 55%);
	}
	.item-example :global(.hl-t) {
		color: rgb(249, 103, 67);
	}
	.item-example :global(.hl-k) {
		color: rgb(249, 103, 67);
	}
	.item-example :global(.hl-f) {
		color: hsl(200 70% 65%);
	}
	.item-example :global(.hl-v) {
		color: hsl(45 70% 60%);
	}
	.item-example :global(.hl-sel) {
		color: hsl(30 80% 65%);
	}
	.item-example :global(.hl-n) {
		color: hsl(180 60% 55%);
	}

	.footer {
		margin: 0 auto;
		max-width: 52rem;
		width: 90vw;
		padding: clamp(2rem, 4vw, 3rem) 0;
		border-top: 0.5px solid var(--page-border);
	}

	.footer-links {
		font: var(--f-excerpt);
		color: var(--page-muted);
		margin: 0;
	}

	.footer-links a {
		color: var(--page-text);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.footer-links a:hover {
		color: var(--page-accent);
	}

	.separator {
		margin: 0 0.5rem;
		opacity: 0.5;
	}
</style>
