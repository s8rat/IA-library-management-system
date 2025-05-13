import api from './api';

export interface Location {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    createdAt: string;
}

export interface CreateLocationDTO {
    name: string;
    latitude: number;
    longitude: number;
}

const locationService = {
    async getLocations(): Promise<Location[]> {
        const response = await api.get('/api/Location');
        return response.data;
    },

    async createLocation(location: CreateLocationDTO): Promise<Location> {
        const response = await api.post('/api/Location', location);
        return response.data;
    },

    async deleteLocation(id: number): Promise<void> {
        await api.delete(`/api/Location/${id}`);
    }
};

export default locationService; 