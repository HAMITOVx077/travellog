import React from 'react';

/**
 * Компонент страницы с информацией о курсовом проекте.
 */
const AboutPage = () => {
    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ color: '#1C454B', marginBottom: '20px' }}>О проекте</h1>
            
            <section style={{ 
                backgroundColor: 'white', 
                padding: '30px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                lineHeight: '1.6'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ margin: 0 }}>
                        <strong style={{ color: '#1C454B' }}>Тема:</strong> Система учета путешествий "TravelLog"
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong style={{ color: '#1C454B' }}>Разработчик:</strong> Хамитов А. И.
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong style={{ color: '#1C454B' }}>Группа:</strong> 4пк2
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong style={{ color: '#1C454B' }}>Стек:</strong> PostgreSQL, Express.js, React, Node.js
                    </p>
                    
                    <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />
                    
                    <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
                        Приложение разработано в качестве курсового проекта. 
                        Оно позволяет пользователям планировать поездки, вести журнал посещенных мест 
                        с оценками и личными отзывами, а администратору — удобно управлять общим каталогом через панель управления.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;