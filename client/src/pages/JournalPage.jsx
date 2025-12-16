import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';
import JournalPlaceCard from '../components/JournalPlaceCard';

const JournalPage = observer(() => {
    const { journalStore } = useContext(StoreContext);
    
    //состояние для текущего фильтра: 'all', 'want_to_visit', 'visited'
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        journalStore.fetchJournal();
    }, [journalStore]);

    if (journalStore.isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка вашего журнала...</div>;
    }

    //ЛОГИКА ФИЛЬТРАЦИИ
    const filteredPlaces = journalStore.journalPlaces.filter(entry => {
        if (filter === 'all') return true;
        return entry.status === filter;
    });

    //стили для кнопок-табов
    const getTabStyle = (tabName) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '20px',
        backgroundColor: filter === tabName ? '#1C454B' : '#e0e0e0',
        color: filter === tabName ? 'white' : '#333',
        fontWeight: 'bold',
        transition: '0.3s'
    });

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Мой Журнал Путешествий</h1>

            {/* ПАНЕЛЬ ТАБОВ */}
            <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '30px', 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '30px',
                width: 'fit-content'
            }}>
                <button onClick={() => setFilter('all')} style={getTabStyle('all')}>
                    Все ({journalStore.journalPlaces.length})
                </button>
                <button onClick={() => setFilter('want_to_visit')} style={getTabStyle('want_to_visit')}>
                    Хочу посетить ({journalStore.journalPlaces.filter(p => p.status === 'want_to_visit').length})
                </button>
                <button onClick={() => setFilter('visited')} style={getTabStyle('visited')}>
                    Посещено ({journalStore.journalPlaces.filter(p => p.status === 'visited').length})
                </button>
            </div>

            {/* СПИСОК КАРТОЧЕК */}
            {filteredPlaces.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <p style={{ color: '#666' }}>В этой категории пока нет мест.</p>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '20px' 
                }}>
                    {filteredPlaces.map(entry => (
                        <JournalPlaceCard 
                            key={entry.id} 
                            entry={entry} 
                            journalStore={journalStore} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default JournalPage;