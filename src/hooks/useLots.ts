// src/hooks/useLots.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { lotsService } from "@/services/lots.service";

export const useLots = () => {
  return useQuery({
    queryKey: ["lots"],
    queryFn: lotsService.getAll,
  });
};
