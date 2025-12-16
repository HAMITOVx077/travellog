import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { NavLink, Link } from 'react-router-dom';
import { StoreContext } from '../App';

const NavBar = observer(() => {
    const { authStore } = useContext(StoreContext);

    const linkStyle = ({ isActive }) => ({
        color: 'white',
        textDecoration: 'none',
        fontWeight: isActive ? 'bold' : 'normal',
        borderBottom: isActive ? '2px solid #F4D0D0' : 'none',
        paddingBottom: '5px'
    });

    return (
        <header style={{ 
            padding: '15px 30px', 
            backgroundColor: '#1C454B', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
        }}>
            <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                <NavLink to="/" style={linkStyle}>Каталог</NavLink>
                {authStore.isAuth && (
                    <NavLink to="/journal" style={linkStyle}>Мой Журнал</NavLink>
                )}
                {/* Ссылка на админку только для ADMIN */}
                {authStore.user?.role?.toUpperCase() === 'ADMIN' && (
                    <NavLink to="/admin" style={linkStyle}>Админка</NavLink>
                )}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {authStore.isAuth ? (
                    <>
                        <NavLink to="/profile" style={linkStyle}>
                            👤 Профиль
                        </NavLink>
                        <span style={{ 
                            color: '#F4D0D0', 
                            fontSize: '14px', 
                            borderLeft: '1px solid #555', 
                            paddingLeft: '15px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end'
                        }}>
                            <span>{authStore.user.username || authStore.user.email}</span>
                            {authStore.user.role === 'admin' && <small style={{fontSize: '10px', opacity: 0.8}}>Administrator</small>}
                        </span>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" style={linkStyle}>Вход</NavLink>
                        <Link to="/registration" style={{ 
                            color: '#1C454B', 
                            backgroundColor: '#F4D0D0', 
                            padding: '8px 18px', 
                            borderRadius: '20px', 
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}>Регистрация</Link>
                    </>
                )}
            </div>
        </header>
    );
});

export default NavBar;