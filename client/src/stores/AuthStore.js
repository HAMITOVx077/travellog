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

    //методы http запросов

    async login(email, password) {
        try {
            const response = await $api.post('/auth/login', { email, password });
            
            localStorage.setItem('token', response.data.token);
            
            const decodedUser = jwtDecode(response.data.token); 
            
            this.setAuth(true);
            this.setUser(decodedUser);
            return true; //успех
        } catch (e) {
            console.error('Ошибка входа:', e.response?.data?.message);
            alert(e.response?.data?.message || 'Ошибка входа');
            return false; //провал
        }
    }

    async registration(username, email, password) {
        try {
            const response = await $api.post('/auth/registration', { username, email, password });
            
            localStorage.setItem('token', response.data.token);
            const decodedUser = jwtDecode(response.data.token);
            
            this.setAuth(true);
            this.setUser(decodedUser);
            return true; //успех
        } catch (e) {
            console.error('Ошибка регистрации:', e.response?.data?.message);
            alert(e.response?.data?.message || 'Ошибка регистрации');
            return false; //провал
        }
    }

    async logout() {
        localStorage.removeItem('token');
        this.setAuth(false);
        this.setUser({});
    }
    
    //проверка токена при загрузке страницы
    async checkAuth() {
        this.setLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
            try {
                //используем маршрут /check для обновления токена
                const response = await $api.get('/auth/check'); 
                
                localStorage.setItem('token', response.data.token);
                const decodedUser = jwtDecode(response.data.token);
                
                this.setAuth(true);
                this.setUser(decodedUser);

            } catch (e) {
                console.log('Токен недействителен или просрочен.');
                localStorage.removeItem('token');
            }
        }
        this.setLoading(false);
    }
}

export default new AuthStore();