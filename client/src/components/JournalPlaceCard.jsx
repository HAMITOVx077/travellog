import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

const JournalPlaceCard = observer(({ entry, journalStore }) => {
    const place = entry.Place || {};
    
    //URL бэкенда для загрузки картинок из папки static
    const API_URL = 'http://localhost:5000/'; 
    
    const [isEditing, setIsEditing] = useState(false);
    
    //cостояния для полей формы
    const [rating, setRating] = useState(entry.rating || 5);
    const [review, setReview] = useState(entry.user_review || '');
    const [visitedDate, setVisitedDate] = useState(
        entry.visited_date ? entry.visited_date.split('T')[0] : new Date().toISOString().split('T')[0]
    );

    const isVisited = entry.status === 'visited';
    const statusText = isVisited ? 'Статус: Посещено' : 'Статус: Хочу посетить';
    const statusColor = isVisited ? '#d4edda' : '#fff3cd';

    const handleRemove = () => {
        if (window.confirm(`Вы уверены, что хотите удалить ${place.name} из журнала?`)) {
            journalStore.removePlace(entry.id);
        }
    };

    const handleSave = async () => {
        const success = await journalStore.updateStatus(entry.id, {
            status: 'visited',
            rating: Number(rating),
            user_review: review,
            visited_date: visitedDate 
        });
        if (success) setIsEditing(false);
    };

    return (
        <div style={{ 
            border: '1px solid #ccc', padding: '20px', borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', display: 'flex',
            flexDirection: 'column', justifyContent: 'space-between',
            backgroundColor: 'white'
        }}>
            <div>
                <h3>{place.name}</h3>
                <p style={{ opacity: 0.7, margin: '5px 0 15px', fontSize: '14px' }}>{place.city}, {place.country}</p>
                
                {/* обновленный блок фото */}
                <div style={{ 
                    height: '180px', 
                    backgroundColor: '#eee', 
                    borderRadius: '6px', 
                    margin: '0 0 15px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'hidden',
                    border: '1px solid #eee'
                }}>
                    {place.image_url ? (
                        <img 
                            src={API_URL + place.image_url} 
                            alt={place.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    ) : (
                        <span style={{ color: '#999' }}>Нет фото</span>
                    )}
                </div>

                {isEditing ? (
                    <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Оценка (1-5):</label>
                        <select 
                            value={rating} 
                            onChange={(e) => setRating(e.target.value)}
                            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                        >
                            {[1,2,3,4,5].map(num => <option key={num} value={num}>{num}</option>)}
                        </select>

                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Дата посещения:</label>
                        <input 
                            type="date"
                            value={visitedDate}
                            onChange={(e) => setVisitedDate(e.target.value)}
                            style={{ width: '100%', marginBottom: '10px', padding: '5px', boxSizing: 'border-box' }}
                        />

                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ваш отзыв:</label>
                        <textarea 
                            value={review} 
                            onChange={(e) => setReview(e.target.value)}
                            style={{ width: '100%', height: '60px', marginBottom: '10px', padding: '5px', boxSizing: 'border-box', resize: 'none' }}
                            placeholder="Как вам это место?"
                        />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleSave} style={{ flex: 1, padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Сохранить</button>
                            <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Отмена</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ 
                            backgroundColor: statusColor, padding: '10px', borderRadius: '4px', marginBottom: '15px', 
                            border: `1px solid ${isVisited ? '#28a745' : '#ffc107'}`, 
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between' 
                        }}>
                            <span style={{ fontWeight: 'bold' }}>{statusText}</span>
                            {isVisited && entry.rating && (
                                <span style={{ backgroundColor: '#17a2b8', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                    Оценка: {entry.rating}/5
                                </span>
                            )}
                        </div>

                        {isVisited && (
                            <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
                                <div style={{ marginBottom: '5px', color: '#666' }}>
                                    <strong>Дата:</strong> {entry.visited_date ? new Date(entry.visited_date).toLocaleDateString() : 'Не указана'}
                                </div>
                                {entry.user_review && (
                                    <>
                                        <strong>Мой отзыв:</strong>
                                        <p style={{ margin: '5px 0 0 0', fontStyle: 'italic' }}>"{entry.user_review}"</p>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {!isEditing && (
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button 
                        onClick={() => setIsEditing(true)}
                        style={{ 
                            flexGrow: 1, padding: '10px', 
                            backgroundColor: isVisited ? '#17a2b8' : '#F4D0D0', 
                            color: isVisited ? 'white' : '#1C454B', 
                            border: 'none', borderRadius: '4px', cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {isVisited ? 'Изменить отзыв' : 'Отметить как посещенное'}
                    </button>
                    <button 
                        onClick={handleRemove}
                        style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        🗑
                    </button>
                </div>
            )}
        </div>
    );
});

export default JournalPlaceCard;