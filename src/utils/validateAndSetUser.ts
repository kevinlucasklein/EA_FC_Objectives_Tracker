import { apiRequest } from '../utils/api';
import { auth } from '../stores/auth';

export async function validateAndSetUser(token: string) {
    try {
        const response = await apiRequest('/api/validate-token', {
            method: 'POST',
            body: JSON.stringify({ token })
        });
        if (response.ok) {
            const { user, token: newToken } = await response.json();
            auth.login(user);
            // Update the token in localStorage if a new one was provided
            if (newToken) {
                localStorage.setItem('token', newToken);
            }
        } else {
            // Token is invalid, clear it
            localStorage.removeItem('token');
            auth.logout();
        }
    } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        auth.logout();
    }
}