import { makeAutoObservable } from "mobx";
import $api from "../api"; 
import { jwtDecode } from 'jwt-decode';

class AuthStore {
    isAuth = false;
    user = {};
    isLoading = true; //начальное состояние - загрузка

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

    //МЕТОДЫ HTTP-ЗАПРОСОВ

    async login(email, password) {
        try {
            //в логине и регистрации не устанавливаем главный isLoading,
            //чтобы не блокировать весь App.jsx, а только кнопку формы.
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

    async logout() {
        localStorage.removeItem('token');
        this.setAuth(false);
        this.setUser({});
    }
    
    //ПРОВЕРКА ТОКЕНА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ (САМЫЙ ВАЖНЫЙ МЕТОД)
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
            //ГАРАНТИЯ: isLoading всегда сбросится, независимо от результата
            this.setLoading(false); 
        }
    }
}

export default new AuthStore();