/**
 * ProfileGenerator API — Handles upload and image generation via PHP backend.
 */

const API_BASE = '/api';

export async function generateProfile(file, entity, uploadMethod = 'manual', employeeId = '') {
  const formData = new FormData();
  formData.append('entity', entity);
  formData.append('uploadMethod', uploadMethod);

  if (uploadMethod === 'employee') {
    formData.append('employeeId', employeeId);
  } else {
    formData.append('portrait', file);
  }

  const response = await fetch(`${API_BASE}/generate_profile.php`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}
