import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';
import PlaceCard from '../components/PlaceCard';

const CatalogPage = observer(() => {
    const { placeStore, journalStore } = useContext(StoreContext);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        placeStore.fetchPlaces();
        journalStore.fetchJournal();
    }, [placeStore, journalStore]);

    if (placeStore.isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '100px', color: '#1C454B', fontWeight: 'bold' }}>Загрузка каталога...</div>;
    }

    const filteredPlaces = placeStore.places.filter(place => {
        const query = searchQuery.toLowerCase().trim();
        const name = (place.name || '').toLowerCase();
        const city = (place.city || '').toLowerCase();
        const country = (place.country || '').toLowerCase();
        return name.includes(query) || city.includes(query) || country.includes(query);
    });

    const sortedPlaces = [...filteredPlaces].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'country') return a.country.localeCompare(b.country);
        return 0;
    });

    return (
        <div style={{ paddingBottom: '50px' }}>
            <h1 style={{ color: '#1C454B', marginBottom: '30px' }}>Каталог интересных мест</h1>

            {/* ПАНЕЛЬ ИНСТРУМЕНТОВ */}
            <div style={{ 
                display: 'flex', 
                gap: '20px', 
                marginBottom: '40px', 
                flexWrap: 'wrap',
                alignItems: 'center' 
            }}>
                {/* Поиск */}
                <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
                    <input 
                        type="text"
                        placeholder="Поиск места, города или страны..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 25px',
                            borderRadius: '12px',
                            border: '1px solid #eee',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            outline: 'none',
                            fontSize: '15px'
                        }}
                    />
                </div>

                {/* Сортировка */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', padding: '6px 15px', borderRadius: '12px', border: '1px solid #eee' }}>
                    <span style={{ fontSize: '14px', color: '#888', fontWeight: '500' }}>Сортировка:</span>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '8px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontWeight: '600',
                            color: '#1C454B',
                            outline: 'none'
                        }}
                    >
                        <option value="name">По названию</option>
                        <option value="country">По странам</option>
                    </select>
                </div>
            </div>

            {/* СПИСОК МЕСТ */}
            {sortedPlaces.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '80px 20px', 
                    backgroundColor: 'white', 
                    borderRadius: '20px',
                    border: '1px dashed #ccc'
                }}>
                    <p style={{ color: '#999', fontSize: '18px' }}>По вашему запросу ничего не найдено</p>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '30px' 
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