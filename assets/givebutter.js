(() => {
  const BACKEND = 'https://kmi.the-velasquez-law.workers.dev';
  const FALLBACK = 'https://givebutter.com/support-mission-outreach-and-community-care-uq1gzf';

  function extractScriptSrc(value) {
    if (!value) return null;
    const text = String(value).trim();
    if (/^https:\/\/widgets\.givebutter\.com\//i.test(text)) return text;
    const match = text.match(/<script[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : null;
  }

  function extractWidgetMarkup(value) {
    if (!value) return null;
    const text = String(value).trim();
    const match = text.match(/<givebutter-[\s\S]*?<\/givebutter-[^>]+>/i)
      || text.match(/<givebutter-widget[^>]*><\/givebutter-widget>/i);
    if (match) return match[0];

    // Givebutter widget IDs are public identifiers. If only the ID is stored
    // in Cloudflare, turn it into the standard widget element.
    if (/^[A-Za-z0-9_-]{4,}$/.test(text)) {
      return `<givebutter-widget id="${text}"></givebutter-widget>`;
    }
    return null;
  }

  function ensureLibrary(src) {
    if (!src) throw new Error('Givebutter widget library is not configured.');
    const absolute = new URL(src, window.location.href).href;
    const existing = [...document.scripts].find((script) => script.src === absolute);
    if (existing) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Givebutter widget library failed to load.'));
      document.head.appendChild(script);
    });
  }

  function fallback(container, label = 'Donate Now') {
    if (!container) return;
    container.innerHTML = `<a class="btn gold" href="${FALLBACK}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  }

  function mount(container, rawValue) {
    if (!container) return;
    const markup = extractWidgetMarkup(rawValue);
    if (!markup) throw new Error('Givebutter widget markup is not configured.');
    container.innerHTML = markup;
  }

  async function init() {
    const buttonHost = document.querySelector('[data-givebutter-button]');
    const formHost = document.querySelector('[data-givebutter-form]');
    if (!buttonHost && !formHost) return;

    try {
      const response = await fetch(`${BACKEND}/api/public-config`, {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error(`Config request failed: ${response.status}`);

      const config = await response.json();
      const buttonValue = config?.givebutter?.donationButton || '';
      const formValue = config?.givebutter?.donationForm || '';
      const libraryValue = config?.givebutter?.widgetLibrary || '';

      const librarySrc =
        extractScriptSrc(libraryValue)
        || extractScriptSrc(buttonValue)
        || extractScriptSrc(formValue);

      await ensureLibrary(librarySrc);
      if (buttonHost) mount(buttonHost, buttonValue);
      if (formHost) mount(formHost, formValue);
    } catch (error) {
      console.error('Givebutter widget initialization failed.', error);
      fallback(buttonHost);
      fallback(formHost, 'Open Secure Donation Form');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
