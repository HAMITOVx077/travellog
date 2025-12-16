import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';

const PlaceCard = observer(({ place, journalStore }) => {
    const { authStore } = useContext(StoreContext);
    const statusInfo = journalStore.getPlaceStatus(place.id);
    
    //ссылка на корень твоего бэкенда для картинок
    const API_URL = 'http://localhost:5000/'; 

    const handleAdd = async () => {
        if (authStore.isAuth) {
            await journalStore.addPlace(place.id);
        } else {
            alert("Войдите в систему");
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px', backgroundColor: 'white' }}>
            <div style={{ height: '180px', backgroundColor: '#eee', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {place.image_url ? (
                    <img 
                        src={API_URL + place.image_url} 
                        alt={place.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                ) : <span style={{color: '#999'}}>Нет фото</span>}
            </div>
            <h3>{place.name}</h3>
            <p style={{fontSize: '14px', color: '#666'}}>{place.city}, {place.country}</p>
            
            {authStore.isAuth ? (
                statusInfo ? (
                    <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#e2e3e5', borderRadius: '5px' }}>
                        {statusInfo.status === 'visited' ? 'Посещено' : 'В планах'}
                    </div>
                ) : (
                    <button onClick={handleAdd} style={{ width: '100%', padding: '10px', backgroundColor: '#F4D0D0', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Хочу посетить
                    </button>
                )
            ) : null}
        </div>
    );
});

export default PlaceCard;