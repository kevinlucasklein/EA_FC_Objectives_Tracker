<script lang="ts">
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    
    function handleLogout() {
      auth.logout();
      navigate('/login');
    }
    </script>
    
    <button on:click={handleLogout}>Logout</button>