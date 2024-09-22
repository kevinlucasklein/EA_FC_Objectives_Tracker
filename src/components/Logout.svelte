<script lang="ts">
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    
    function handleLogout() {
      // Clear the token from localStorage
      localStorage.removeItem('token');
      
      // Clear the auth store
      auth.logout();
      
      // Navigate to the login page
      navigate('/login', { replace: true });
    }
</script>
    
<button on:click={handleLogout}>Logout</button>