<script lang="ts">
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    
    let username = '';
    let password = '';
    
    async function handleSubmit() {
      // TODO: Replace with actual API call
      if (username === 'test' && password === 'password') {
        auth.login({ id: 1, username });
        navigate('/objectives');
      } else {
        alert('Invalid credentials');
      }
    }
    </script>
    
    <form on:submit|preventDefault={handleSubmit}>
      <input type="text" bind:value={username} placeholder="Username" required>
      <input type="password" bind:value={password} placeholder="Password" required>
      <button type="submit">Login</button>
    </form>