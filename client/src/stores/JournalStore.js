import { makeAutoObservable } from "mobx";
import $api from "../api"; 

class JournalStore {
    journalPlaces = [];
    isLoading = false; 

    constructor() {
        makeAutoObservable(this);
    }

    setJournalPlaces(places) {
        this.journalPlaces = places;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    getPlaceStatus(placeId) {
        const entry = this.journalPlaces.find(entry => entry.place_id === placeId);
        if (!entry) return null; 
        return {
            status: entry.status,
            journalEntryId: entry.id 
        };
    }

    async fetchJournal() {
        this.setLoading(true);
        try {
            const response = await $api.get('/journal');
            this.setJournalPlaces(response.data); 
        } catch (e) {
            console.error('Ошибка при загрузке журнала:', e.response?.data?.message);
            this.setJournalPlaces([]); 
        } finally {
            this.setLoading(false);
        }
    }

    async addPlace(placeId) {
        try {
            const response = await $api.post('/journal', { placeId });
            const newEntry = response.data; 
            if (!this.journalPlaces.some(e => e.id === newEntry.id)) {
                this.journalPlaces.unshift(newEntry);
            }
            return true;
        } catch (e) {
            console.error('Ошибка при добавлении места в журнал:', e.response?.data?.message);
            alert('Не удалось добавить место в журнал.');
            return false;
        }
    }
    
    async removePlace(id) {
        try {
            await $api.delete(`/journal/${id}`); 
            this.journalPlaces = this.journalPlaces.filter(p => p.id !== id);
        } catch (e) {
            console.error('Ошибка при удалении места из журнала:', e.response?.data?.message);
            alert('Не удалось удалить место из журнала.');
        }
    }

    //в метод добавлена передача visited_date
    async updateStatus(journalEntryId, { status, rating, user_review, visited_date }) {
        try {
            const response = await $api.put(`/journal/${journalEntryId}`, { 
                status, 
                rating, 
                user_review,
                visited_date //отправляем на бэкенд
            });
            
            const index = this.journalPlaces.findIndex(p => p.id === journalEntryId);
            if (index !== -1) {
                this.journalPlaces[index] = response.data;
            }
            return true;
        } catch (e) {
            console.error('Ошибка при обновлении статуса:', e.response?.data?.message || e);
            alert('Не удалось сохранить изменения');
            return false;
        }
    }
}

export default new JournalStore();