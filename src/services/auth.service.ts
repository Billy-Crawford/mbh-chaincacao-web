import api from "@/lib/api";
import Cookies from "js-cookie";

export const authService = {
  async register(userData: any) {
    const response = await api.post("/api/auth/register/", userData);
    return response.data;
  },

  async login(credentials: { username: string; password: any }) {
  const response = await api.post("/api/auth/login/", credentials);
  
  // On extrait 'access' à la racine, et 'role' depuis l'objet 'user'
  const { access, user } = response.data;
  const role = user?.role;

  if (access) {
    Cookies.set("access_token", access, { expires: 7, sameSite: 'lax' });
    
    if (role) {
      // On stocke le rôle en minuscule pour éviter les surprises
      Cookies.set("role", role.toLowerCase(), { expires: 7, sameSite: 'lax' });
    }
  }

  return response.data; // On retourne tout l'objet au cas où la page en a besoin
},

  logout() {
    Cookies.remove("access_token");
    Cookies.remove("role");
    window.location.href = "/login";
  }
};

