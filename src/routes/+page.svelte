<script lang="ts">
	function highlight(code: string): string {
		return code
			.replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, m => `<span class=hl-s>${m}</span>`)
			.replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, m => `<span class=hl-s>${m}</span>`)
			.replace(/\/\*[\s\S]*?\*\//g, m => `<span class=hl-c>${m}</span>`)
			.replace(/\/\/[^\n]*/g, m => `<span class=hl-c>${m}</span>`)
			.replace(/&lt;\/?[\w-]+[^&]*&gt;/g, m => `<span class=hl-t>${m}</span>`)
			.replace(/(--[\w-]+)/g, m => `<span class=hl-v>${m}</span>`)
			.replace(/@(media|import)/g, m => `<span class=hl-k>${m}</span>`)
			.replace(/\b(media|import|var|if|export|return|const|let|and)\b/g, m => `<span class=hl-k>${m}</span>`)
			.replace(
				/\b(fluid|breakpoints|size|composeVisitors|storable|set)\b/g,
				m => `<span class=hl-f>${m}</span>`
			)
			.replace(/(\.[a-zA-Z][\w-]*)(?=[\s{,])/g, m => `<span class=hl-sel>${m}</span>`)
			.replace(/\b(?<![\w-]-)(\d+\.?\d*)(px|rem|em|%)?\b/g, m => `<span class=hl-n>${m}</span>`)
	}

	const items = [
		{
			title: 'LightningCSS + visitors',
			badge: 'vite.config',
			desc: 'breakpoints(), fluid(), and size() from kitto/lightningcss.',
			examples: [
				{
					label: 'vite.config.js',
					code: `visitor: composeVisitors([
  breakpoints({ mobile: 640, tablet: 1024, laptop: 1280, desktop: 1440 }),
  fluid({ vmax: 1600 }),
  size
])`
				},
				{
					label: 'breakpoints()',
					explain: 'from = min-width, until = max-width. Values come from the config above.',
					code: `&lt;style lang="css"&gt;
  @media (--from-mobile) { .sidebar { display: block; } }
  @media (--from-mobile) and (--until-tablet) {
    .hero { padding: 2rem; }  /* 640px – 1023px only */
  }
&lt;/style&gt;`
				},
				{
					label: 'fluid()',
					explain:
						'Outputs clamp(min, preferred, max). Preferred value uses 1vw (not 100vw) and a precomputed scale: rem + ((1vw - vmin/100) * scale). Maps viewport growth (vmin→vmax) to value growth (min→max).',
					code: `&lt;style lang="css"&gt;
  --f-h1: fluid(2.5rem, 5rem) / 1.2 var(--f-family);
  padding: fluid(1rem, 3rem);
&lt;/style&gt;`
				},
				{
					label: 'size()',
					explain: 'Shorthand for height and width. Sets both to the same value.',
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
			desc: 'Typography scale, radii, and spacing as CSS variables from day one.',
			example: `&lt;style lang="css"&gt;
  /* Use tokens instead of magic numbers */
  .container { max-width: var(--s-wrap); }
  .card { border-radius: var(--r-14); }
  .title { font: var(--f-h2); }
&lt;/style&gt;`
		},
		{
			title: 'Security headers',
			badge: 'hooks.server.ts',
			desc: 'CSP, X-Frame-Options, Referrer-Policy, and more. Production apps need these.',
			example: `response.headers.set('X-Frame-Options', 'SAMEORIGIN')
response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")`
		},
		{
			title: 'handleError',
			badge: 'hooks.server.ts',
			desc: 'Users see a generic message in production; you get full error details in dev.',
			example: `// Production: "Whoa there!"
// Development: actual error.message`
		},
		{
			title: 'HTTPS in dev',
			badge: 'vite',
			desc: 'https://localhost for testing OAuth, secure cookies, or secure context APIs.',
			example: `// Runs at https://localhost:5173
bun run dev`
		},
		{
			title: 'Version & build stamps',
			badge: 'vite.config',
			desc: 'Inject name, version, and build timestamp at compile time.',
			example: `import.meta.env.name    // "starter-kit"
import.meta.env.version // "2.0.0"
import.meta.env.build   // "24-02-2026@14:32:01"`
		},
		{
			title: 'Path aliases',
			badge: 'svelte.config',
			desc: '$components and $library keep imports tidy.',
			example: `import Button from '$components/Button.svelte'
import { prefs } from '$library/stores'`
		},
		{
			title: 'Loader',
			badge: 'components/Loader.svelte',
			desc: 'Progress bar at the top on route changes. Already wired in the layout.',
			example: `// No setup — it's in +layout.svelte`
		},
		{
			title: 'Cookie consent',
			badge: 'components/Cookie.svelte',
			desc: 'Opt-in/opt-out with storable prefs. Commented out in layout; uncomment when needed.',
			example: `{#if browser && !$prefs?.cookie}
  &lt;Cookie /&gt;
{/if}`
		},
		{
			title: 'Analytics',
			badge: 'components/Analytics.svelte',
			desc: 'Google Analytics with correct afterNavigate updates for SPA routing.',
			example: `import Analytics from '$components/Analytics.svelte'

&lt;Analytics id="G-XXXXXXXXXX" /&gt;`
		},
		{
			title: 'Kitto unify',
			badge: 'app.css',
			desc: 'Consistent base: antialiasing, link styles, letter-spacing. Variables and unify live in one file.',
			example: `&lt;style lang="css"&gt;
  @import 'kitto/unify';

  :root {
    --c-black: hsl(230 50% 4%);
    --f-h1: fluid(2.5rem, 5rem) / 1.2 var(--f-family);
    /* ... */
  }
&lt;/style&gt;`
		},
		{
			title: 'storable',
			badge: 'kitto/svelte',
			desc: 'Stores that persist to localStorage. Used for cookie prefs; use for any user preference.',
			example: `import { storable } from 'kitto/svelte'

export const prefs = storable({ cookie: undefined }, 'prefs')`
		}
	]
</script>

<main class="page">
	<section class="hero">
		<h1 class="hero-title">Opinionated SvelteKit starter</h1>
		<p class="hero-desc">
			Stock SvelteKit stays unopinionated; you configure everything. This starter picks a stack — LightningCSS,
			design tokens, security headers, and a few conventions — so you can skip the setup and start building.
			<span>Feel free to delete this page.</span>
		</p>
	</section>

	<section class="items">
		{#each items as item}
			<article class="item">
				<div class="item-header">
					<span class="item-badge">{item.badge}</span>
					<h3 class="item-title">{item.title}</h3>
				</div>
				<p class="item-desc">{item.desc}</p>
				{#if item.examples}
					{#each item.examples as ex}
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
			<a href="https://kit.svelte.dev">SvelteKit docs</a>
			<span class="separator">·</span>
			<a href="https://kit.svelte.dev/docs">Get started</a>
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
		max-width: 48ch;
		margin: 0;
		line-height: 1.6;

		span {
			color: var(--page-text);
		}
	}

	.items {
		margin: 0 auto;
		max-width: 52rem;
		width: 90vw;
		padding: clamp(2rem, 5vw, 3rem) 0 clamp(4rem, 8vw, 6rem);
		border-top: 0.5px solid var(--page-border);
	}

	.section-title {
		font: var(--f-h2);
		font-weight: 600;
		margin: 0 0 2rem;
		letter-spacing: -0.02em;
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
		flex-wrap: wrap;
		align-items: baseline;
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
