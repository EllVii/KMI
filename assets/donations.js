(() => {
  const config = window.KMI_DONATIONS || {};
  const contactHref = 'connect.html#contact';

  const setStatus = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  document.querySelectorAll('[data-everyorg-donate]').forEach((button) => {
    if (config.everyOrgDonateUrl) {
      button.href = config.everyOrgDonateUrl;
      button.removeAttribute('aria-disabled');
      button.removeAttribute('data-disabled');
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
    } else {
      button.href = contactHref;
      button.removeAttribute('aria-disabled');
      button.removeAttribute('data-disabled');
      button.textContent = 'Contact KMI About Crypto Giving';
    }
  });

  setStatus(
    'everyorg-status',
    config.everyOrgDonateUrl
      ? 'Secure cryptocurrency giving is available through Every.org.'
      : 'KMI is finalizing its organization-specific Every.org giving link. Contact KMI for current donation options.'
  );

  const givebutterMount = document.getElementById('givebutter-widget');
  if (givebutterMount && config.givebutterAccountId && config.givebutterCampaignCode) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://widgets.givebutter.com/latest.umd.cjs?acct=${encodeURIComponent(config.givebutterAccountId)}`;
    script.onload = () => {
      const form = document.createElement('givebutter-giving-form');
      form.setAttribute('campaign', config.givebutterCampaignCode);
      givebutterMount.replaceChildren(form);
      setStatus('givebutter-status', 'Secure online giving is available through Givebutter.');
    };
    script.onerror = () => {
      givebutterMount.innerHTML = '<p><strong>Online giving is temporarily unavailable.</strong></p><a class="btn ghost" href="connect.html#contact">Contact KMI about giving</a>';
      setStatus('givebutter-status', 'Please contact KMI for current giving options.');
    };
    document.head.appendChild(script);
  } else if (givebutterMount) {
    givebutterMount.innerHTML = '<p><strong>Online giving options are being finalized.</strong></p><p class="mini">KMI will publish the approved donation pathway here once the provider account is active.</p><a class="btn ghost" href="connect.html#contact">Contact KMI about giving</a>';
    setStatus('givebutter-status', 'KMI is finalizing its approved online giving pathway.');
  }
})();
