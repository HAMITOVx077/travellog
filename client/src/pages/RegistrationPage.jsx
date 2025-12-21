import React, { useState, useContext } from 'react';
import { StoreContext } from '../App';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

const RegistrationPage = observer(() => {
    const { authStore } = useContext(StoreContext); 
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await authStore.registration(username, email, password);
    };

    return (
        <div style={{ 
            maxWidth: '400px', 
            margin: '60px auto', 
            padding: '0 20px' 
        }}>
            <h2 style={{ 
                color: '#1C454B', 
                textAlign: 'center', 
                marginBottom: '30px',
                fontWeight: '700' 
            }}>
                Создать аккаунт
            </h2>

            <section style={{ 
                backgroundColor: 'white', 
                padding: '35px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    
                    {/* Поле Имя пользователя */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Имя пользователя</label>
                        <input
                            type="text"
                            placeholder="Например, ivan_traveler"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Поле Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Электронная почта</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Поле Пароль */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>Пароль</label>
                        <input
                            type="password"
                            placeholder="Минимум 6 символов"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={authStore.isLoading}
                        style={{
                            ...btnStyle,
                            backgroundColor: authStore.isLoading ? '#ccc' : '#1C454B',
                            cursor: authStore.isLoading ? 'not-allowed' : 'pointer'
                        }}
                        className="auth-btn"
                    >
                        {authStore.isLoading ? 'Создание...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
                    <span style={{ color: '#888' }}>Уже есть аккаунт? </span>
                    <Link to="/login" style={{ color: '#1C454B', fontWeight: '600', textDecoration: 'none' }}>
                        Войти
                    </Link>
                </div>
            </section>

            <style>{`
                .auth-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .auth-btn:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
});

// Общие стили для консистентности
const labelStyle = { 
    fontSize: '14px', 
    color: '#666', 
    marginLeft: '4px',
    fontWeight: '500'
};

const inputStyle = { 
    padding: '12px 15px', 
    borderRadius: '8px', 
    border: '1px solid #eee', 
    backgroundColor: '#f9f9f9', 
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s'
};

const btnStyle = { 
    padding: '14px', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    fontWeight: '700', 
    fontSize: '16px',
    marginTop: '10px',
    transition: '0.2s'
};

export default RegistrationPage;