<script lang="ts">
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    
    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let platform = '';
    
    async function handleSubmit() {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    
      if (!platform) {
        alert('Please select a gaming platform');
        return;
      }
    
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, platform }),
        });
    
        if (response.ok) {
          const user = await response.json();
          auth.login(user);
          navigate('/objectives');
        } else {
          const error = await response.text();
          alert(`Registration failed: ${error}`);
        }
      } catch (error) {
        alert('Registration failed: Network error');
      }
    }
    </script>
    
    <form on:submit|preventDefault={handleSubmit}>
      <input type="text" bind:value={username} placeholder="Username" required>
      <input type="email" bind:value={email} placeholder="Email" required>
      <input type="password" bind:value={password} placeholder="Password" required>
      <input type="password" bind:value={confirmPassword} placeholder="Confirm Password" required>
      
      <select bind:value={platform} required>
        <option value="">Select your gaming platform</option>
        <option value="console">Console</option>
        <option value="pc">PC</option>
      </select>
    
      <button type="submit">Register</button>
    </form>
    
    <p>Already have an account? <a href="/login">Login</a></p>
    
    <style>
      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 300px;
        margin: 0 auto;
      }
    
      select {
        padding: 5px;
      }
    </style>