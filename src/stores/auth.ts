import { writable } from 'svelte/store';

type User = {
  id: number;
  username: string;
};

function createAuthStore() {
  const { subscribe, set, update } = writable<User | null>(null);

  return {
    subscribe,
    login: (user: User) => set(user),
    logout: () => set(null),
  };
}

export const auth = createAuthStore();