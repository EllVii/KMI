(() => {
  const keys = {
    chat: 'kmiChatLeads',
    giving: 'kmiGivingRecords',
    crm: 'kmiCrmRecords'
  };

  const read = key => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };
  const write = (key, rows) => localStorage.setItem(key, JSON.stringify(rows));
  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
  const money = value => {
    const amount = Number(value);
    return `$${Number.isFinite(amount) ? amount.toFixed(2) : '0.00'}`;
  };
  const rowFallback = (cols, text) => `<tr><td colspan="${cols}">${escapeHtml(text)}</td></tr>`;

  function render() {
    const chatRows = document.getElementById('chatRows');
    const givingRows = document.getElementById('givingRows');
    const crmRows = document.getElementById('crmRows');
    const chat = read(keys.chat);
    const giving = read(keys.giving);
    const crm = read(keys.crm);

    if (chatRows) {
      chatRows.innerHTML = chat.length
        ? chat.map(row => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.topic)}</td><td>${escapeHtml(row.status)}</td></tr>`).join('')
        : rowFallback(4, 'No chatbot leads yet.');
    }

    if (givingRows) {
      givingRows.innerHTML = giving.length
        ? giving.map(row => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.source)}</td><td>${escapeHtml(row.category)}</td><td>${money(row.amount)}</td></tr>`).join('')
        : rowFallback(4, 'No giving records yet.');
    }

    if (crmRows) {
      crmRows.innerHTML = crm.length
        ? crm.map(row => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.area)}</td><td>${escapeHtml(row.status)}</td><td>${escapeHtml(row.owner)}</td></tr>`).join('')
        : rowFallback(5, 'No CRM records yet.');
    }
  }

  const givingForm = document.getElementById('givingForm');
  if (givingForm) {
    givingForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(givingForm);
      const rows = read(keys.giving);
      rows.push({
        date: new Date().toLocaleString(),
        source: formData.get('source') || '',
        amount: formData.get('amount') || 0,
        category: formData.get('category') || '',
        method: formData.get('method') || '',
        notes: formData.get('notes') || ''
      });
      write(keys.giving, rows);
      givingForm.reset();
      render();
    });
  }

  const crmForm = document.getElementById('crmForm');
  if (crmForm) {
    crmForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(crmForm);
      const rows = read(keys.crm);
      rows.push({
        date: new Date().toLocaleString(),
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        area: formData.get('area') || '',
        status: formData.get('status') || '',
        owner: formData.get('owner') || '',
        notes: formData.get('notes') || ''
      });
      write(keys.crm, rows);
      crmForm.reset();
      render();
    });
  }

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = {
        chatbot_leads: read(keys.chat),
        giving_records: read(keys.giving),
        crm_records: read(keys.crm)
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kmi-crm-demo-export.json';
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all local demo CRM data?')) {
        Object.values(keys).forEach(key => localStorage.removeItem(key));
        render();
      }
    });
  }

  render();
})();
