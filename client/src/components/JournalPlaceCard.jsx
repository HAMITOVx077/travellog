import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

const JournalPlaceCard = observer(({ entry, journalStore }) => {
    const place = entry.Place || {};
    const API_URL = 'http://localhost:5000/'; 
    
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(entry.rating || 5);
    const [review, setReview] = useState(entry.user_review || '');
    
    //инициализируем дату только если она есть в базе, иначе пустая строка для инпута
    const [visitedDate, setVisitedDate] = useState(
        entry.visited_date ? entry.visited_date.split('T')[0] : ''
    );

    const isVisited = entry.status === 'visited';

    const handleRemove = (e) => {
        e.stopPropagation();
        if (window.confirm(`Удалить ${place.name} из журнала?`)) {
            journalStore.removePlace(entry.id);
        }
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        //если дата не выбрана, можно либо оставить null, либо текущую
        const finalDate = visitedDate || new Date().toISOString().split('T')[0];
        
        const success = await journalStore.updateStatus(entry.id, {
            status: 'visited',
            rating: Number(rating),
            user_review: review,
            visited_date: finalDate 
        });
        if (success) setIsEditing(false);
    };

    return (
        <>
            {/* КАРТОЧКА В СПИСКЕ ЖУРНАЛА */}
            <div 
                onClick={() => setIsOpen(true)}
                className="card-hover" 
                style={{ 
                    backgroundColor: 'white', border: '1px solid #eee', borderRadius: '12px',
                    padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', transition: '0.2s',
                    cursor: 'pointer'
                }}
            >
                <div>
                    <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.2rem' }}>{place.name}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#999' }}>{place.city}, {place.country}</p>
                </div>

                <div style={{ height: '220px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                    <img src={API_URL + place.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ 
                        backgroundColor: isVisited ? '#D4EDDA' : '#FFF3CD', 
                        color: isVisited ? '#155724' : '#856404',
                        padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center'
                    }}>
                        {isVisited ? 'ПОСЕЩЕНО' : 'В ПЛАНАХ'}
                    </div>

                    {isVisited && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '5px' }}>
                            <div style={{ fontSize: '15px', color: 'var(--color-primary)', fontWeight: '700' }}>
                                Оценка: {entry.rating} из 5
                            </div>
                            {/* ПРОВЕРКА ДАТЫ: выводим только если она есть и не дефолтная */}
                            {entry.visited_date && entry.visited_date !== '0001-01-01T00:00:00.000Z' && (
                                <div style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>
                                    {new Date(entry.visited_date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsOpen(true); setIsEditing(true); }} 
                        style={{ 
                            flex: 3, padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer',
                            backgroundColor: isVisited ? '#f8f9fa' : 'var(--color-primary)',
                            color: isVisited ? 'var(--color-primary)' : 'white',
                            border: isVisited ? '1px solid #eee' : 'none'
                        }}
                    >
                        {isVisited ? 'ИЗМЕНИТЬ' : 'ОТМЕТИТЬ'}
                    </button>
                    <button 
                        onClick={handleRemove} 
                        style={{ 
                            flex: 2, padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer',
                            backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid #eee'
                        }}
                    >
                        УДАЛИТЬ
                    </button>
                </div>
            </div>

            {/* МОДАЛКА С ОТЗЫВОМ */}
            {isOpen && (
                <div onClick={() => { setIsOpen(false); setIsEditing(false); }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '850px', display: 'flex', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '85vh' }}>
                        
                        <div style={{ width: '45%', backgroundColor: '#f0f0f0' }}>
                            <img src={API_URL + place.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div style={{ width: '55%', padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <button onClick={() => { setIsOpen(false); setIsEditing(false); }} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', color: '#ddd' }}>✕</button>

                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                                    <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Редактирование</h2>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#aaa' }}>ОЦЕНКА</label>
                                            <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: '100%', padding: '10px' }}>
                                                {[5,4,3,2,1].map(num => <option key={num} value={num}>{num}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#aaa' }}>ДАТА</label>
                                            <input type="date" value={visitedDate} onChange={(e) => setVisitedDate(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                                        </div>
                                    </div>
                                    <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Ваш отзыв..." style={{ height: '150px', padding: '12px', fontSize: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <button onClick={handleSave} style={{ padding: '15px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>СОХРАНИТЬ ИЗМЕНЕНИЯ</button>
                                </div>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '25px' }}>
                                        <h2 style={{ margin: 0, fontSize: '1.85rem', color: 'var(--color-primary)', lineHeight: '1.2' }}>{place.name}</h2>
                                        <p style={{ margin: '8px 0 0', color: '#888', fontSize: '15px' }}>{place.city}, {place.country}</p>
                                    </div>
                                    
                                    <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)' }}>Оценка: {entry.rating} / 5</span>
                                            {/* ПРОВЕРКА ДАТЫ В МОДАЛКЕ */}
                                            {entry.visited_date && entry.visited_date !== '0001-01-01T00:00:00.000Z' && (
                                                <p style={{ margin: '5px 0', color: '#999', fontSize: '14px' }}>Дата посещения: {new Date(entry.visited_date).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                        <h4 style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>Ваш отзыв</h4>
                                        <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.7', color: '#444' }}>
                                            {entry.user_review || "Вы пока не оставили отзыв об этом месте."}
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        style={{ marginTop: '30px', width: '100%', padding: '16px', backgroundColor: '#f8f9fa', color: 'var(--color-primary)', border: '1px solid #eee', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                                    >
                                        РЕДАКТИРОВАТЬ ЗАПИСЬ
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .card-hover:hover { 
                    transform: translateY(-6px); 
                    box-shadow: 0 12px 24px rgba(0,0,0,0.1); 
                }
            `}</style>
        </>
    );
});

export default JournalPlaceCard;