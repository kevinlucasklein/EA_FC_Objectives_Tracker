import { apiRequest } from '../utils/api';
import { auth } from '../stores/auth';

export async function validateAndSetUser(token: string) {
    try {
        console.log('Validating token:', token);
        const response = await apiRequest('/api/validate-token', {
            method: 'POST',
            body: JSON.stringify({ token })
        });
        if (response.ok) {
            const { user, token: newToken } = await response.json();
            console.log('Token valid, user:', user);
            auth.login(user); // Ensure this correctly sets the user in the auth store
            // Update the token in localStorage if a new one was provided
            if (newToken) {
                localStorage.setItem('token', newToken);
            }
        } else {
            // Token is invalid, clear it
            console.log('Token invalid');
            localStorage.removeItem('token');
            auth.logout();
        }
    } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        auth.logout();
    }
}