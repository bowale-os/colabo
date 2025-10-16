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
  } catch (parseErr){
      data = { error: 'Failed to parse server response.', parseErr };
  }

  //Token expired error (401)
  if (data.error === 'token_expired' && res.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken && setAccessToken) {
      setAccessToken(newAccessToken);
      //retry route with new token
      const retryRes = await fetchWithAuth(url, options, newAccessToken, setAccessToken);
      return retryRes;

    }
    window.location.href= '/login'
    return;
  }

  if (!res.ok) {
    // If backend sent a custom error message, include it in thrown Error
    const message = data?.error || res.statusText || 'Unknown error';
    throw new Error(message);
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
export async function inviteUser(currentUserId, collabEmail, noteId, collabRole, accessToken, setAccessToken) {
  // Controller expects all four fields in body!
  const response = await fetchWithAuth(`${API_URL}/collab/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentUserId, collabEmail, noteId, collabRole }),
  }, accessToken, setAccessToken);
  // Return full response in case you want message, etc.
  console.log(response);
  return response; // returns { message: ... }
}

// Get all collaborators for a note
export async function getNoteCollabs(noteId, accessToken, setAccessToken) {
  const response = await fetchWithAuth(`${API_URL}/collab/${noteId}/collabs`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }, accessToken, setAccessToken);
  console.log(response);
  // Defensive extract; always return array (even if API shape changes)
  return Array.isArray(response?.collabs) ? response.collabs : [];
}

// Accept an invite (invitee only)
export async function acceptInvite(inviteId, currentUserId, accessToken, setAccessToken) {
  // Controller expects { currentUserId } in body
  const response = await fetchWithAuth(`${API_URL}/collab/${inviteId}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentUserId }),
  }, accessToken, setAccessToken);
  return response;
}

// Remove a collaborator (owner only)
export async function removeCollab(collabId, currentUserId, noteId , accessToken, setAccessToken) {
  // Controller expects currentUserId, noteId in body
  const response = await fetchWithAuth(`${API_URL}/collab/${collabId}/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentUserId, noteId }),
  }, accessToken, setAccessToken);
  return response;
}

// Change collaborator's role (owner only)
export async function changeCollaboratorRole(noteId, collabId, { newRole, currentUserId }, accessToken, setAccessToken) {
  // Controller expects newRole, currentUserId in body
  const response = await fetchWithAuth(`${API_URL}/collab/${noteId}/change-role/${collabId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newRole, currentUserId }),
  }, accessToken, setAccessToken);
  return response;
}

// Get all pending invites for a note (owner only)
export async function getPendingInvites(noteId, currentUserId, accessToken, setAccessToken) {
  const response = await fetchWithAuth(`${API_URL}/collab/${noteId}/invites/${currentUserId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  }, accessToken, setAccessToken);
  // Defensive: always return array
  console.log(response);
  return Array.isArray(response?.pendingInvites) ? response.pendingInvites : [];
}
