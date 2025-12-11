import axios from 'axios';

//базовый URL, соответствующий порту бэкенда
export const API_URL = 'http://localhost:5000/api';

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

//интерцептор: добавляет JWT-токен в заголовок Authorization
$api.interceptors.request.use((config) => {
    //получаем токен из localStorage
    const token = localStorage.getItem('token'); 
    if (token) {
        //добавляем токен в заголовок Bearer
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});

export default $api;