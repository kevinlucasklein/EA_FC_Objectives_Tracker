<script lang="ts">
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    
    let username = '';
    let password = '';
    
    async function handleSubmit() {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      auth.login({ ...data.user, isAdmin: data.user.isAdmin });  // Make sure isAdmin is included
      localStorage.setItem('token', data.token);
      navigate('/objectives');

    } else {
      const error = await response.text();
      alert(`Login failed: ${error}`);
    }
  } catch (error) {
    alert('Login failed: Network error');
  }
}
    </script>
    
    <form on:submit|preventDefault={handleSubmit}>
      <input type="text" bind:value={username} placeholder="Username" required>
      <input type="password" bind:value={password} placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    <p>Don't have an account? <a href="/register">Register</a></p>