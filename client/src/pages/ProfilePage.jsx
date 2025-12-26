import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App';
import { useNavigate } from 'react-router-dom';

const ProfilePage = observer(() => {
    const { authStore, journalStore } = useContext(StoreContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        username: authStore.user?.username || '',
        email: authStore.user?.email || ''
    });
    
    const [errors, setErrors] = useState({}); //состояние для ошибок
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        journalStore.fetchJournal();
    }, [journalStore]);

    const visitedPlaces = journalStore.journalPlaces.filter(p => p.status === 'visited').length;
    const wantToVisit = journalStore.journalPlaces.filter(p => p.status === 'want_to_visit').length;

    //валидация аналогичная LoginPage
    const validate = () => {
        const newErrors = {};
        const allowedDomains = ['@gmail.com', '@mail.ru', '@yandex.ru', '@bk.ru', '@list.ru'];
        const hasValidDomain = allowedDomains.some(domain => editData.email.toLowerCase().endsWith(domain));

        if (!editData.username.trim()) {
            newErrors.username = 'Имя не может быть пустым';
        }
        if (!editData.email) {
            newErrors.email = 'Введите почту';
        } else if (!hasValidDomain) {
            newErrors.email = 'Недопустимый домен почты';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!validate()) return; //проверка перед сохранением

        try {
            const success = await authStore.updateProfile(editData, avatarFile);
            if (success) {
                setIsEditing(false);
                setAvatarFile(null);
                setPreviewUrl(null);
                setErrors({});
            }
        } catch (err) {
            setErrors({ global: 'Ошибка при обновлении профиля' });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            username: authStore.user?.username || '',
            email: authStore.user?.email || ''
        });
        setAvatarFile(null);
        setPreviewUrl(null);
        setErrors({});
    };

    const handleLogout = () => {
            authStore.logout();
            navigate('/login');
    };

    const displayName = authStore.user?.username || authStore.user?.email || 'Пользователь';
    const userRole = authStore.user?.role?.toUpperCase() || 'USER';

    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ color: '#1C454B', marginBottom: '30px', textAlign: 'center' }}>Личный профиль</h1>

            <div style={containerStyle}>
                <div style={roleBadgeStyle(userRole)}>{userRole}</div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px' }}>
                    <div style={avatarCircleStyle}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="preview" style={imgStyle} />
                        ) : authStore.user?.avatar ? (
                            <img src={`http://localhost:5000/${authStore.user.avatar}`} alt="avatar" style={imgStyle} />
                        ) : (
                            <span style={{opacity: 0.8}}>{displayName.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    
                    {isEditing && (
                        <label style={uploadBtnStyle}>
                            {avatarFile ? "Фото выбрано ✓" : "Выбрать новое фото"}
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </label>
                    )}
                </div>

                {!isEditing ? (
                    <>
                        <h2 style={{ marginBottom: '5px', color: '#333' }}>{displayName}</h2>
                        <p style={{ color: '#888', marginBottom: '35px' }}>{authStore.user?.email}</p>
                        <button onClick={() => setIsEditing(true)} style={editBtnStyle}>
                            Редактировать профиль
                        </button>
                    </>
                ) : (
                    <div style={formContainerStyle}>
                        <p style={{fontSize: '11px', color: '#1C454B', fontWeight: 'bold', marginBottom: '10px', textAlign: 'left'}}>
                            РЕДАКТИРОВАНИЕ ДАННЫХ
                        </p>
                        
                        <input 
                            style={{...inputStyle, borderColor: errors.username ? '#d62424' : '#ddd'}} 
                            value={editData.username} 
                            onChange={e => setEditData({...editData, username: e.target.value})}
                            placeholder="Имя пользователя"
                        />
                        {errors.username && <span style={errorTextStyle}>{errors.username}</span>}

                        <input 
                            style={{...inputStyle, borderColor: errors.email ? '#d62424' : '#ddd'}} 
                            value={editData.email} 
                            onChange={e => setEditData({...editData, email: e.target.value})}
                            placeholder="Email"
                        />
                        {errors.email && <span style={errorTextStyle}>{errors.email}</span>}

                        {errors.global && <span style={{...errorTextStyle, textAlign: 'center'}}>{errors.global}</span>}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={handleSave} style={saveBtnStyle}>Сохранить</button>
                            <button onClick={handleCancel} style={cancelBtnStyle}>Отмена</button>
                        </div>
                    </div>
                )}

                <div style={statsRowStyle}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{visitedPlaces}</div>
                        <div style={statLabelStyle}>Посещено мест</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{wantToVisit}</div>
                        <div style={statLabelStyle}>В планах</div>
                    </div>
                </div>

                <div style={footerStyle}>
                    <button onClick={() => navigate('/journal')} style={mainBtnStyle}>Открыть журнал</button>
                    <button onClick={handleLogout} style={logoutBtnStyle}>Выйти</button>
                </div>
            </div>
        </div>
    );
});

//стили
const containerStyle = { 
    backgroundColor: 'white', padding: '40px', borderRadius: '24px', 
    boxShadow: '0 10px 40px rgba(0,0,0,0.05)', textAlign: 'center', 
    border: '1px solid #f0f0f0', position: 'relative' 
};

const errorTextStyle = {
    color: '#d62424',
    fontSize: '11px',
    textAlign: 'left',
    marginTop: '-8px',
    marginBottom: '5px',
    marginLeft: '5px',
    fontWeight: '500'
};

const roleBadgeStyle = (role) => ({
    position: 'absolute', top: '20px', right: '20px',
    backgroundColor: role === 'ADMIN' ? '#8B2E2E' : '#f0f0f0',
    color: role === 'ADMIN' ? 'white' : '#666',
    padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px'
});

const avatarCircleStyle = { 
    width: '130px', height: '130px', backgroundColor: '#1C454B', color: 'white', 
    borderRadius: '50%', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', fontSize: '52px', fontWeight: 'bold', 
    overflow: 'hidden', border: '5px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    marginBottom: '15px'
};

const uploadBtnStyle = {
    backgroundColor: '#f8f9fa', color: '#1C454B', padding: '8px 16px',
    borderRadius: '10px', fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', border: '1px solid #1C454B', display: 'inline-block',
    transition: 'all 0.2s ease'
};

const formContainerStyle = { 
    display: 'flex', flexDirection: 'column', gap: '12px', 
    maxWidth: '340px', margin: '0 auto 35px', padding: '20px',
    backgroundColor: '#f9fbfb', borderRadius: '15px'
};

const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' };
const statsRowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px', marginTop: '20px' };
const statCardStyle = { padding: '20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' };
const statValueStyle = { fontSize: '28px', fontWeight: '800', color: '#1C454B' };
const statLabelStyle = { fontSize: '11px', color: '#999', textTransform: 'uppercase', marginTop: '4px' };
const editBtnStyle = { backgroundColor: '#f0f4f4', border: 'none', color: '#1C454B', padding: '10px 25px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' };
const saveBtnStyle = { backgroundColor: '#1C454B', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', flex: 2 };
const cancelBtnStyle = { backgroundColor: '#ddd', color: '#333', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', flex: 1 };
const mainBtnStyle = { padding: '14px 28px', backgroundColor: '#1C454B', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' };
const logoutBtnStyle = { padding: '14px 28px', backgroundColor: 'white', color: '#8B2E2E', border: '1px solid #F4D0D0', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' };
const footerStyle = { borderTop: '1px solid #eee', paddingTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' };

export default ProfilePage;