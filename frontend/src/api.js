const API_URL = "http://localhost:3000/api";

// Helper to attach the access token to headers
function addAuthHeader(headers = {}, accessToken) {
  if (accessToken) {
    return {
      ...headers,
      "Authorization": `Bearer ${accessToken}`
    };
  }
  return headers;
}

async function fetchWithAuth(url, options = {}, accessToken, setAccessToken) {
  // Attach the Authorization header if token is provided
  const updatedOptions = {
    ...options,
    headers: addAuthHeader(options.headers, accessToken),
    // credentials can stay if you have httpOnly cookies for refresh
    credentials: options.credentials || "include",
  };

  let res = await fetch(url, updatedOptions);

  let data = null;
  try {
      data = await res.json();
  } catch {
      data = {};
  }

  if (data.error === 'token_expired' && res.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken && setAccessToken) {
      setAccessToken(newAccessToken);

      const retryRes = await fetchWithAuth(url, options, newAccessToken, setAccessToken);
      return retryRes;

    }
    window.location.href= '/login'
    return;
  } 
  return data;
}


// Registration
export async function refreshAccessToken() {
  const res = await fetch(`${API_URL}/auth/refresh-token`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.accessToken;
}

// Registration
export async function registerUser(data) {
  return await fetchWithAuth(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

}

// Login
export async function loginUser(data) {
  return await fetchWithAuth(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// Logout
export async function logoutUser(accessToken, setAccessToken) {
  const res = await fetchWithAuth(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, accessToken, setAccessToken); // include accessToken here if needed
  return await res.json();
}

// Get user info (requires token)
export async function getUserInfo(accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/user/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }, accessToken, setAccessToken);
 
}

// Get notes
export async function getNotes(accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/note`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }, accessToken, setAccessToken);
}

// Create note
export async function createNote(data, accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/note`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }, accessToken, setAccessToken);

}

// Update note
export async function updateNote(id, data, accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/note/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }, accessToken, setAccessToken);

}

// Delete note
export async function deleteNote(id, accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/note/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  }, accessToken, setAccessToken);
}



// send an invite
export async function sendInvite(id, accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/note/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  }, accessToken, setAccessToken);
}



//================================= COLLAB ROUTES =========================

// Invite a user to collaborate on a note
export async function inviteUser(payload, accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/collab/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }, accessToken, setAccessToken);
}


// Get all collaborators for a note
export async function getNoteCollabs(noteId, accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/collab/${noteId}/collabs`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }, accessToken, setAccessToken);
}


// Accept an invite (invitee only)
export async function acceptInvite(inviteId, payload, accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/collab/${inviteId}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }, accessToken, setAccessToken);
}


// Remove a collaborator (owner only)
export async function removeCollab(collabId, payload, accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/collab/${collabId}/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload) // DELETE allows body in fetch, some backends require in req.body
  }, accessToken, setAccessToken);
}


// Change collaborator's role (owner only)
export async function changeCollaboratorRole(noteId, collabId, payload, accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/collab/${noteId}/change-role/${collabId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }, accessToken, setAccessToken);
}


// Get all pending invites for a note (owner only)
export async function getPendingInvites(noteId, currentUserId, accessToken, setAccessToken) {
  return await fetchWithAuth(`${API_URL}/collab/${noteId}/invites/${currentUserId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }, accessToken, setAccessToken);
}