import { makeAutoObservable, runInAction } from "mobx";
import $api from "../api"; 

class PlaceStore {
    places = [];
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setPlaces(places) {
        this.places = places;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    //загрузить каталог с сервера
    async fetchPlaces() {
        if (this.places.length > 0) return;
        this.setLoading(true);
        try {
            const response = await $api.get('/places');
            this.setPlaces(response.data); 
        } catch (e) {
            console.error('Ошибка при загрузке каталога:', e.response?.data?.message);
            this.setPlaces([]);
        } finally {
            this.setLoading(false);
        }
    }

    //создать новое место
    async createPlace(formData) {
        try {
            //извлекаем данные из FormData для проверки на дубликаты
            const name = formData.get('name').toLowerCase().trim();
            const city = formData.get('city').toLowerCase().trim();
            const country = formData.get('country').toLowerCase().trim();

            //если все три поля совпадают
            const isDuplicate = this.places.some(p => 
                p.name.toLowerCase().trim() === name &&
                p.city.toLowerCase().trim() === city &&
                p.country.toLowerCase().trim() === country
            );

            if (isDuplicate) {
                alert("Такое место в этом городе и стране уже существует!");
                return false;
            }

            if (!formData.has('image')) {
                formData.append('image_url', 'default-place.webp');
            }

            const response = await $api.post('/places', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            runInAction(() => {
                this.places.push(response.data);
            });
            return true;
        } catch (e) {
            alert(e.response?.data?.message || "Ошибка при создании места");
            return false;
        }
    }

    //удаление места
    async deletePlace(id) {
        try {
            await $api.delete(`/places/${id}`);
            runInAction(() => {
                this.places = this.places.filter(p => p.id !== id);
            });
            return true;
        } catch (e) {
            alert("Ошибка при удалении");
            return false;
        }
    }

    //обновление места
    async updatePlace(id, formData) {
        try {
            const response = await $api.put(`/places/${id}`, formData);
            runInAction(() => {
                this.places = this.places.map(p => p.id === id ? response.data : p);
            });
            return true;
        } catch (e) {
            alert("Ошибка при обновлении");
            return false;
        }
    }
}

export default new PlaceStore();