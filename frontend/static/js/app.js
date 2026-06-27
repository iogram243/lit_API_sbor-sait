const loginButtons = [
  document.querySelector('#google-login'),
  document.querySelector('#hero-google-login'),
].filter(Boolean);

function startGoogleLogin() {
  window.location.href = '/api/auth/google/login';
}

loginButtons.forEach((button) => button.addEventListener('click', startGoogleLogin));
