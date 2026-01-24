import API_URL from '../config';

export const getCsrfToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    
    console.log('CSRF token from cookie:', cookieValue);
    return cookieValue;
}

export const fetchCsrfToken = async () => {
    try {
        await fetch(`${API_URL}/api/csrf/`, {
            method: 'GET',
            credentials: 'include',
        });
        
        const token = getCsrfToken();
        console.log('CSRF cookie set:', token ? 'Yes' : 'No');
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
}

export const ensureCsrfToken = async () => {
    let token = getCsrfToken();
    
    if (!token) {
        await fetchCsrfToken();
        token = getCsrfToken();
    }
    
    return token;
}