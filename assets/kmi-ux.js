(() => {
  const page = document.body.dataset.page || 'home';
  const publicPages = new Set(['home', 'about', 'resources', 'edu', 'outreach', 'connect']);
  if (!publicPages.has(page)) return;

  const nav = document.querySelector('.nav-links');
  document.querySelectorAll('a[data-nav="brochure"], .nav-links a[href$="brochure.html"]').forEach((link) => link.remove());

  if (nav && !nav.querySelector('[data-nav="connect"]')) {
    const connectLink = document.createElement('a');
    connectLink.href = 'connect.html';
    connectLink.dataset.nav = 'connect';
    connectLink.className = 'nav-primary-action';
    connectLink.textContent = 'Connect';
    if (page === 'connect') connectLink.classList.add('active');
    nav.appendChild(connectLink);
  }

  const navbar = document.querySelector('.navbar');
  if (navbar && nav && !navbar.querySelector('.nav-menu-toggle')) {
    nav.id = nav.id || 'primaryNavigation';
    const menuButton = document.createElement('button');
    menuButton.type = 'button';
    menuButton.className = 'nav-menu-toggle';
    menuButton.setAttribute('aria-controls', nav.id);
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = '<span aria-hidden="true">☰</span><span>Menu</span>';
    navbar.insertBefore(menuButton, nav);
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.querySelector('span[aria-hidden="true"]').textContent = open ? '×' : '☰';
    });
  }

  function actionCard(icon, title, copy, topic, fallbackHref) {
    return `
      <article class="card kmi-action-card">
        <div class="icon" aria-hidden="true">${icon}</div>
        <h3>${title}</h3>
        <p>${copy}</p>
        <a class="btn ${title === 'Get Help' ? 'gold' : 'ghost'}" href="${fallbackHref}" data-kmi-chat-topic="${topic}">${title}</a>
      </article>`;
  }

  if (page === 'home' && !document.querySelector('#kmi-action-hub')) {
    const hero = document.querySelector('main .hero');
    if (hero) {
      const hub = document.createElement('section');
      hub.id = 'kmi-action-hub';
      hub.className = 'section kmi-action-hub';
      hub.setAttribute('aria-labelledby', 'kmi-action-heading');
      hub.innerHTML = `
        <div class="container section-heading">
          <div class="eyebrow">Choose your next step</div>
          <h2 id="kmi-action-heading">How can KMI support or connect with you?</h2>
          <p class="muted">Start with the path that best fits your need. The KMI Support Assistant will organize your request so the right ministry area can follow up when the live CRM connection is activated.</p>
        </div>
        <div class="container grid-4 kmi-action-grid">
          ${actionCard('🧭', 'Get Help', 'Request guidance about resources, referrals, housing, food support, counseling, or other needs.', 'Resources', 'connect.html#get-help')}
          ${actionCard('🙌', 'Volunteer', 'Share how you would like to serve through food distribution, outreach, fellowship, or mission support.', 'Volunteer Opportunities', 'connect.html#volunteer')}
          ${actionCard('🤝', 'Partner', 'Connect an organization, ministry, educator, or community program with KMI.', 'Community Partners', 'connect.html#partner')}
          ${actionCard('💬', 'Contact KMI', 'Ask a general question or request a conversation with the appropriate KMI ministry area.', 'Other', 'connect.html#contact')}
        </div>`;
      hero.insertAdjacentElement('afterend', hub);
    }
  }

  if (page === 'resources') {
    const heading = document.querySelector('main .section .section-heading');
    if (heading && !heading.querySelector('[data-kmi-chat-topic]')) {
      heading.id = 'get-help';
      heading.insertAdjacentHTML(
        'beforeend',
        '<div class="hero-actions"><a class="btn gold" href="connect.html#get-help" data-kmi-chat-topic="Resources">Request Resource Guidance</a><a class="btn ghost" href="connect.html#contact" data-kmi-chat-topic="Other">Ask KMI a Question</a></div>'
      );
    }
  }

  if (page === 'outreach') {
    document.querySelectorAll('main article.card').forEach((card) => {
      const title = card.querySelector('h3')?.textContent.trim();
      if (title === 'Community Partners' && !card.querySelector('[data-kmi-chat-topic]')) {
        card.id = 'partner';
        card.insertAdjacentHTML('beforeend', '<a class="btn ghost" href="connect.html#partner" data-kmi-chat-topic="Community Partners">Become a Community Partner</a>');
      }
      if (title === 'Volunteer Opportunities' && !card.querySelector('[data-kmi-chat-topic]')) {
        card.id = 'volunteer';
        card.insertAdjacentHTML('beforeend', '<a class="btn gold" href="connect.html#volunteer" data-kmi-chat-topic="Volunteer Opportunities">Volunteer with KMI</a>');
      }
    });
  }

  const footerContainer = document.querySelector('.footer .container');
  if (footerContainer && !footerContainer.querySelector('.footer-action-nav')) {
    const actionNav = document.createElement('nav');
    actionNav.className = 'footer-action-nav';
    actionNav.setAttribute('aria-label', 'Get help and connect with KMI');
    actionNav.innerHTML = `
      <strong>Connect with KMI</strong>
      <a href="connect.html#get-help">Get Help</a>
      <a href="connect.html#volunteer">Volunteer</a>
      <a href="connect.html#partner">Partner</a>
      <a href="connect.html#contact">Contact KMI</a>`;
    footerContainer.prepend(actionNav);
  }

  if (!document.querySelector('#kmi-ux-styles')) {
    const style = document.createElement('style');
    style.id = 'kmi-ux-styles';
    style.textContent = `
      .nav-primary-action{background:linear-gradient(135deg,#f8e8a5,#d5a83a 55%,#8f6420)!important;color:#2b1d0a!important;box-shadow:0 8px 20px rgba(143,100,32,.22)}
      .nav-menu-toggle{display:none;align-items:center;gap:8px;border:1px solid rgba(59,42,23,.18);background:#fffaf2;color:#3b2a17;border-radius:999px;padding:10px 14px;font:inherit;font-weight:900;cursor:pointer}
      .grid-4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
      .kmi-action-hub{background:linear-gradient(180deg,rgba(255,250,242,.78),rgba(248,232,165,.18));border-bottom:1px solid rgba(59,42,23,.12)}
      .kmi-action-card{display:flex;flex-direction:column;align-items:flex-start}
      .kmi-action-card p{flex:1}
      .footer-action-nav{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;margin:0 0 18px;padding:0 0 16px;border-bottom:1px solid rgba(255,255,255,.18)}
      .footer-action-nav strong{width:100%;color:#fff3c4}
      .footer-action-nav a{color:#f8e8a5;font-weight:800;text-decoration:none}
      .footer-action-nav a:hover,.footer-action-nav a:focus-visible{text-decoration:underline}
      .connect-notice{margin-top:22px}
      @media(max-width:1000px){.grid-4{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:900px){
        .navbar{display:grid!important;grid-template-columns:1fr auto!important;align-items:center!important;width:min(1120px,calc(100% - 36px))!important}
        .brand{min-width:0}
        .brand img{max-width:64vw}
        .nav-menu-toggle{display:inline-flex}
        .nav-links{display:none!important;grid-column:1/-1;width:100%;flex-direction:column;align-items:stretch;padding:10px 0 4px}
        .nav-links.open{display:flex!important}
        .nav-links a{text-align:center}
      }
      @media(max-width:620px){.grid-4{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-kmi-chat-topic]');
    if (!trigger) return;
    event.preventDefault();
    const topic = trigger.dataset.kmiChatTopic || 'Other';
    if (typeof window.openKmiChat === 'function') {
      window.openKmiChat(topic);
    } else {
      window.kmiPendingChatTopic = topic;
    }
  });

  const hashTopics = {
    '#get-help': 'Resources',
    '#volunteer': 'Volunteer Opportunities',
    '#partner': 'Community Partners',
    '#contact': 'Other'
  };
  if (hashTopics[window.location.hash]) window.kmiPendingChatTopic = hashTopics[window.location.hash];

  const existingChatbotScript = Array.from(document.scripts).some((script) =>
    script.src.endsWith('/assets/chatbot.js') || script.src.endsWith('assets/chatbot.js')
  );
  if (!existingChatbotScript) {
    const chatbotScript = document.createElement('script');
    chatbotScript.src = 'assets/chatbot.js';
    chatbotScript.dataset.kmiChatbot = 'true';
    document.body.appendChild(chatbotScript);
  } else if (window.kmiPendingChatTopic && typeof window.openKmiChat === 'function') {
    const pendingTopic = window.kmiPendingChatTopic;
    delete window.kmiPendingChatTopic;
    window.openKmiChat(pendingTopic);
  }
})();