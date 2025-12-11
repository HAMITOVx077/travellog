import React, { useState, useContext } from 'react';
import { StoreContext } from '../App';
import { observer } from 'mobx-react-lite';

const RegistrationPage = observer(() => {
    const store = useContext(StoreContext); 
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await store.registration(username, email, password);
    };

    return (
        <div className="auth-container"> {/* Используем новый класс */}
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
                    disabled={store.isLoading}
                >
                    Зарегистрироваться
                </button>
            </form>
        </div>
    );
});

export default RegistrationPage;