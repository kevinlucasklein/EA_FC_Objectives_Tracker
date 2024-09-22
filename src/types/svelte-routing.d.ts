declare module 'svelte-routing' {
    import { SvelteComponent } from 'svelte';
  
    export class Router extends SvelteComponent<{
      url?: string;
    }> {}
  
    export class Route extends SvelteComponent<{
      path?: string;
      component?: SvelteComponent | (() => SvelteComponent);
    }> {}
  
    export class Link extends SvelteComponent<{
      to: string;
      replace?: boolean;
    }> {}
  
    export function navigate(to: string, options?: { replace?: boolean }): void;
  }