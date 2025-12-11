import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect, useContext, createContext } from 'react';

//импорт хранилища и страниц
import AuthStore from './stores/AuthStore';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import JournalPage from './pages/JournalPage';
import CatalogPage from './pages/CatalogPage';


//контекст для доступа к хранилищу
export const StoreContext = createContext(AuthStore);

const App = observer(() => {
    const store = useContext(StoreContext);

    useEffect(() => {
        store.checkAuth();
    }, [store]);

    if (store.isLoading) {
        return <div style={{padding: '20px', fontSize: '24px'}}>Загрузка...</div>;
    }

    return (
        <BrowserRouter>
            <div className="App">
                <header>
                    <nav style={{ padding: '10px', backgroundColor: '#eee', display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <Link to="/">Каталог</Link>
                        {store.isAuth && <Link to="/journal">Мой Журнал</Link>}
                        
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {store.isAuth 
                                ? (
                                    <>
                                        <span>Привет, {store.user.username || store.user.email}! (Роль: {store.user.role})</span>
                                        <button onClick={() => store.logout()}>Выйти</button>
                                    </>
                                )
                                : (
                                    <>
                                        <Link to="/login">Вход</Link>
                                        <Link to="/registration">Регистрация</Link>
                                    </>
                                )
                            }
                        </div>
                    </nav>
                </header>

                <main style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<CatalogPage />} /> 

                        {/* Защищенные маршруты (Journal доступен только авторизованным) */}
                        {store.isAuth && <Route path="/journal" element={<JournalPage />} />}

                        {/* Маршруты для неавторизованных (Login/Registration) */}
                        {!store.isAuth && <Route path="/login" element={<LoginPage />} />}
                        {!store.isAuth && <Route path="/registration" element={<RegistrationPage />} />}

                        {/* Редиректы для удобства пользователя */}
                        {/* Неавторизованный -> пытается попасть в журнал -> на страницу входа */}
                        {!store.isAuth && <Route path="/journal" element={<Navigate to="/login" replace />} />}
                        {/* Авторизованный -> пытается попасть на вход/регистрацию -> на главную */}
                        {store.isAuth && <Route path="/login" element={<Navigate to="/" replace />} />}
                        {store.isAuth && <Route path="/registration" element={<Navigate to="/" replace />} />}
                        
                        <Route path="*" element={<h1>404: Страница не найдена</h1>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
});

export default App;