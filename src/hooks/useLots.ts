// src/hooks/useLots.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { lotsService } from "@/services/lots.service";

export const useLots = () => {
  return useQuery({
    queryKey: ["lots"],
    queryFn: async () => {
      const data = await lotsService.getAll();
      // On s'assure que data est bien un tableau pour éviter le crash du .map()
      return Array.isArray(data) ? data : (data?.results || []);
    },
    refetchInterval: 5000, // Optionnel : rafraîchit toutes les 5s pour voir les nouveaux lots arriver en direct
  });
};


export const useLot = (id: string) => {
  return useQuery({
    queryKey: ["lot", id],
    queryFn: () => lotsService.getOne(id),
    enabled: !!id,
  });
};

