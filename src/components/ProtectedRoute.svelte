<script lang="ts">
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';
    
    let isAuthenticated = false;
    let isLoading = true;
    
    onMount(() => {
        const unsubscribe = auth.subscribe(user => {
            isAuthenticated = !!user;
            isLoading = false;
        });

        // Introduce a delay before redirecting
        const timeoutId = setTimeout(() => {
            if (!isLoading && !isAuthenticated) {
                navigate('/login', { replace: true });
            }
        }, 500); // 500ms delay

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    });
</script>
    
{#if isLoading}
    <p>Loading...</p>
{:else if isAuthenticated}
    <slot />
{:else}
    <p>Redirecting to login...</p>
{/if}