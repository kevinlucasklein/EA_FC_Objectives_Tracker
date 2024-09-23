import { writable } from 'svelte/store';
import { validateAndSetUser } from '../utils/validateAndSetUser';

type User = {
    userid: number;
    username: string;
    email: string;
    gamingplatform: string;
    isadmin: boolean;
};

function createAuth() {
    const { subscribe, set, update } = writable<User | null>(null);

    return {
        subscribe,
        login: (user: User) => set(user),
        logout: () => {
            set(null);
            localStorage.removeItem('token');
        },
        updateUser: (data: Partial<User>) => update(user => user ? { ...user, ...data } : null),
        clear: () => {
            set(null);
            localStorage.removeItem('token');
        }
    };
}

export const auth = createAuth();

export function initAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        validateAndSetUser(token);
    } else {
        auth.logout();
    }
}