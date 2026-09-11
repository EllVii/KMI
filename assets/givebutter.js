(() => {
  const BACKEND = 'https://kmi.the-velasquez-law.workers.dev';

  function extractScriptSrc(value) {
    if (!value) return null;
    const match = String(value).match(/<script[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : null;
  }

  function extractWidgetMarkup(value) {
    if (!value) return null;
    const text = String(value).trim();
    const match = text.match(/<givebutter-[\s\S]*?<\/givebutter-[^>]+>/i)
      || text.match(/<givebutter-widget[^>]*><\/givebutter-widget>/i);
    if (match) return match[0];
    if (/^[A-Za-z0-9_-]{4,}$/.test(text)) {
      return `<givebutter-widget id="${text}"></givebutter-widget>`;
    }
    return null;
  }

  function ensureLibrary(src) {
    if (!src) return Promise.resolve();
    const existing = [...document.scripts].find(s => s.src === src);
    if (existing) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function mount(container, rawValue, fallbackHref) {
    if (!container) return;
    const markup = extractWidgetMarkup(rawValue);
    if (markup) {
      container.innerHTML = markup;
      return;
    }
    if (fallbackHref) {
      container.innerHTML = `<a class="btn gold" href="${fallbackHref}" target="_blank" rel="noopener noreferrer">Donate Now</a>`;
    }
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

      const librarySrc = extractScriptSrc(buttonValue) || extractScriptSrc(formValue);
      await ensureLibrary(librarySrc);

      mount(
        buttonHost,
        buttonValue,
        'https://givebutter.com/support-mission-outreach-and-community-care-uq1gzf'
      );
      mount(
        formHost,
        formValue,
        'https://givebutter.com/support-mission-outreach-and-community-care-uq1gzf'
      );
    } catch (error) {
      console.error('Givebutter widget initialization failed.', error);
      mount(
        buttonHost,
        '',
        'https://givebutter.com/support-mission-outreach-and-community-care-uq1gzf'
      );
      mount(
        formHost,
        '',
        'https://givebutter.com/support-mission-outreach-and-community-care-uq1gzf'
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
