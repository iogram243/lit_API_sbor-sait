const loginButton = document.querySelector('#google-login');
const loginResult = document.querySelector('#login-result');

loginButton?.addEventListener('click', async () => {
  const response = await fetch('/api/auth/google/login');
  const data = await response.json();
  loginResult.textContent = data.message;
});
