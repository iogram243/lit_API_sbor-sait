const loginButtons = [
  document.querySelector('#google-login'),
  document.querySelector('#hero-google-login'),
].filter(Boolean);
const loginResult = document.querySelector('#login-result');

async function startGoogleLogin() {
  const response = await fetch('/api/auth/google/login', { redirect: 'manual' });
  const contentType = response.headers.get('content-type') || '';

  if (response.type === 'opaqueredirect' || response.status === 0) {
    window.location.href = '/api/auth/google/login';
    return;
  }

  if (contentType.includes('application/json')) {
    const data = await response.json();
    if (loginResult) loginResult.textContent = data.message;
    return;
  }

  window.location.href = '/api/auth/google/login';
}

loginButtons.forEach((button) => button.addEventListener('click', startGoogleLogin));
