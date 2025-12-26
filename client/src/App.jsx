import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect, useContext, createContext } from 'react';

import AuthStore from './stores/AuthStore';
import PlaceStore from './stores/PlaceStore';
import JournalStore from './stores/JournalStore'; 

import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import JournalPage from './pages/JournalPage';
import CatalogPage from './pages/CatalogPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage'; 
import NavBar from './components/NavBar';
import Footer from './components/Footer'; //импортируем футер


export const StoreContext = createContext({
    authStore: AuthStore,
    placeStore: PlaceStore,
    journalStore: JournalStore,
});

const App = observer(() => {
    const { authStore, journalStore } = useContext(StoreContext); 

    useEffect(() => {
        if (localStorage.getItem('token')) {
            authStore.checkAuth().then(() => {
                if (authStore.isAuth) {
                    journalStore.fetchJournal();
                }
            });
        } else {
            authStore.setLoading(false); 
        }
    }, [authStore, journalStore]);

    if (authStore.isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>
                Загрузка приложения...
            </div>
        );
    }

    return (
        <BrowserRouter>
            {/* 2. Добавляем стили Flexbox, чтобы футер "прилипал" к низу */}
            <div className="App" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh', 
                fontFamily: 'sans-serif', 
                backgroundColor: '#f4f7f6' 
            }}>
                <NavBar />

                {/* 3. Добавляем flex: 1 для main */}
                <main style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<CatalogPage />} /> 
                        <Route path="/about" element={<AboutPage />} />

                        <Route 
                            path="/journal" 
                            element={authStore.isAuth ? <JournalPage /> : <Navigate to="/login" replace />} 
                        />
                        <Route 
                            path="/profile" 
                            element={authStore.isAuth ? <ProfilePage /> : <Navigate to="/login" replace />} 
                        />

                        <Route 
                            path="/admin" 
                            element={
                                authStore.isAuth && authStore.user.role === 'admin' 
                                ? <AdminPage /> 
                                : <Navigate to="/" replace />
                            } 
                        />

                        <Route 
                            path="/login" 
                            element={!authStore.isAuth ? <LoginPage /> : <Navigate to="/" replace />} 
                        />
                        <Route 
                            path="/registration" 
                            element={!authStore.isAuth ? <RegistrationPage /> : <Navigate to="/" replace />} 
                        />

                        <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '50px' }}><h1>404</h1><p>Страница не найдена</p></div>} />
                    </Routes>
                </main>

                {/* 4. Рендерим футер */}
                <Footer />
            </div>
        </BrowserRouter>
    );
});

export default App;