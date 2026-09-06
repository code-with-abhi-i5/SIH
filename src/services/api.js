// API Service layer connecting to Express Backend on http://localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper with error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = options.headers || getAuthHeaders();

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`API Error on [${options.method || "GET"} ${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // ── Authentication ────────────────────────────────────────────────────────
  auth: {
    signup: (userData) =>
      request("/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    signin: (credentials) =>
      request("/auth/signin", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    logout: () =>
      request("/auth/logout", {
        method: "POST",
      }),
  },

  // ── Citizen Challenges & AI Pipeline ──────────────────────────────────────
  challenges: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/challenges${query ? `?${query}` : ""}`);
    },
    getById: (id) => request(`/challenges/${id}`),
    create: (challengeData) =>
      request("/challenges", {
        method: "POST",
        body: JSON.stringify(challengeData),
      }),
    upvote: (id) =>
      request(`/challenges/${id}/upvote`, {
        method: "POST",
      }),
  },

  // ── Media & Evidence Upload ───────────────────────────────────────────────
  upload: {
    uploadImage: (base64Image, folder = "sih26043_evidence") =>
      request("/upload/image", {
        method: "POST",
        body: JSON.stringify({ image: base64Image, folder }),
      }),
  },

  // ── Voice Ingestion ───────────────────────────────────────────────────────
  voice: {
    transcribeAndFile: (voiceData) =>
      request("/voice/transcribe-and-file", {
        method: "POST",
        body: JSON.stringify(voiceData),
      }),
  },

  // ── University Solution Proposals & Milestones ─────────────────────────────
  proposals: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/proposals${query ? `?${query}` : ""}`);
    },
    create: (proposalData) =>
      request("/proposals", {
        method: "POST",
        body: JSON.stringify(proposalData),
      }),
    updateMilestone: (id, milestoneData) =>
      request(`/proposals/${id}/milestones`, {
        method: "PUT",
        body: JSON.stringify(milestoneData),
      }),
    disburseGrant: (id, grantData) =>
      request(`/proposals/${id}/disburse-grant`, {
        method: "POST",
        body: JSON.stringify(grantData),
      }),
  },

  // ── NEP 2020 Academic Credits & Certificates ──────────────────────────────
  certificates: {
    generate: (certData) =>
      request("/certificates/generate", {
        method: "POST",
        body: JSON.stringify(certData),
      }),
    verify: (certIdOrHash) => request(`/certificates/verify/${certIdOrHash}`),
  },

  // ── Government Analytics, GIS Heatmap & Crisis Hotspots ──────────────────
  analytics: {
    getDashboard: () => request("/analytics/dashboard"),
    getGisHeatmap: () => request("/analytics/gis-heatmap"),
    getHotspots: () => request("/analytics/hotspots"),
  },

  // ── Sahayak AI Chatbot ────────────────────────────────────────────────────
  chat: {
    sendMessage: (chatData) =>
      request("/chat/message", {
        method: "POST",
        body: JSON.stringify(chatData),
      }),
    getHistory: (sessionId) => request(`/chat/history/${sessionId}`),
    resetSession: (sessionId) =>
      request(`/chat/session/${sessionId}`, {
        method: "DELETE",
      }),
  },
};

export default api;
