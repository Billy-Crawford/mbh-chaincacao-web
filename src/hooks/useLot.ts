"use client";

import { useQuery } from "@tanstack/react-query";
import { lotsService } from "@/services/lots.service";

export const useLot = (id: string) => {
  return useQuery({
    queryKey: ["lot", id],
    queryFn: () => lotsService.getOne(id),
    enabled: !!id,
  });
};

