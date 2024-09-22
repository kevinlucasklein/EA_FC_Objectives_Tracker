<script lang="ts">
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';
  
    onMount(() => {
      const unsubscribe = auth.subscribe(user => {
        if (!user) {
          navigate('/login');
        }
      });
  
      return unsubscribe;
    });
  </script>
  
  <slot />