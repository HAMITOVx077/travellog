import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';
import { useNavigate } from 'react-router-dom';

const ProfilePage = observer(() => {
    const { authStore, journalStore } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        journalStore.fetchJournal();
    }, [journalStore]);

    const totalPlaces = journalStore.journalPlaces.length;
    const visitedPlaces = journalStore.journalPlaces.filter(p => p.status === 'visited').length;
    const wantToVisit = totalPlaces - visitedPlaces;
    
    const visitedCountries = new Set(
        journalStore.journalPlaces
            .filter(p => p.status === 'visited')
            .map(p => p.Place?.country)
            .filter(Boolean)
    ).size;

    const handleLogout = () => {
        if (window.confirm("Вы уверены, что хотите выйти?")) {
            authStore.logout();
            navigate('/login');
        }
    };

    // Определяем, что отображать в качестве имени
    const displayName = authStore.user?.username || authStore.user?.email || 'Пользователь';

    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ color: '#1C454B', marginBottom: '30px' }}>Личный профиль</h1>

            <div style={{ 
                backgroundColor: 'white', 
                padding: '40px', 
                borderRadius: '15px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                textAlign: 'center',
                border: '1px solid #eee'
            }}>
                {/* Аватар-буква */}
                <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    backgroundColor: '#1C454B', 
                    color: 'white', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '36px',
                    margin: '0 auto 20px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(28, 69, 75, 0.2)'
                }}>
                    {displayName.charAt(0).toUpperCase()}
                </div>

                {/* Здесь теперь отображается логин пользователя */}
                <h2 style={{ marginBottom: '5px', color: '#333' }}>
                    {displayName}
                </h2>
                
                {/* Если отображается username, почту выводим чуть ниже серым цветом */}
                {authStore.user?.username && (
                    <p style={{ color: '#888', marginBottom: '40px', fontSize: '15px' }}>{authStore.user.email}</p>
                )}
                
                {!authStore.user?.username && <div style={{ marginBottom: '40px' }} />}

                {/* СТАТИСТИКА */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '15px',
                    marginBottom: '40px' 
                }}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{visitedPlaces}</div>
                        <div style={statLabelStyle}>Мест посещено</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{visitedCountries}</div>
                        <div style={statLabelStyle}>Стран открыто</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{wantToVisit}</div>
                        <div style={statLabelStyle}>В планах</div>
                    </div>
                </div>

                {/* КНОПКИ УПРАВЛЕНИЯ */}
                <div style={{ 
                    borderTop: '1px solid #f5f5f5', 
                    paddingTop: '30px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '15px' 
                }}>
                    <button 
                        onClick={() => navigate('/journal')}
                        style={{ 
                            padding: '12px 25px', 
                            backgroundColor: '#1C454B', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: '0.2s'
                        }}
                    >
                        Открыть журнал
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        style={{ 
                            padding: '12px 25px', 
                            backgroundColor: 'white', 
                            color: '#666', 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Выйти
                    </button>
                </div>
            </div>
        </div>
    );
});

const statCardStyle = {
    padding: '15px 10px',
    backgroundColor: '#fcfcfc',
    borderRadius: '12px',
    border: '1px solid #f0f0f0'
};

const statValueStyle = {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1C454B',
    marginBottom: '4px'
};

const statLabelStyle = {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

export default ProfilePage;