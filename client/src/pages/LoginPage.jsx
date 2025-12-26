import React, { useState, useContext } from 'react';
import { StoreContext } from '../App';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

const LoginPage = observer(() => {
    const { authStore } = useContext(StoreContext); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    // Валидация доменов
    const validate = () => {
        const newErrors = {};
        const allowedDomains = ['@gmail.com', '@mail.ru', '@yandex.ru', '@bk.ru', '@list.ru'];
        const hasValidDomain = allowedDomains.some(domain => email.toLowerCase().endsWith(domain));

        if (!email || !hasValidDomain) {
            newErrors.auth = 'Неверный формат почты или домен';
        } else if (password.length < 1) {
            newErrors.auth = 'Введите пароль';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Сразу очищаем старые ошибки
        
        if (!validate()) return;

        try {
            const response = await authStore.login(email, password);
            if (!response) {
                setErrors({ auth: 'Неверный логин или пароль' });
            }
        } catch (err) {
            // Здесь мы игнорируем err.message от сервера и ставим свой текст
            setErrors({ auth: 'Неверный логин или пароль' });
        }
    };

    // Функция для очистки ошибки при вводе (чтобы красный текст пропадал сразу)
    const handleInputChange = (field, value) => {
        if (field === 'email') setEmail(value);
        if (field === 'password') setPassword(value);
        if (errors.auth) setErrors({}); 
    };

    return (
        <div style={{ maxWidth: '400px', margin: '80px auto', padding: '0 20px' }}>
            <h2 style={{ color: '#1C454B', textAlign: 'center', marginBottom: '30px', fontWeight: '700' }}>
                Вход в TravelLog
            </h2>

            <section style={{ backgroundColor: 'white', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    
                    {/*  */}

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Электронная почта</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            style={{
                                ...inputStyle, 
                                borderColor: errors.auth ? '#d62424' : '#eee'
                            }}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Пароль</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            style={{
                                ...inputStyle, 
                                borderColor: errors.auth ? '#d62424' : '#eee'
                            }}
                        />
                    </div>

                    {/* Только чистый красный текст ошибки */}
                    {errors.auth && (
                        <div style={errorTextStyle}>
                            {errors.auth}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={authStore.isLoading} 
                        style={{
                            ...btnStyle,
                            backgroundColor: authStore.isLoading ? '#ccc' : '#1C454B',
                            cursor: authStore.isLoading ? 'not-allowed' : 'pointer',
                            marginTop: errors.auth ? '5px' : '15px'
                        }}
                    >
                        {authStore.isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
                    <span style={{ color: '#888' }}>Нет аккаунта? </span>
                    <Link to="/registration" style={{ color: '#1C454B', fontWeight: '600', textDecoration: 'none' }}>
                        Регистрация
                    </Link>
                </div>
            </section>
        </div>
    );
});

const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '14px', color: '#666', marginLeft: '4px', fontWeight: '500' };
const inputStyle = { padding: '12px 15px', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#f9f9f9', fontSize: '15px', outline: 'none', transition: '0.2s' };
const btnStyle = { padding: '14px', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', transition: '0.3s' };

const errorTextStyle = { 
    color: '#d62424ff', 
    fontSize: '13px', 
    textAlign: 'center', 
    fontWeight: '500',
    minHeight: '18px' 
};

export default LoginPage;