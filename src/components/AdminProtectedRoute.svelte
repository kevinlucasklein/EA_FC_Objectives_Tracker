<script lang="ts">
    import { navigate } from "svelte-routing";
    import { auth } from '../stores/auth';
    import { onMount } from 'svelte';

    let isAdmin = false;
    let isLoading = true;

    onMount(() => {
        const unsubscribe = auth.subscribe(user => {
            isAdmin = user?.isAdmin || false;
            isLoading = false;
        });

        // Introduce a delay before redirecting
        const timeoutId = setTimeout(() => {
            if (!isLoading && !isAdmin) {
                navigate("/", { replace: true });
            }
        }, 500); // Increased delay to 500ms

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    });
</script>

{#if isLoading}
    <p>Loading...</p>
{:else if isAdmin}
    <slot />
{:else}
    <p>Redirecting...</p>
{/if}