import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';
import JournalPlaceCard from '../components/JournalPlaceCard';

const JournalPage = observer(() => {
    const { journalStore } = useContext(StoreContext);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        journalStore.fetchJournal();
    }, [journalStore]);

    if (journalStore.isLoading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px', color: '#1C454B', fontWeight: 'bold' }}>
                Загрузка вашего журнала...
            </div>
        );
    }

    const filteredPlaces = journalStore.journalPlaces.filter(entry => {
        if (filter === 'all') return true;
        return entry.status === filter;
    });

    // Обновленный стиль табов
    const getTabStyle = (tabName) => ({
        padding: '12px 24px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '10px',
        backgroundColor: filter === tabName ? '#1C454B' : 'transparent',
        color: filter === tabName ? 'white' : '#666',
        fontWeight: '700',
        fontSize: '14px',
        transition: '0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    });

    return (
        <div style={{ paddingBottom: '50px' }}>
            <h1 style={{ color: '#1C454B', marginBottom: '30px' }}>Мой журнал путешествий</h1>

            {/* ПАНЕЛЬ ТАБОВ */}
            <div style={{ 
                display: 'inline-flex', 
                gap: '5px', 
                marginBottom: '40px', 
                backgroundColor: 'white', 
                padding: '6px', 
                borderRadius: '14px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                border: '1px solid #eee'
            }}>
                <button onClick={() => setFilter('all')} style={getTabStyle('all')}>
                    Все 
                    <span style={{ opacity: 0.6, fontSize: '12px' }}>{journalStore.journalPlaces.length}</span>
                </button>
                <button onClick={() => setFilter('want_to_visit')} style={getTabStyle('want_to_visit')}>
                    В планах
                    <span style={{ opacity: 0.6, fontSize: '12px' }}>
                        {journalStore.journalPlaces.filter(p => p.status === 'want_to_visit').length}
                    </span>
                </button>
                <button onClick={() => setFilter('visited')} style={getTabStyle('visited')}>
                    Посещено
                    <span style={{ opacity: 0.6, fontSize: '12px' }}>
                        {journalStore.journalPlaces.filter(p => p.status === 'visited').length}
                    </span>
                </button>
            </div>

            {/* СПИСОК КАРТОЧЕК */}
            {filteredPlaces.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '80px 20px', 
                    backgroundColor: 'white', 
                    borderRadius: '20px',
                    border: '1px dashed #ccc'
                }}>
                    <p style={{ color: '#999', fontSize: '16px', margin: 0 }}>
                        {filter === 'all' 
                            ? 'Ваш журнал пока пуст. Добавьте места из каталога!' 
                            : 'В этой категории пока нет записей.'}
                    </p>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                    gap: '30px' 
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