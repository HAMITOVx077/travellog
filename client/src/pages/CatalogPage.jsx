import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';
import PlaceCard from '../components/PlaceCard';

const CatalogPage = observer(() => {
    const { placeStore, journalStore } = useContext(StoreContext);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'visited', 'want_to_visit', 'new'
    const [sortBy, setSortBy] = useState('latest'); // 'latest', 'country'

    useEffect(() => {
        placeStore.fetchPlaces();
        journalStore.fetchJournal();
    }, [placeStore, journalStore]);

    if (placeStore.isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '100px', color: '#1C454B', fontWeight: 'bold' }}>Загрузка каталога...</div>;
    }

    //ЛОГИКА ФИЛЬТРАЦИИ
    const filteredPlaces = placeStore.places.filter(place => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = place.name.toLowerCase().includes(query) || 
                             place.city.toLowerCase().includes(query) || 
                             place.country.toLowerCase().includes(query);
        
        const status = journalStore.getPlaceStatus(place.id);
        
        let matchesStatus = true;
        if (filterStatus === 'new') matchesStatus = !status;
        if (filterStatus === 'visited') matchesStatus = status?.status === 'visited';
        //теперь проверяем want_to_visit
        if (filterStatus === 'want_to_visit') matchesStatus = status?.status === 'want_to_visit';

        return matchesSearch && matchesStatus;
    });

    //ЛОГИКА СОРТИРОВКИ
    const sortedPlaces = [...filteredPlaces].sort((a, b) => {
        if (sortBy === 'latest') {
            //Сортировка по ID или дате (последние сверху)
            return b.id - a.id; 
        }
        if (sortBy === 'country') {
            return a.country.localeCompare(b.country);
        }
        return 0;
    });

    return (
        <div style={{ paddingBottom: '50px' }}>
            <h1 style={{ color: '#1C454B', marginBottom: '30px' }}>Каталог интересных мест</h1>

            {/* ПАНЕЛЬ ИНСТРУМЕНТОВ */}
            <div style={toolbarStyle}>
                {/* Поиск */}
                <div style={{ flex: '3', minWidth: '250px', position: 'relative' }}>
                    <input 
                        type="text"
                        placeholder="Поиск места..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={inputStyle}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} style={clearBtnStyle}>✕</button>
                    )}
                </div>

                {/* Статус */}
                <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={selectStyle}
                >
                    <option value="all">Все статусы</option>
                    <option value="visited">Посещенные</option>
                    <option value="want_to_visit">В планах</option>
                    <option value="new">Новые места</option>
                </select>

                {/* Сортировка */}
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={selectStyle}
                >
                    <option value="latest">Сначала новые (дата)</option>
                    <option value="country">По странам (А-Я)</option>
                </select>

                {/* Видный счетчик мест */}
                <div style={counterBadgeStyle}>
                    Найдено: <b>{sortedPlaces.length}</b>
                </div>
            </div>

            {/* СПИСОК МЕСТ */}
            {sortedPlaces.length === 0 ? (
                <div style={emptyStateStyle}>
                    <p style={{ color: '#999', fontSize: '18px', margin: 0 }}>Ничего не нашли...</p>
                    <button onClick={() => {setSearchQuery(''); setFilterStatus('all'); setSortBy('latest');}} style={resetBtnStyle}>Сбросить всё</button>
                </div>
            ) : (
                <div style={gridStyle}>
                    {sortedPlaces.map(place => (
                        <PlaceCard 
                            key={place.id} 
                            place={place} 
                            journalStore={journalStore} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

// СТИЛИ
const toolbarStyle = { 
    display: 'flex', 
    gap: '15px', 
    marginBottom: '40px', 
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
};

const counterBadgeStyle = {
    backgroundColor: '#f0f0f0', // Светло-серый фон
    color: '#1C454B',           // Цвет текста (темно-зеленый)
    padding: '12px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    border: '1px solid #e0e0e0', // Тонкая граница для четкости
    fontWeight: '500'            // Немного добавим веса тексту
};

const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
    gap: '30px' 
};

const inputStyle = {
    width: '100%', padding: '14px 45px 14px 20px', borderRadius: '12px',
    border: '1px solid #eee', backgroundColor: '#f9f9f9', outline: 'none', fontSize: '15px'
};

const selectStyle = {
    padding: '14px 15px', borderRadius: '12px', border: '1px solid #eee',
    backgroundColor: 'white', color: '#1C454B', fontWeight: 'bold',
    cursor: 'pointer', outline: 'none', minWidth: '170px'
};

const clearBtnStyle = {
    position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
    border: 'none', background: 'none', color: '#ccc', cursor: 'pointer', fontSize: '16px'
};

const emptyStateStyle = {
    textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', 
    borderRadius: '20px', border: '1px dashed #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'
};

const resetBtnStyle = {
    padding: '10px 20px', backgroundColor: '#1C454B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
};

export default CatalogPage;