// src/hooks/useLots.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { lotsService } from "@/services/lots.service";

// Hook pour tous les lots
export const useLots = () => {
  return useQuery({
    queryKey: ["lots"],
    queryFn: () => lotsService.getAll(),
    initialData: [], // Sécurité : renvoie un tableau vide par défaut
  });
};

// Hook pour un lot spécifique (réglera l'erreur dans LotDetail)
export const useLot = (id: string) => {
  return useQuery({
    queryKey: ["lot", id],
    queryFn: () => lotsService.getOne(id),
    enabled: !!id, // N'exécute la requête que si l'ID existe
  });
};