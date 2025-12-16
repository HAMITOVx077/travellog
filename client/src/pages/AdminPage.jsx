import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';

const AdminPage = observer(() => {
    const { placeStore } = useContext(StoreContext);
    const [formData, setFormData] = useState({
        name: '', city: '', country: '', description: ''
    });
    //отдельное состояние для файла
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); //берем первый выбранный файл
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        //для отправки файлов используем FormData вместо обычного JSON
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
            //сбрасываем поле выбора файла визуально
            e.target.reset();
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1>🛠 Панель администратора</h1>
            
            <section style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0 }}>Добавить новое место (с загрузкой фото)</h3>
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

                    {/* ПОЛЕ ДЛЯ ВЫБОРА ФАЙЛА */}
                    <div style={{ border: '1px dashed #ccc', padding: '10px', borderRadius: '6px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Загрузить фото места:</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                    </div>

                    <button type="submit" style={btnStyle}>Сохранить в базу</button>
                </form>
            </section>
        </div>
    );
});

const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' };
const btnStyle = { padding: '12px', backgroundColor: '#1C454B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default AdminPage;