import { makeAutoObservable } from "mobx";
import $api from "../api"; 
import { jwtDecode } from 'jwt-decode';

class AuthStore {
    isAuth = false;
    user = {};
    isLoading = true;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user) {
        this.user = user;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    //методы HTTP-запросов
    
    //вход в систему: отправляем данные - получаем токен - сохраняем его
    async login(email, password) {
        try {
            const response = await $api.post('/auth/login', { email, password });
            
            localStorage.setItem('token', response.data.token);
            const decodedUser = jwtDecode(response.data.token); 
            
            this.setAuth(true);
            this.setUser(decodedUser);
            return true;
        } catch (e) {
            console.error('Ошибка входа:', e.response?.data?.message);
            alert(e.response?.data?.message || 'Ошибка входа');
            return false;
        }
    }

    //регистрация создает нового пользователя
    async registration(username, email, password) {
        try {
            const response = await $api.post('/auth/registration', { username, email, password });
            
            localStorage.setItem('token', response.data.token);
            const decodedUser = jwtDecode(response.data.token);
            
            this.setAuth(true);
            this.setUser(decodedUser);
            return true;
        } catch (e) {
            console.error('Ошибка регистрации:', e.response?.data?.message);
            alert(e.response?.data?.message || 'Ошибка регистрации');
            return false;
        }
    }

    //выход, удаляем токен
    async logout() {
        localStorage.removeItem('token');
        this.setAuth(false);
        this.setUser({});
    }
    
    //проверка токена при загрузке страницы
    async checkAuth() {
        this.setLoading(true); //загрузка начинается

        try {
            const token = localStorage.getItem('token');
            
            if (token) {
                //если токен есть, пытаемся его обновить/проверить
                try {
                    const response = await $api.get('/auth/check'); 
                    
                    localStorage.setItem('token', response.data.token);
                    const decodedUser = jwtDecode(response.data.token);
                    
                    this.setAuth(true); 
                    this.setUser(decodedUser);
                } catch (e) {
                    //ошибка запроса (токен недействителен, просрочен, 401)
                    console.log('Токен недействителен или просрочен.', e.response?.data?.message);
                    localStorage.removeItem('token');
                    this.setAuth(false); //сбрасываем статус
                    this.setUser({});
                }
            } else {
                //если токена нет в localStorage
                this.setAuth(false);
                this.setUser({});
            }
        } catch (e) {
            //критическая ошибка сети (например, сервер недоступен)
            console.error('Критическая ошибка в checkAuth:', e);
            this.setAuth(false); 
            this.setUser({});
        } finally {
            this.setLoading(false); 
        }
    }

    //обновление информации в профиле
    async updateProfile(userData, avatarFile) {
    try {
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('email', userData.email);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        const response = await $api.patch('/auth/update-profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            const decodedUser = jwtDecode(response.data.token);
            this.setUser(decodedUser);
            return true;
        }
        } catch (e) {
            alert(e.response?.data?.message || 'Ошибка обновления');
            return false;
        }
    }
}

export default new AuthStore();