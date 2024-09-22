import { writable } from 'svelte/store';

type User = {
  id: number;
  username: string;
  // Add other user properties as needed
};

function createAuthStore() {
  const { subscribe, set, update } = writable<User | null>(null);

  return {
    subscribe,
    login: (user: User) => set(user),
    logout: () => set(null),
    // Add other auth-related methods as needed
  };
}

export const auth = createAuthStore();