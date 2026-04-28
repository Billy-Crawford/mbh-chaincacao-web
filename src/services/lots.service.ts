import api from "@/lib/api";

export const lotsService = {
  getAll: async () => {
    const res = await api.get("/api/lots/");
    return res.data.results;
  },

  getOne: async (id: string) => {
    const res = await api.get(`/api/lots/${id}/`);
    return res.data;
  },

  create: async (data: any) => {
    const res = await api.post("/api/lots/", data);
    return res.data;
  },
};
