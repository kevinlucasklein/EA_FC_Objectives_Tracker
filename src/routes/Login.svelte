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
  
  <!-- ... form HTML remains the same ... -->