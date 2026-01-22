import API_URL from '../config';

let cachedCsrfToken = null;

export const getCsrfToken = () => {
    return cachedCsrfToken;
}

export const fetchCsrfToken = async () => {
    try {
        const response = await fetch(`${API_URL}/api/csrf/`, {
            method: 'GET',
            credentials: 'include',
        });
        
        if (response.ok) {
            const data = await response.json();
            cachedCsrfToken = data.csrfToken;
            console.log('CSRF token obtained:', cachedCsrfToken);
        }
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
}