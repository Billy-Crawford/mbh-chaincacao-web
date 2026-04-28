export const formatError = (err: any) => {
  return (
    err?.response?.data?.detail ||
    err?.message ||
    "Erreur inattendue"
  );
};

