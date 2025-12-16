import React, { useState, useContext } from 'react';
import { StoreContext } from '../App';
import { observer } from 'mobx-react-lite';

const RegistrationPage = observer(() => {
    //используем деструктуризацию для получения только authStore из контекста
    const { authStore } = useContext(StoreContext); 
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        //используем authStore для вызова метода registration
        await authStore.registration(username, email, password);
    };

    return (
        <div className="auth-container">
            <h2 className='registration_travel_text'>Регистрация в TravelLog</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
                    Зарегистрироваться
                </button>
            </form>
        </div>
    );
});

export default RegistrationPage;