<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import Home from "./Home.svelte";
    import Login from "./Login.svelte";
    import Objectives from "./Objectives.svelte";
    import ProtectedRoute from "../components/ProtectedRoute.svelte";
    
    export let url = "";
    </script>
    
    <Router {url}>
      <nav>
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/objectives">Objectives</a>
      </nav>
    
      <main>
        <Route path="/" let:component>
          <svelte:component this={Home} />
        </Route>
        <Route path="/login" let:component>
          <svelte:component this={Login} />
        </Route>
        <Route path="/objectives" let:component>
          <ProtectedRoute>
            <svelte:component this={Objectives} />
          </ProtectedRoute>
        </Route>
      </main>
    </Router>