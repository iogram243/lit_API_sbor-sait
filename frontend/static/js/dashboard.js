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

const entityStore = {
  litnet: [],
  litgorod: [],
  yandex: [],
  vk: [],
};
const collectionJobs = [];
let currentPlatform = 'all';

function getEntityLabel(type) {
  return type === 'litnet' ? 'Litnet' : type === 'litgorod' ? 'Litgorod' : type === 'yandex' ? 'Яндекс' : 'VK';
}

function getPlatformLabel(platform) {
  return platform === 'all' ? 'всех площадок' : platform === 'litnet' ? 'Litnet' : platform === 'litgorod' ? 'Litgorod' : 'Автор.Тудей';
}

function setPlatformFilter(platform) {
  currentPlatform = platform;
  document.querySelectorAll('.platform-pill').forEach((button) => {
    button.classList.toggle('active', button.dataset.platform === platform);
  });
  document.querySelector('#platform-summary').textContent = `Показываются данные по ${getPlatformLabel(platform)}`;
  loadDashboard();
}

function openCollectionModal() {
  resetCollectionForm();
  document.querySelector('#collection-modal')?.classList.add('open');
  document.querySelector('#collection-modal')?.setAttribute('aria-hidden', 'false');
}

function closeCollectionModal() {
  document.querySelector('#collection-modal')?.classList.remove('open');
  document.querySelector('#collection-modal')?.setAttribute('aria-hidden', 'true');
}

function resetCollectionForm() {
  const form = document.querySelector('#collection-form');
  if (!form) return;
  form.reset();
}

function saveCollection() {
  const form = document.querySelector('#collection-form');
  if (!form) return;
  const job = {
    platform: form.collection_platform.value,
    book_url: form.book_url.value,
    book_title: form.book_title.value,
    api_key: form.collection_api_key.value,
    login: form.collection_login.value,
    password: form.collection_password.value,
    notes: form.collection_notes.value,
    created_at: new Date().toISOString(),
    status: 'Ожидает запуска',
  };
  collectionJobs.push(job);
  closeCollectionModal();
  showToast('Сбор данных создан. Запуск будет настроен позже.');
}

function renderBooksTable(books) {
  const booksTable = document.querySelector('#books-table');
  const booksEmpty = document.querySelector('#books-empty');
  if (!booksTable || !booksEmpty) return;
  const filteredBooks = currentPlatform === 'all' ? books : books.filter((book) => book.platform.toLowerCase() === (currentPlatform === 'authortoday' ? 'author.today' : currentPlatform));
  booksTable.innerHTML = filteredBooks.map((book) => `
    <tr>
      <td><strong>${book.title}</strong></td>
      <td><span class="pill">${book.platform}</span></td>
      <td>${number.format(book.views)}</td>
      <td>${number.format(book.libraries)}</td>
      <td>${number.format(book.purchases)}</td>
      <td>${money.format(book.revenue)}</td>
    </tr>
  `).join('');
  booksEmpty?.classList.toggle('visible', filteredBooks.length === 0);
}

function renderEntityList(type) {
  const container = document.querySelector(`#${type}-entities`);
  if (!container) return;
  if (!entityStore[type].length) {
    container.innerHTML = '<div class="empty-state">Ещё нет записей</div>';
    return;
  }
  container.innerHTML = entityStore[type].map((item, index) => `
    <article class="settings-card">
      <div class="panel-title"><strong>${item.account_name || getEntityLabel(type)}</strong><span>${item.description || ''}</span></div>
      <div class="settings-card-body">
        ${item.login ? `<p>Логин: ${item.login}</p>` : ''}
        ${item.api_key ? `<p>API-ключ: •••••••••</p>` : ''}
        ${item.vk_id ? `<p>VK ID: ${item.vk_id}</p>` : ''}
      </div>
      <div class="settings-form-actions">
        <button class="btn btn-outline" type="button" data-delete-entity data-entity-type="${type}" data-entity-index="${index}">Удалить</button>
      </div>
    </article>
  `).join('');
}

function renderEntityLists() {
  ['litnet', 'litgorod', 'yandex', 'vk'].forEach(renderEntityList);
}

