import api from "@/lib/api";

export const lotsService = {
  // On utilise "getAll" pour matcher avec ton hook useLots
  async getAll() {
    const response = await api.get("/api/lots/");
    return response.data;
  },
  
  async getOne(id: string) {
    const response = await api.get(`/api/lots/${id}/`);
    return response.data;
  }
};