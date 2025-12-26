import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';

const PlaceCard = observer(({ place, journalStore }) => {
    const { authStore, placeStore } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [editData, setEditData] = useState({
        name: place.name,
        city: place.city,
        country: place.country,
        description: place.description || ''
    });

    const statusInfo = journalStore ? journalStore.getPlaceStatus(place.id) : null;
    const API_URL = 'http://localhost:5000/';

    const handleAdd = (e) => {
        e.stopPropagation();
        if (!authStore.isAuth) return alert("Войдите в систему");
        if (journalStore) journalStore.addPlace(place.id);
    };

    const handleDeleteFromDB = async (e) => {
        e.stopPropagation();
        if (window.confirm(`Вы уверены, что хотите НАВСЕГДА удалить "${place.name}"?`)) {
            await placeStore.deletePlace(place.id);
            setIsOpen(false);
        }
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('name', editData.name);
        formData.append('city', editData.city);
        formData.append('country', editData.country);
        formData.append('description', editData.description);
        
        const success = await placeStore.updatePlace(place.id, formData);
        if (success) setIsEditing(false);
    };

    const currentStatus = (() => {
        if (!statusInfo) return { label: 'ХОЧУ ПОСЕТИТЬ', color: 'var(--color-accent)', textColor: 'var(--color-primary)' };
        if (statusInfo.status === 'visited') return { label: 'ПОСЕЩЕНО', color: '#D4EDDA', textColor: '#155724' };
        return { label: 'В ПЛАНАХ', color: '#FFF3CD', textColor: '#856404' };
    })();

    return (
        <>
            <div 
                onClick={() => setIsOpen(true)} 
                className="card-hover" 
                style={{ 
                    padding: '20px', borderRadius: '12px', backgroundColor: 'white', 
                    border: '1px solid #eee', cursor: 'pointer', transition: '0.2s', 
                    display: 'flex', flexDirection: 'column', gap: '12px' 
                }}
            >
                <div>
                    <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.2rem' }}>{place.name}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#999' }}>{place.city}, {place.country}</p>
                </div>

              
<div style={{ height: '220px', borderRadius: '8px', overflow: 'hidden' }}>
    <img 
        src={place.image_url ? (API_URL + place.image_url) : (API_URL + 'default-place.webp')} 
        alt={place.name} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        onError={(e) => { e.target.src = API_URL + 'default-place.webp'; }} // Резервный вариант
    />
</div>

                <div style={{ 
                    backgroundColor: currentStatus.color, color: currentStatus.textColor, 
                    padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center'
                }}>
                    {currentStatus.label}
                </div>

                {authStore.user?.role === 'admin' && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsOpen(true); setIsEditing(true); }}
                            style={{ 
                                flex: 3, padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer',
                                backgroundColor: '#1C454B', color: 'white', border: 'none'
                            }}
                        >
                            РЕДАКТИРОВАТЬ
                        </button>
                        <button 
                            onClick={handleDeleteFromDB}
                            style={{ 
                                flex: 2, padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer',
                                backgroundColor: 'white', color: '#e02124', border: '1px solid #eee'
                            }}
                        >
                            УДАЛИТЬ
                        </button>
                    </div>
                )}
            </div>

            {isOpen && (
                <div onClick={() => { setIsOpen(false); setIsEditing(false); }} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '850px', display: 'flex', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '85vh' }}>
                        
                        <div style={{ width: '45%', backgroundColor: '#f0f0f0' }}>
                            <img src={API_URL + place.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div style={{ width: '55%', padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <button onClick={() => { setIsOpen(false); setIsEditing(false); }} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', color: '#ddd' }}>✕</button>

                            {!isEditing ? (
                                <>
                                    <div style={{ marginBottom: '25px' }}>
                                        <h2 style={{ margin: 0, fontSize: '1.85rem', color: 'var(--color-primary)', lineHeight: '1.2' }}>{place.name}</h2>
                                        <p style={{ margin: '8px 0 0', color: '#888', fontSize: '15px' }}>{place.city}, {place.country}</p>
                                    </div>
                                    <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px', marginBottom: '20px' }}>
                                        <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.7', color: '#444', whiteSpace: 'pre-line' }}>
                                            {place.description || "У этого места пока нет описания."}
                                        </p>
                                    </div>
                                    <button onClick={handleAdd} disabled={!!statusInfo} style={{ width: '100%', padding: '16px', backgroundColor: currentStatus.color, color: currentStatus.textColor, border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', cursor: 'pointer' }}>
                                        {currentStatus.label}
                                    </button>
                                </>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                                    <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Редактирование</h2>
                                    <input style={inputStyle} value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} placeholder="Название" />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input style={inputStyle} value={editData.city} onChange={e => setEditData({...editData, city: e.target.value})} placeholder="Город" />
                                        <input style={inputStyle} value={editData.country} onChange={e => setEditData({...editData, country: e.target.value})} placeholder="Страна" />
                                    </div>
                                    <textarea style={{ ...inputStyle, height: '150px', resize: 'none' }} value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} placeholder="Описание" />
                                    <button onClick={handleUpdate} style={{ padding: '15px', backgroundColor: '#1C454B', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        СОХРАНИТЬ ИЗМЕНЕНИЯ
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <style>{`.card-hover:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }`}</style>
        </>
    );
});

const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' };

export default PlaceCard;