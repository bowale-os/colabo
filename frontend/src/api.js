const API_URL = "http://localhost:3000/api"

async function fetchWithAuth(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    // Try to parse the error
    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (data.error === 'token_expired') {
      // Optional: clear local state
      window.location.href = '/login';  // Redirect to login
      return; // Prevent further processing
    }
    // Optionally, handle other 401s
  }
  return res;
}


export async function registerUser(data) {
  const res = await fetchWithAuth(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include", // Include cookies
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function loginUser(data) {
  const res = await fetchWithAuth(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include", // Include cookies
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function logoutUser() {
  const res = await fetchWithAuth(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    credentials: "include", // Include cookies
  });
  return await res.json();
}

export async function getUserInfo() {
  const res = await fetchWithAuth(`${API_URL}/user/me`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
    credentials: "include", // Include cookies
  });
  return await res.json();
}

export async function getNotes() {
  const res = await fetchWithAuth(`${API_URL}/note`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include" // This sends the HTTP-only cookie automatically
  });
  return await res.json();
}


export async function createNote(data) {
  const res = await fetchWithAuth(`${API_URL}/note`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", // This sends the HTTP-only cookie automatically
    body: JSON.stringify(data)
  });
  return await res.json();
}


export async function updateNote(id, data) {
  const res = await fetchWithAuth(`${API_URL}/note/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", // This sends the HTTP-only cookie automatically
    body: JSON.stringify(data)
  });
  return await res.json();
}


export async function deleteNote(id) {
  const res = await fetchWithAuth(`${API_URL}/note/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include" // This sends the HTTP-only cookie automatically
  });
  return await res.json();
}

// Add createNote, updateNote, deleteNote similarly
