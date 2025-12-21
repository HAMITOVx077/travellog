import { makeAutoObservable } from "mobx";
import $api from "../api"; 

class PlaceStore {
    //состояние для хранения списка мест
    places = [];
    isLoading = false; //состояние загрузки для каталога

    constructor() {
        makeAutoObservable(this);
    }

    setPlaces(places) {
        this.places = places;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    //получение всего списка мест из каталога
    async fetchPlaces() {
        //мы делаем это с проверкой, чтобы избежать лишних загрузок
        if (this.places.length > 0) return;

        this.setLoading(true);
        try {
            //Запрос к API: GET /api/places
            const response = await $api.get('/places');
            //бэкенд возвращает список мест напрямую[cite: 194], поэтому используем response.data
            this.setPlaces(response.data); 
        } catch (e) {
            console.error('Ошибка при загрузке каталога:', e.response?.data?.message);
            this.setPlaces([]); //очищаем список при ошибке
        } finally {
            this.setLoading(false);
        }
    }
        //внутри PlaceStore.js
    async createPlace(formData) {
        try {
            //formData — это уже объект FormData из компонента
            const response = await $api.post('/places', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            this.places.push(response.data);
            return true;
        } catch (e) {
            console.error("Ошибка при создании места:", e);
            return false;
        }
    }
    // Внутри класса PlaceStore в файле PlaceStore.js
async deletePlace(id) {
    try {
        await $api.delete(`/places/${id}`);
        // Фильтруем массив, удаляя удаленный объект
        this.places = this.places.filter(p => p.id !== id);
        return true;
    } catch (e) {
        console.error("Ошибка при удалении места:", e);
        alert(e.response?.data?.message || "Ошибка при удалении");
        return false;
    }
}
}

export default new PlaceStore();