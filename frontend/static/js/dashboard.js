const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('ru-RU');

const metricLabels = {
  revenue: 'Доход',
  ad_spend: 'Реклама',
  manual_spend: 'Ручные расходы',
  roi: 'ROI',
  romi: 'ROMI',
};

function renderMetric(key, value) {
  const isMoney = ['revenue', 'ad_spend', 'manual_spend'].includes(key);
  const formatted = isMoney ? money.format(value) : `${value}%`;
  return `<article class="metric-card"><span>${metricLabels[key]}</span><strong>${formatted}</strong><small>пока заглушка</small></article>`;
}

function activateSettingsTab(tabName = 'litnet') {
  document.querySelectorAll('[data-tab-target]').forEach((button) => {
    button.classList.toggle('active', button.dataset.tabTarget === tabName);
  });
  document.querySelectorAll('[data-tab-panel]').forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.tabPanel === tabName);
  });
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

function openSettings(tabName = 'litnet') {
  activateSettingsTab(tabName);
  const modal = document.querySelector('#settings-modal');
  modal?.classList.add('open');
  modal?.setAttribute('aria-hidden', 'false');
}

function closeSettings() {
  const modal = document.querySelector('#settings-modal');
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden', 'true');
}

async function loadDashboard() {
  document.body.classList.add('loading');
  const response = await fetch('/api/dashboard/summary');
  const data = await response.json();

  document.querySelector('#metrics').innerHTML = ['revenue', 'ad_spend', 'manual_spend', 'roi', 'romi']
    .map((key) => renderMetric(key, data[key]))
    .join('');

  const booksTable = document.querySelector('#books-table');
  const booksEmpty = document.querySelector('#books-empty');

  booksTable.innerHTML = data.books.map((book) => `
    <tr>
      <td><strong>${book.title}</strong></td>
      <td><span class="pill">${book.platform}</span></td>
      <td>${number.format(book.views)}</td>
      <td>${number.format(book.libraries)}</td>
      <td>${number.format(book.purchases)}</td>
      <td>${money.format(book.revenue)}</td>
    </tr>
  `).join('');

  booksEmpty?.classList.toggle('visible', data.books.length === 0);
  document.querySelector('#alerts').innerHTML = data.alerts.map((alert) => `<li>${alert}</li>`).join('');
  document.body.classList.remove('loading');
}

document.querySelectorAll('[data-open-settings]').forEach((button) => {
  button.addEventListener('click', () => openSettings(button.dataset.tab || 'litnet'));
});
document.querySelector('[data-close-settings]')?.addEventListener('click', closeSettings);
document.querySelector('#settings-modal')?.addEventListener('click', (event) => {
  if (event.target.id === 'settings-modal') closeSettings();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeSettings();
});
document.querySelectorAll('[data-tab-target]').forEach((button) => {
  button.addEventListener('click', () => activateSettingsTab(button.dataset.tabTarget));
});

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});

document.querySelectorAll('[data-confirm-delete]').forEach((button) => {
  button.addEventListener('click', () => {
    if (window.confirm('Удалить этот элемент? Это демо-действие.')) {
      showToast('Элемент удалён в демо-режиме');
    }
  });
});

loadDashboard();
