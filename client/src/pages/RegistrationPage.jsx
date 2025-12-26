import React, { useState, useContext } from 'react';
import { StoreContext } from '../App';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

const RegistrationPage = observer(() => {
    const { authStore } = useContext(StoreContext); 
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        const allowedDomains = ['@gmail.com', '@mail.ru', '@yandex.ru', '@bk.ru', '@list.ru'];

        if (username.trim().length < 3) {
            newErrors.username = 'Никнейм должен быть не менее 3 символов';
        }
        
        const hasValidDomain = allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
        if (!hasValidDomain) {
            newErrors.email = 'Разрешены: gmail.com, mail.ru, yandex.ru, bk.ru, list.ru';
        }

        if (password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await authStore.registration(username, email, password);
        } catch (err) {
            setErrors({ server: err.response?.data?.message || 'Ошибка регистрации' });
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '60px auto', padding: '0 20px' }}>
            <h2 style={{ color: '#1C454B', textAlign: 'center', marginBottom: '30px', fontWeight: '700' }}>
                Создать аккаунт
            </h2>

            <section style={{ backgroundColor: 'white', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    
                    {errors.server && (
                        <div style={{ color: 'red', fontSize: '13px', textAlign: 'center', backgroundColor: '#FDF2F2', padding: '8px', borderRadius: '8px' }}>
                            {errors.server}
                        </div>
                    )}

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Имя пользователя</label>
                        <input
                            type="text"
                            placeholder="ivan_traveler"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{...inputStyle, borderColor: errors.username ? 'red' : '#eee'}}
                        />
                        {errors.username && <span style={errorTextStyle}>{errors.username}</span>}
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Электронная почта</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{...inputStyle, borderColor: errors.email ? 'red' : '#eee'}}
                        />
                        {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Пароль</label>
                        <input
                            type="password"
                            placeholder="Минимум 6 символов"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{...inputStyle, borderColor: errors.password ? 'red' : '#eee'}}
                        />
                        {errors.password && <span style={errorTextStyle}>{errors.password}</span>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={authStore.isLoading}
                        style={{
                            ...btnStyle,
                            backgroundColor: authStore.isLoading ? '#ccc' : '#1C454B',
                            cursor: authStore.isLoading ? 'not-allowed' : 'pointer'
                        }}
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
        </div>
    );
});

const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '14px', color: '#666', marginLeft: '4px', fontWeight: '500' };
const inputStyle = { padding: '12px 15px', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#f9f9f9', fontSize: '15px', outline: 'none' };
const btnStyle = { padding: '14px', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', marginTop: '10px' };
const errorTextStyle = { color: '#d62424ff', fontSize: '13px', marginLeft: '4px' }; // Убрал fontWeight: '700'

export default RegistrationPage;