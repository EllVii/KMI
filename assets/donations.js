(() => {
  const config = window.KMI_DONATIONS || {};

  const setStatus = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const everyOrgButtons = document.querySelectorAll('[data-everyorg-donate]');
  everyOrgButtons.forEach((button) => {
    if (config.everyOrgDonateUrl) {
      button.href = config.everyOrgDonateUrl;
      button.removeAttribute('aria-disabled');
      button.removeAttribute('data-disabled');
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
    } else {
      button.href = '#everyorg-setup';
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('data-disabled', 'true');
    }
  });

  if (everyOrgButtons.length) {
    setStatus(
      'everyorg-status',
      config.everyOrgDonateUrl
        ? 'Secure donation flow available through Every.org.'
        : 'KMI’s organization-specific Every.org donation link still needs to be added.'
    );
  }

  const givebutterMount = document.getElementById('givebutter-widget');
  if (givebutterMount && config.givebutterAccountId && config.givebutterCampaignCode) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://widgets.givebutter.com/latest.umd.cjs?acct=${encodeURIComponent(config.givebutterAccountId)}`;
    script.onload = () => {
      const form = document.createElement('givebutter-giving-form');
      form.setAttribute('campaign', config.givebutterCampaignCode);
      givebutterMount.replaceChildren(form);
      setStatus('givebutter-status', 'Givebutter donation form loaded.');
    };
    script.onerror = () => setStatus('givebutter-status', 'Givebutter could not load. Please use the direct donation link.');
    document.head.appendChild(script);
  } else if (givebutterMount) {
    setStatus('givebutter-status', 'Givebutter Account ID and Campaign Code still need to be added.');
  }

  const apiStatus = document.getElementById('givebutter-api-status');
  if (apiStatus) {
    fetch('/api/givebutter?resource=campaigns', { headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        await response.json();
        apiStatus.textContent = 'Givebutter API connection is configured.';
        apiStatus.dataset.state = 'ready';
      })
      .catch(() => {
        apiStatus.textContent = 'Givebutter API secret is not configured on GitHub Pages. Donation widgets can still be enabled separately.';
        apiStatus.dataset.state = 'setup';
      });
  }
})();
