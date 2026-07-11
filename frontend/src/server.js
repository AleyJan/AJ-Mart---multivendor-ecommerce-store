const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const server = `${BASE}/api/v2`;
export const backend_url = `${BASE}/`;
export const socket_server = BASE;
