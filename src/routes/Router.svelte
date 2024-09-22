<script lang="ts">
    import { Router, Route, navigate } from "svelte-routing";
    import Home from "./Home.svelte";
    import Login from "./Login.svelte";
    import Objectives from "./Objectives.svelte";
    import Register from "./Register.svelte";
    import Admin from "./Admin.svelte";  
    import ProtectedRoute from "../components/ProtectedRoute.svelte";  
    import AdminProtectedRoute from "../components/AdminProtectedRoute.svelte";  
    import Logout from "../components/Logout.svelte";
    import { auth, initAuth } from '../stores/auth';
    import { onMount } from 'svelte';
    import { validateAndSetUser } from '../utils/validateAndSetUser';
    
    export let url = "";
    
    let isLoggedIn = false;
    let isAdmin = false;
    
    auth.subscribe(user => {
      isLoggedIn = !!user;
      isAdmin = user?.isAdmin || false;
    });

    onMount(() => {
        initAuth();
        
        // Listen for route changes
        window.addEventListener('popstate', checkAuth);
        
        return () => {
            window.removeEventListener('popstate', checkAuth);
        };
    });
    
    function checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            auth.clear();
            navigate('/login', { replace: true });
        }
    }
    
</script>

<Router {url}>
    <nav>
      <a href="/">Home</a>
      {#if isLoggedIn}
        <a href="/objectives">Objectives</a>
        {#if isAdmin}
          <a href="/admin">Admin</a>
        {/if}
        <Logout />
      {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      {/if}
    </nav>
  
    <main>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/objectives">
        <ProtectedRoute>
          <Objectives />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <AdminProtectedRoute>
          <Admin />
        </AdminProtectedRoute>
      </Route>
    </main>
</Router>