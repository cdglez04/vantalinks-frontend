import API_URL from '../config';

export const ensureCsrfCookie = async () => {
    await fetch(`${API_URL}/api/csrf/`, {
        method: 'GET',
        credentials: 'include',
    });
};

export const getCsrfTokenFromCookie = () => {
    const name = 'csrftoken=';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name)) {
            return cookie.substring(name.length);
        }
    }
    return null;
};
