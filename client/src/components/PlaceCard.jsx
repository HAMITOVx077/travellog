import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';

const PlaceCard = observer(({ place, journalStore }) => {
    const { authStore, placeStore } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);
    const statusInfo = journalStore ? journalStore.getPlaceStatus(place.id) : null;
    const API_URL = 'http://localhost:5000/'; 

    const handleAdd = (e) => {
        e.stopPropagation();
        if (!authStore.isAuth) return alert("Войдите в систему");
        if (journalStore) journalStore.addPlace(place.id);
    };

    const handleDeleteFromDB = async (e) => {
        e.stopPropagation();
        if (window.confirm(`Вы уверены, что хотите НАВСЕГДА удалить "${place.name}" из базы данных?`)) {
            await placeStore.deletePlace(place.id);
            setIsOpen(false);
        }
    };

    // ТВОИ ИСХОДНЫЕ ЦВЕТА
    const currentStatus = (() => {
        if (!statusInfo) return { label: 'ХОЧУ ПОСЕТИТЬ', color: 'var(--color-accent)', textColor: 'var(--color-primary)' };
        if (statusInfo.status === 'visited') return { label: 'ПОСЕЩЕНО', color: '#D4EDDA', textColor: '#155724' };
        return { label: 'В ПЛАНАХ', color: '#FFF3CD', textColor: '#856404' };
    })();

    return (
        <>
            {/* КАРТОЧКА В КАТАЛОГЕ */}
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
                        src={API_URL + place.image_url} 
                        alt={place.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </div>

                <div style={{ 
                    marginTop: 'auto', textAlign: 'center', padding: '10px', 
                    backgroundColor: currentStatus.color, color: currentStatus.textColor, 
                    borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                    {currentStatus.label}
                </div>

                {/* ИСПРАВЛЕННАЯ ПРОВЕРКА РОЛИ (admin в нижнем регистре) */}
                {authStore.user?.role === 'admin' && (
                    <button 
                        onClick={handleDeleteFromDB}
                        style={{
                            marginTop: '10px',
                            padding: '10px',
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            transition: '0.3s'
                        }}
                    >
                        Удалить место из БД
                    </button>
                )}
            </div>

            {/* МОДАЛЬНОЕ ОКНО */}
            {isOpen && (
                <div 
                    onClick={() => setIsOpen(false)} 
                    style={{ 
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                        backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ 
                            backgroundColor: 'white', borderRadius: '16px', width: '100%', 
                            maxWidth: '850px', display: 'flex', overflow: 'hidden', 
                            boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '85vh' 
                        }}
                    >
                        {/* ЛЕВАЯ ЧАСТЬ (ФОТО) */}
                        <div style={{ width: '45%', backgroundColor: '#f0f0f0' }}>
                            <img 
                                src={API_URL + place.image_url} 
                                alt={place.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        </div>

                        {/* ПРАВАЯ ЧАСТЬ (ИНФО) */}
                        <div style={{ 
                            width: '55%', padding: '40px', display: 'flex', 
                            flexDirection: 'column', position: 'relative' 
                        }}>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                style={{ 
                                    position: 'absolute', top: '20px', right: '20px', 
                                    border: 'none', background: 'none', fontSize: '22px', 
                                    cursor: 'pointer', color: '#ddd' 
                                }} 
                            >✕</button>

                            <div style={{ marginBottom: '20px' }}>
                                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.85rem', color: 'var(--color-primary)', lineHeight: '1.2' }}>{place.name}</h2>
                                <p style={{ margin: 0, color: '#888', fontSize: '15px', fontWeight: '500' }}>{place.city}, {place.country}</p>
                            </div>
                            
                            <div style={{ 
                                flexGrow: 1, 
                                overflowY: 'auto', 
                                paddingRight: '15px' 
                            }}>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '16px', 
                                    lineHeight: '1.7', 
                                    color: '#444',
                                    whiteSpace: 'pre-line' 
                                }}>
                                    {place.description || "У этого места пока нет описания."}
                                </p>
                            </div>

                            <button 
                                onClick={handleAdd} 
                                disabled={!!statusInfo}
                                style={{ 
                                    marginTop: '30px', width: '100%', padding: '16px', 
                                    backgroundColor: currentStatus.color, color: currentStatus.textColor, 
                                    border: 'none', borderRadius: '8px', fontWeight: 'bold', 
                                    fontSize: '13px', textTransform: 'uppercase',
                                    cursor: statusInfo ? 'default' : 'pointer'
                                }}
                            >
                                {currentStatus.label}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`.card-hover:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }`}</style>
        </>
    );
});

export default PlaceCard;