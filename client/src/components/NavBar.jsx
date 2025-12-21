import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../App';

const NavBar = observer(() => {
    const { authStore } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        authStore.logout();
        navigate('/login');
    };

    // Простой стиль ссылок с подчеркиванием
    const linkStyle = ({ isActive }) => ({
        color: 'white',
        textDecoration: 'none',
        fontWeight: isActive ? '700' : '400',
        fontSize: '15px',
        borderBottom: isActive ? '2px solid #F4D0D0' : '2px solid transparent',
        paddingBottom: '4px',
        transition: '0.2s'
    });

    return (
        <header style={{ 
            padding: '15px 40px', 
            backgroundColor: '#1C454B', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            {/* НАВИГАЦИЯ */}
            <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                <NavLink to="/" style={linkStyle} className="nav-link">Каталог</NavLink>
                
                {authStore.isAuth && (
                    <NavLink to="/journal" style={linkStyle} className="nav-link">Мой журнал</NavLink>
                )}

                <NavLink to="/about" style={linkStyle} className="nav-link">О проекте</NavLink>
                
                {authStore.user?.role?.toUpperCase() === 'ADMIN' && (
                    <NavLink to="/admin" style={linkStyle} className="nav-link">Панель администратора</NavLink>
                )}
            </nav>

            {/* БЛОК ПОЛЬЗОВАТЕЛЯ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {authStore.isAuth ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ color: 'white', fontSize: '14px', borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: '20px' }}>
                            {authStore.user.username || authStore.user.email}
                        </div>
                        
                        <NavLink to="/profile" style={linkStyle} className="nav-link">
                            Мой профиль
                        </NavLink>

                        <button 
                            onClick={handleLogout}
                            style={{
                                background: 'none',
                                border: '1px solid rgba(255,255,255,0.4)',
                                color: 'white',
                                padding: '6px 15px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                transition: '0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            Выйти
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <NavLink to="/login" style={linkStyle} className="nav-link">Вход</NavLink>
                        <Link to="/registration" style={{ 
                            color: '#1C454B', 
                            backgroundColor: '#F4D0D0', 
                            padding: '8px 18px', 
                            borderRadius: '6px', 
                            textDecoration: 'none',
                            fontWeight: '700',
                            fontSize: '14px'
                        }}>
                            Регистрация
                        </Link>
                    </div>
                )}
            </div>

            <style>{`
                .nav-link:hover {
                    border-bottom: 2px solid rgba(244, 208, 208, 0.5) !important;
                }
            `}</style>
        </header>
    );
});

export default NavBar;