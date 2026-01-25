import API_URL from '../config';

let cachedCsrfToken = null;
let csrfPromise = null;

export const getCsrfToken = () => {
    return cachedCsrfToken;
}

export const fetchCsrfToken = async () => {
        if (csrfPromise) {
        return csrfPromise;
    }
    
    csrfPromise = (async () => {
        try {
            const response = await fetch(`${API_URL}/api/csrf/`, {
                method: 'GET',
                credentials: 'include',
            });
            
            if (response.ok) {
                const data = await response.json();
                cachedCsrfToken = data.csrfToken;
                console.log('CSRF token obtained:', cachedCsrfToken);
                return cachedCsrfToken;
            }
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        } finally {
            csrfPromise = null;
        }
    })();
    
    return csrfPromise;
}

export const ensureCsrfToken = async () => {
    if (!cachedCsrfToken) {
        await fetchCsrfToken();
    }
    return cachedCsrfToken;
}

