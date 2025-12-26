import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';

const PlaceCard = observer(({ place, journalStore }) => {
    const { authStore, placeStore } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Состояния для редактирования текста
    const [editData, setEditData] = useState({
        name: place.name,
        city: place.city,
        country: place.country,
        description: place.description || ''
    });

    // Состояния для новой фотографии
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const statusInfo = journalStore ? journalStore.getPlaceStatus(place.id) : null;
    const API_URL = 'http://localhost:5000/';

    // Синхронизация данных при открытии редактирования
    useEffect(() => {
        if (isEditing) {
            setEditData({
                name: place.name,
                city: place.city,
                country: place.country,
                description: place.description || ''
            });
        }
    }, [isEditing, place]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

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
        
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        
        const success = await placeStore.updatePlace(place.id, formData);
        if (success) {
            setIsEditing(false);
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const closeOverlay = () => {
        setIsOpen(false);
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);
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
                style={cardStyle}
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
                        onError={(e) => { e.target.src = API_URL + 'default-place.webp'; }}
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
                            style={adminBtnStyle('#1C454B', 'white')}
                        >
                            РЕДАКТИРОВАТЬ
                        </button>
                        <button 
                            onClick={handleDeleteFromDB}
                            style={adminBtnStyle('white', '#e02124', '1px solid #eee')}
                        >
                            УДАЛИТЬ
                        </button>
                    </div>
                )}
            </div>

            {isOpen && (
                <div onClick={closeOverlay} style={overlayStyle}>
                    <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
                        
                        {/* ЛЕВАЯ ЧАСТЬ: ФОТО */}
                        <div style={{ width: '45%', backgroundColor: '#f0f0f0', position: 'relative' }}>
                            <img 
                                src={previewUrl ? previewUrl : (API_URL + place.image_url)} 
                                alt="" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            {isEditing && (
                                <label style={changePhotoOverlayStyle}>
                                    ИЗМЕНИТЬ ФОТО
                                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>

                        {/* ПРАВАЯ ЧАСТЬ: КОНТЕНТ */}
                        <div style={{ width: '55%', padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <button onClick={closeOverlay} style={closeBtnStyle}>✕</button>

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
                                    <button onClick={handleAdd} disabled={!!statusInfo} style={statusBtnStyle(currentStatus)}>
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
                                    
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={handleUpdate} style={saveBtnStyle}>СОХРАНИТЬ</button>
                                        <button onClick={() => { setIsEditing(false); setPreviewUrl(null); }} style={cancelBtnStyle}>ОТМЕНА</button>
                                    </div>
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

//стили
const cardStyle = { padding: '20px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #eee', cursor: 'pointer', transition: '0.2s', display: 'flex', flexDirection: 'column', gap: '12px' };
const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const modalStyle = { backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '850px', display: 'flex', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '85vh' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' };
const closeBtnStyle = { position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', color: '#ddd' };
const changePhotoOverlayStyle = { position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(28, 69, 75, 0.9)', color: 'white', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' };
const adminBtnStyle = (bg, color, border = 'none') => ({ flex: 1, padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', backgroundColor: bg, color: color, border: border });
const statusBtnStyle = (status) => ({ width: '100%', padding: '16px', backgroundColor: status.color, color: status.textColor, border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', cursor: 'pointer' });
const saveBtnStyle = { flex: 2, padding: '15px', backgroundColor: '#1C454B', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const cancelBtnStyle = { flex: 1, padding: '15px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default PlaceCard;