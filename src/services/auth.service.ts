import api from "@/lib/api";
import Cookies from "js-cookie";

export const authService = {
  login: async (telephone: string, pin: string) => {
    // MOCK LOCAL POUR TEST FRONTEND
    if (pin === "1234") {
      const fakeData = {
        access: "fake_token_123",
        refresh: "fake_refresh_123",
        role: "cooperative",
        nom: "Kofi Coop",
      };

      Cookies.set("access_token", fakeData.access);
      Cookies.set("refresh_token", fakeData.refresh);
      Cookies.set("role", fakeData.role);
      Cookies.set("nom", fakeData.nom);

      return fakeData;
    }

    throw {
      response: {
        data: { detail: "Numéro ou PIN incorrect" },
      },
    };
  },

  logout: () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("role");
    Cookies.remove("nom");

    window.location.href = "/login";
  },

  getRole: () => Cookies.get("role"),
  getToken: () => Cookies.get("access_token"),
};
