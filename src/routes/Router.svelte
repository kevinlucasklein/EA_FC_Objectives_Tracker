<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import Home from "./Home.svelte";
    import Login from "./Login.svelte";
    import Objectives from "./Objectives.svelte";
    import ProtectedRoute from "../components/ProtectedRoute.svelte";
    import Logout from "../components/Logout.svelte";
    import { auth } from '../stores/auth';
    
    export let url = "";
    
    let isLoggedIn = false;
    
    auth.subscribe(user => {
      isLoggedIn = !!user;
    });
    </script>
    
    <Router {url}>
      <nav>
        <a href="/">Home</a>
        {#if isLoggedIn}
          <a href="/objectives">Objectives</a>
          <Logout />
        {:else}
          <a href="/login">Login</a>
        {/if}
      </nav>
    
      <main>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/objectives">
          <ProtectedRoute>
            <Objectives />
          </ProtectedRoute>
        </Route>
      </main>
    </Router>