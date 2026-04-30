// src/hooks/useLots.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { lotsService } from "@/services/lots.service";

// Hook pour récupérer TOUS les lots
export const useLots = () => {
  return useQuery({
    queryKey: ["lots"],
    queryFn: () => lotsService.getAll(),
  });
};

// Hook pour récupérer UN SEUL lot par son ID
export const useLot = (id: string) => {
  return useQuery({
    queryKey: ["lot", id],
    queryFn: () => lotsService.getOne(id),
    enabled: !!id, // N'exécute la requête que si l'ID est présent
  });
};

