import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            backgroundColor: '#1C454B',
            color: 'white',
            padding: '40px 20px 20px',
            marginTop: 'auto', // Чтобы футер прижимался к низу
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px',
                paddingBottom: '30px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Блок о проекте */}
                <div>
                    <h3 style={{ color: 'White', marginBottom: '15px' }}>TravelLog</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc' }}>
                        Ваш личный цифровой журнал путешествий. Храните воспоминания о посещенных местах и планируйте новые открытия вместе с нами.
                    </p>
                </div>

                {/* Быстрые ссылки */}
                <div>
                    <h4 style={{ marginBottom: '15px' }}>Навигация</h4>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Каталог мест</Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/about" style={{ color: '#ccc', textDecoration: 'none' }}>О проекте</Link>
                        </li>
                    </ul>
                </div>

                {/* Контакты */}
                <div>
                    <h4 style={{ marginBottom: '15px' }}>Контакты</h4>
                    <p style={{ fontSize: '14px', color: '#ccc', margin: '5px 0' }}>Email: travellog@gmail.com</p>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                        {/* Здесь можно добавить иконки соцсетей */}
                        <span style={{ cursor: 'pointer', color: '#ccc' }}>Telegram</span>
                        <span style={{ cursor: 'pointer', color: '#ccc' }}>VK</span>
                    </div>
                </div>
            </div>

            {/* Копирайт */}
            <div style={{
                maxWidth: '1200px',
                margin: '20px auto 0',
                textAlign: 'center',
                fontSize: '12px',
                color: '#888'
            }}>
                © {currentYear} TravelLog Project. Все права защищены.
            </div>
        </footer>
    );
};

export default Footer;