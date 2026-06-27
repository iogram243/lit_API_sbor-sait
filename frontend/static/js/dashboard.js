const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('ru-RU');

const metricLabels = {
  revenue: 'Доход',
  ad_spend: 'Расходы на рекламу',
  manual_spend: 'Ручные расходы',
  roi: 'ROI',
  romi: 'ROMI',
};

function renderMetric(key, value) {
  const isMoney = ['revenue', 'ad_spend', 'manual_spend'].includes(key);
  const formatted = isMoney ? money.format(value) : `${value}%`;
  return `<article class="metric"><span>${metricLabels[key]}</span><strong>${formatted}</strong></article>`;
}

async function loadDashboard() {
  const response = await fetch('/api/dashboard/summary');
  const data = await response.json();

  document.querySelector('#metrics').innerHTML = ['revenue', 'ad_spend', 'manual_spend', 'roi', 'romi']
    .map((key) => renderMetric(key, data[key]))
    .join('');

  document.querySelector('#books-table').innerHTML = data.books.map((book) => `
    <tr>
      <td>${book.title}</td>
      <td>${book.platform}</td>
      <td>${number.format(book.views)}</td>
      <td>${number.format(book.libraries)}</td>
      <td>${number.format(book.purchases)}</td>
      <td>${money.format(book.revenue)}</td>
    </tr>
  `).join('');

  document.querySelector('#alerts').innerHTML = data.alerts.map((alert) => `<li>${alert}</li>`).join('');
}

loadDashboard();
