import axios from 'axios'


const api = axios.create ({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message
            || (error.response
                ? `Request failed with status ${error.response.status}`
                : 'Unable to reach the server. Please try again.');

        return Promise.reject(new Error(message));
    }
)

export async function register ( { username, email, password }) {
    const response = await api.post('/api/auth/register', {
        username, email, password
    })
    return response.data
}

export async function login ({ email, password }) {
    const response = await api.post('/api/auth/login', {
        email, password
    })
    return response.data
}

export async function logout () {
    const response = await api.get('/api/auth/logout')
    return response.data
}

export async function getMe () {
    const response = await api.get('/api/auth/get-me')
    return response.data
}