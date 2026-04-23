<script lang="ts">
	import { auth_client } from '$library/auth_client.js'
	import { api } from '$convex/_generated/api'
	import { useQuery } from '@mmailaender/convex-svelte'
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte'

	let { data } = $props()

	// Auth state store
	const auth = useAuth()
	const is_loading = $derived(auth.isLoading)
	const is_authenticated = $derived(auth.isAuthenticated)

	const current_user_response = useQuery(
		api.auth.get_current_user,
		() => (is_authenticated ? {} : 'skip'),
		() => ({ initialData: data.current_user, keepPreviousData: true })
	)
	let user = $derived(current_user_response.data)

	// Sign in/up form state
	let email = $state('darby@uilo.co')
	let sent_magic_link = $state(false)

	// Handle form submission
	async function onsubmit(event: Event) {
		event.preventDefault()

		auth_client.signIn.magicLink(
			{
				email: email.trim(),
				callbackURL: '/account',
				errorCallbackURL: '/account',
				newUserCallbackURL: '/account'
			},
			{
				onError: (ctx) => console.error('Authentication error:', ctx.error.message),
				onSuccess: () => void (sent_magic_link = true)
			}
		)
	}

	// Sign out function
	async function sign_out() {
		auth_client.signOut().catch(console.error)
	}

	let access_token = $state<string | null>(null)
	let token_loading = $state(false)

	function fetch_token() {
		token_loading = true

		auth
			.fetchAccessToken({ forceRefreshToken: true })
			.then((token) => (access_token = token))
			.catch((error) => {
				console.error('Error fetching access token:', error)
				access_token = 'Error fetching token'
			})
			.finally(() => (token_loading = false))
	}
</script>

<section aria-busy={is_loading} class="contain">
	{#if is_loading}
		Loading...
	{:else if !is_authenticated || !user}
		<h2>Send Magic Link</h2>
		{#if sent_magic_link}
			<p>Magic link sent to {email}</p>
		{:else}
			<form {onsubmit}>
				<input type="email" bind:value={email} placeholder="Email" required />
				<button type="submit">Send</button>
			</form>
		{/if}
	{:else if is_authenticated && user}
		<h1>Hey {user?.email} 👋</h1>
		<button onclick={fetch_token} disabled={token_loading}>
			{token_loading ? 'Fetching...' : 'Fetch Access Token'}
		</button>
		{#if access_token}
			<pre>{access_token.length > 50 ? access_token.substring(0, 50) + '...' : access_token}</pre>
		{/if}
		<button onclick={sign_out}>Sign out</button>
	{/if}
</section>

<style>
	section {
		padding-block: 3rem;
		display: grid;
		gap: 1rem;
		justify-items: start;
	}

	h1 {
		font: 600 var(--f-h3);
	}

	input {
		padding: 0.5rem 1rem;
		border-radius: var(--r-6);
		border: 1px solid var(--c-black);
		font: 600 var(--f-excerpt);
		color: var(--c-black);
	}

	button {
		background-color: var(--c-black);
		color: var(--c-white);
		padding: 0.5rem 1rem;
		border-radius: var(--r-6);
		cursor: pointer;
		font: 600 var(--f-excerpt);
		border: none;
	}
</style>
