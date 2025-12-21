import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';

const AdminPage = observer(() => {
    const { placeStore } = useContext(StoreContext);
    const [formData, setFormData] = useState({
        name: '', city: '', country: '', description: ''
    });
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('city', formData.city);
        data.append('country', formData.country);
        data.append('description', formData.description);
        if (file) {
            data.append('image', file);
        }

        const success = await placeStore.createPlace(data);
        if (success) {
            alert("Место успешно добавлено!");
            setFormData({ name: '', city: '', country: '', description: '' });
            setFile(null);
            e.target.reset();
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
            {/* Убрал смайлик и добавил отступ снизу */}
            <h1 style={{ color: '#1C454B', marginBottom: '30px' }}>Панель администратора</h1>
            
            <section style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                {/* Упростил надпись */}
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Добавить новое место</h3>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        placeholder="Название" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                        style={inputStyle}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input placeholder="Город" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required style={{...inputStyle, flex: 1}} />
                        <input placeholder="Страна" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} required style={{...inputStyle, flex: 1}} />
                    </div>
                    
                    <textarea placeholder="Описание" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '80px', resize: 'none'}} />

                    <div style={{ border: '1px dashed #ccc', padding: '10px', borderRadius: '6px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Загрузить фото места:</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                    </div>

                    <button type="submit" style={btnStyle} className="admin-btn">Сохранить в базу</button>
                </form>
            </section>

            <style>{`
                .admin-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .admin-btn:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
});

const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #eee', backgroundColor: '#f9f9f9', fontSize: '14px' };
const btnStyle = { padding: '14px', backgroundColor: '#1C454B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' };

export default AdminPage;