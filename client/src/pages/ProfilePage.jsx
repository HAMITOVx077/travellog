import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';
import { useNavigate } from 'react-router-dom';

const ProfilePage = observer(() => {
    const { authStore, journalStore } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        //подгружаем журнал, чтобы статистика была актуальной
        journalStore.fetchJournal();
    }, [journalStore]);

    //логика статистики
    const totalPlaces = journalStore.journalPlaces.length;
    const visitedPlaces = journalStore.journalPlaces.filter(p => p.status === 'visited').length;
    const wantToVisit = totalPlaces - visitedPlaces;
    
    //считаем уникальные страны, в которых побывал пользователь
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

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ 
                backgroundColor: 'white', 
                padding: '40px', 
                borderRadius: '15px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                {/* Аватар-заглушка */}
                <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    backgroundColor: '#1C454B', 
                    color: 'white', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '40px',
                    margin: '0 auto 20px',
                    fontWeight: 'bold'
                }}>
                    {authStore.user?.email?.charAt(0).toUpperCase()}
                </div>

                <h2 style={{ marginBottom: '10px' }}>Личный кабинет</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>{authStore.user?.email}</p>

                {/* карточка статистики */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '20px',
                    marginBottom: '40px' 
                }}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{visitedPlaces}</div>
                        <div style={statLabelStyle}>Посещено мест</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{visitedCountries}</div>
                        <div style={statLabelStyle}>Стран пройдено</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{wantToVisit}</div>
                        <div style={statLabelStyle}>В планах</div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button 
                        onClick={() => navigate('/journal')}
                        style={{ padding: '12px 25px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Открыть журнал
                    </button>
                    <button 
                        onClick={handleLogout}
                        style={{ padding: '12px 25px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Выйти из аккаунта
                    </button>
                </div>
            </div>
        </div>
    );
});

//вспомогательные стили
const statCardStyle = {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #eee'
};

const statValueStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1C454B',
    marginBottom: '5px'
};

const statLabelStyle = {
    fontSize: '14px',
    color: '#666'
};

export default ProfilePage;