import React, { useState, useContext } from 'react';
import { StoreContext } from '../App';
import { observer } from 'mobx-react-lite';

const LoginPage = observer(() => {
    //используем деструктуризацию для получения только authStore из контекста
    const { authStore } = useContext(StoreContext); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        //используем authStore для вызова метода login
        await authStore.login(email, password);
    };

    return (
        <div className="auth-container">
            <h2 className='login_travel_text'> 
                Вход в TravelLog
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button 
                    type="submit" 
                    //используем authStore.isLoading, чтобы блокировать кнопку во время запроса
                    disabled={authStore.isLoading} 
                >
                    Войти
                </button>
            </form>
        </div>
    );
});

export default LoginPage;