<script lang="ts">
    import { navigate } from "svelte-routing";
    import { auth } from '../stores/auth';
    import { onMount } from 'svelte';

    let isAdmin = false;
    let isLoading = true;

    onMount(() => {
        const unsubscribe = auth.subscribe(user => {
            isAdmin = user?.isadmin || false;
            isLoading = false;
            console.log('AdminProtectedRoute - User state:', { isAdmin, isLoading });

            // Only navigate if loading is complete and user is not an admin
            if (!isLoading && !isAdmin) {
                console.log('AdminProtectedRoute - Navigating to home');
                navigate("/", { replace: true });
            }
        });

        return () => {
            unsubscribe();
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