function updateEntityModalFields(type) {
  const entityForm = document.querySelector('#entity-form');
  if (!entityForm) return;
  const loginField = entityForm.querySelector('.entity-field-login');
  const passwordField = entityForm.querySelector('.entity-field-password');
  const apiKeyField = entityForm.querySelector('.entity-field-api-key');
  const vkIdField = entityForm.querySelector('.entity-field-vk-id');
  const entityTypeInput = entityForm.querySelector('[name="entity_type"]');
  const kindLabel = document.querySelector('#entity-kind-label');
  const title = document.querySelector('#entity-title');

  const showAccountFields = ['litnet', 'litgorod'].includes(type);
  const showApiFields = ['yandex', 'vk'].includes(type);
  loginField.style.display = showAccountFields ? '' : 'none';
  passwordField.style.display = showAccountFields ? '' : 'none';
  apiKeyField.style.display = showApiFields ? '' : 'none';
  vkIdField.style.display = type === 'vk' ? '' : 'none';

  entityTypeInput.value = type;
  kindLabel.textContent = showApiFields ? 'Новый API-ключ' : 'Новый аккаунт';
  title.textContent = showApiFields
    ? `Добавить ${type === 'vk' ? 'VK' : 'Яндекс'} API`
    : `Добавить ${getEntityLabel(type)} аккаунт`;
}

function openEntityModal(type) {
  resetEntityForm();
  updateEntityModalFields(type);
  document.querySelector('#entity-modal')?.classList.add('open');
  document.querySelector('#entity-modal')?.setAttribute('aria-hidden', 'false');
}

function closeEntityModal() {
  document.querySelector('#entity-modal')?.classList.remove('open');
  document.querySelector('#entity-modal')?.setAttribute('aria-hidden', 'true');
}

function resetEntityForm() {
  const entityForm = document.querySelector('#entity-form');
  if (!entityForm) return;
  entityForm.reset();
  entityForm.querySelector('[name="entity_id"]').value = '';
}

function saveEntity() {
  const entityForm = document.querySelector('#entity-form');
  if (!entityForm) return;

  const type = entityForm.querySelector('[name="entity_type"]').value;
  const data = {
    account_name: entityForm.querySelector('[name="account_name"]').value,
    login: entityForm.querySelector('[name="login"]').value,
    password: entityForm.querySelector('[name="password"]').value,
    api_key: entityForm.querySelector('[name="api_key"]').value,
    vk_id: entityForm.querySelector('[name="vk_id"]').value,
  };

  entityStore[type].push(data);
  renderEntityList(type);
  closeEntityModal();
  resetEntityForm();
  showToast('Настройки сохранены локально');
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

  renderBooksTable(data.books);
  const platformSummary = document.querySelector('#platform-summary');
  if (platformSummary) {
    platformSummary.textContent = `Показываются данные по ${getPlatformLabel(currentPlatform)}`;
  }
  const chart = document.querySelector('#trend-chart');
  if (chart) {
    chart.textContent = data.trends?.length ? `Тренд по показам за ${data.trends.length} дней` : 'Здесь будет график динамики показателей';
  }
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
  if (event.key === 'Escape') {
    closeSettings();
    closeEntityModal();
    closeCollectionModal();
  }
});
document.querySelectorAll('[data-tab-target]').forEach((button) => {
  button.addEventListener('click', () => activateSettingsTab(button.dataset.tabTarget));
});

document.querySelectorAll('[data-open-entity-modal]').forEach((button) => {
  button.addEventListener('click', () => openEntityModal(button.dataset.entityType));
});
document.querySelectorAll('[data-close-entity-modal]').forEach((button) => {
  button.addEventListener('click', closeEntityModal);
});
document.querySelector('#entity-modal')?.addEventListener('click', (event) => {
  if (event.target.id === 'entity-modal') closeEntityModal();
});
document.querySelector('#save-entity')?.addEventListener('click', saveEntity);

document.querySelectorAll('.platform-pill').forEach((button) => {
  button.addEventListener('click', () => setPlatformFilter(button.dataset.platform));
});
document.querySelector('[data-open-collection-modal]')?.addEventListener('click', openCollectionModal);
document.querySelectorAll('[data-close-collection-modal]').forEach((button) => {
  button.addEventListener('click', closeCollectionModal);
});
document.querySelector('#collection-modal')?.addEventListener('click', (event) => {
  if (event.target.id === 'collection-modal') closeCollectionModal();
});
document.querySelector('#save-collection')?.addEventListener('click', saveCollection);

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-delete-entity]');
  if (!button) return;
  const type = button.dataset.entityType;
  const index = Number(button.dataset.entityIndex);
  if (!type || Number.isNaN(index)) return;
  entityStore[type]?.splice(index, 1);
  renderEntityList(type);
  showToast('Элемент удалён в демо-режиме');
});

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.toast));
});
document.querySelector('#save-system-settings')?.addEventListener('click', () => showToast('Системные настройки сохранены'));

renderEntityLists();
