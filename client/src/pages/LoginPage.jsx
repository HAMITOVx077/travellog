import React, { useState, useContext } from 'react';
import { StoreContext } from '../App';
import { observer } from 'mobx-react-lite';

const LoginPage = observer(() => {
    const store = useContext(StoreContext); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await store.login(email, password);
    };

    return (
        <div className="auth-container"> {/* Используем новый класс */}
            <h2 className='login_travel_text'> Вход в TravelLog</h2>
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
                    disabled={store.isLoading} 
                >
                    Войти
                </button>
            </form>
        </div>
    );
});

export default LoginPage;