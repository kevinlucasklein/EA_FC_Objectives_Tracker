<script lang="ts">
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';
    
    let isAuthenticated = false;
    
    onMount(() => {
      const unsubscribe = auth.subscribe(user => {
        isAuthenticated = !!user;
        if (!isAuthenticated) {
          navigate('/login', { replace: true });
        }
      });
    
      return unsubscribe;
    });
    </script>
    
    {#if isAuthenticated}
      <slot />
    {/if}