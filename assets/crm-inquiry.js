(() => {
  const form = document.getElementById('kmi-inquiry-form');
  if (!form) return;
  const status = document.getElementById('kmi-inquiry-status');
  let captchaToken = '';
  let widgetId = null;
  const say = (message) => { status.textContent = message; };
  const validTopics = new Set(['Resource Guidance', 'Volunteer', 'Community Partnership', 'Education', 'General Inquiry']);
  document.querySelectorAll('[data-inquiry-topic]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const topic = link.dataset.inquiryTopic;
      if (!validTopics.has(topic)) return;
      const select = form.elements.topic;
      if (select) select.value = topic;
      const heading = document.getElementById('online-inquiry-heading');
      if (!form.hidden) {
        event.preventDefault();
        heading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const message = form.elements.message;
        if (message) setTimeout(() => message.focus({ preventScroll: true }), 250);
        say('You selected ' + topic + '. Complete the form to send your inquiry to KMI.');
      } else {
        say('The online form is currently unavailable. Please email info@KingdomMissionsGlobal.org.');
      }
    });
  });
  async function initialize() {
    try {
      const response = await fetch('/api/crm/config', { cache: 'no-store' });
      if (!response.ok) return;
      const config = await response.json();
      if (!config.enabled || !config.site_key) return;
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => {
        widgetId = window.turnstile.render('#kmi-inquiry-turnstile', {
          sitekey: config.site_key,
          callback: (token) => { captchaToken = token; },
          'expired-callback': () => { captchaToken = ''; },
          'error-callback': () => { captchaToken = ''; }
        });
        form.hidden = false;
      };
      document.head.appendChild(script);
    } catch {
      // Existing email options remain available when the integration is offline.
    }
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!captchaToken) { say('Complete the security verification to send your inquiry.'); return; }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    say('Sending your inquiry...');
    const data = Object.fromEntries(new FormData(form).entries());
    data.contact_consent = Boolean(form.elements.contact_consent.checked);
    data.turnstile_token = captchaToken;
    try {
      const response = await fetch('/api/crm/inquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your inquiry.');
      say('Thank you. Your inquiry has been received. Reference: ' + result.reference);
      form.reset();
      form.elements.topic.value = 'General Inquiry';
    } catch (error) {
      say(error.message + ' You can also use the email links above.');
    } finally {
      captchaToken = '';
      if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
      button.disabled = false;
    }
  });
  initialize();
})();