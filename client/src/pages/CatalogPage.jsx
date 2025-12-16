import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';
import PlaceCard from '../components/PlaceCard';

const CatalogPage = observer(() => {
    const { placeStore, journalStore } = useContext(StoreContext);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name'); //состояние для сортировки

    useEffect(() => {
        placeStore.fetchPlaces();
        journalStore.fetchJournal();
    }, [placeStore, journalStore]);

    if (placeStore.isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка каталога...</div>;
    }

    //фильтрация по поиску
    const filteredPlaces = placeStore.places.filter(place => {
        const query = searchQuery.toLowerCase().trim();
        const name = (place.name || '').toLowerCase();
        const city = (place.city || '').toLowerCase();
        const country = (place.country || '').toLowerCase();
        return name.includes(query) || city.includes(query) || country.includes(query);
    });

    //сортировка отфильтрованного списка
    const sortedPlaces = [...filteredPlaces].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        if (sortBy === 'country') {
            return a.country.localeCompare(b.country);
        }
        return 0;
    });

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Каталог интересных мест</h1>

            {/* ПАНЕЛЬ ИНСТРУМЕНТОВ */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginBottom: '30px', 
                flexWrap: 'wrap',
                alignItems: 'center' 
            }}>
                {/* Поиск */}
                <input 
                    type="text"
                    placeholder="Поиск по названию, городу или стране..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        flex: '1',
                        minWidth: '250px',
                        padding: '12px 20px',
                        borderRadius: '25px',
                        border: '1px solid #ccc',
                        outline: 'none'
                    }}
                />

                {/* Сортировка */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Сортировать:</span>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="name">По названию</option>
                        <option value="country">По странам</option>
                    </select>
                </div>
            </div>

            {/* --- СПИСОК МЕСТ --- */}
            {sortedPlaces.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p style={{ color: '#666' }}>Ничего не найдено.</p>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '25px' 
                }}>
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

export default CatalogPage;