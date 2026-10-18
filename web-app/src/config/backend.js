// Backend URL configuration (web version)
const envUrl = import.meta.env.VITE_BACKEND_URL;

const resolveBackendUrl = () => {
  if (envUrl) return envUrl;
  const { hostname, protocol } = window.location;
  return `${protocol}//${hostname}:4002`;
};

export const BACKEND_URL = resolveBackendUrl();
