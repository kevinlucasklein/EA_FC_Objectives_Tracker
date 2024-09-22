import { auth } from '../stores/auth';
import { navigate } from 'svelte-routing';

export async function apiRequest(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const headers = new Headers(options.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
  
    const response = await fetch(url, { ...options, headers });
  
    if (response.status === 401) {
        localStorage.removeItem('token');
        auth.logout();
        navigate('/login');
    }
  
    return response;
}