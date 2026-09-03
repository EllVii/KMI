(() => {
  if (window.__kmiSupportAssistantLoaded) return;
  window.__kmiSupportAssistantLoaded = true;

  const email = 'info@KingdomMissionsGlobal.org';
  const topics = {
    resources: {
      label: 'Get help or find resources',
      response: 'KMI provides community resource guidance and referrals related to housing, food support, life coaching, biblical counseling, scholarships, and other pathways toward stability.',
      href: 'connect.html#get-help',
      action: 'Request resource guidance'
    },
    volunteer: {
      label: 'Volunteer with KMI',
      response: 'KMI welcomes people who want to serve through food distribution, community outreach, fellowship, teaching, administration, and mission support.',
      href: 'connect.html#volunteer',
      action: 'See volunteer options'
    },
    partner: {
      label: 'Become a community partner',
      response: 'Churches, ministries, nonprofits, schools, businesses, and community programs can connect with KMI to explore cooperative service and outreach.',
      href: 'connect.html#partner',
      action: 'Explore partnership'
    },
    education: {
      label: 'Ask about education',
      response: 'KMI provides information about faith-based degree pathways, chaplaincy, biblical counseling, and service-centered certification opportunities.',
      href: 'connect.html#education',
      action: 'Ask about education'
    },
    outreach: {
      label: 'Learn about outreach',
      response: 'KMI outreach includes food relief, fellowship, volunteer service, teaching, community partnerships, and local and international mission work.',
      href: 'outreach.html',
      action: 'View outreach'
    },
    give: {
      label: 'Give or support KMI',
      response: 'KMI’s giving page explains current donation, partnership, and volunteer pathways. Payment processing is handled by approved third-party providers when those options are active.',
      href: 'give.html',
      action: 'View giving options'
    },
    faq: {
      label: 'Get a quick answer',
      response: 'KMI’s Questions & Answers page gives concise information about the ministry, service area, resources, education, volunteering, partnerships, giving, and contact options.',
      href: 'faq.html',
      action: 'Read KMI answers'
    },
    about: {
      label: 'Learn about KMI',
      response: 'Kingdom Missions International is a faith-centered ministry based in Las Vegas, serving communities through resources, education, outreach, referrals, volunteer opportunities, partnerships, and mission support.',
      href: 'about.html',
      action: 'About KMI'
    }
  };

  const css = `
    .kmi-chat-toggle{position:fixed;right:18px;bottom:18px;z-index:9999;border:0;border-radius:999px;background:linear-gradient(135deg,#f8e8a5,#d5a83a 55%,#8f6420);color:#241504;font-weight:900;padding:13px 17px;box-shadow:0 18px 40px rgba(0,0,0,.25);cursor:pointer;min-height:46px}
    .kmi-chat{position:fixed;right:18px;bottom:78px;z-index:9999;width:min(390px,calc(100vw - 36px));max-height:min(650px,calc(100vh - 112px));background:#fffaf2;border:1px solid rgba(59,42,23,.18);border-radius:22px;box-shadow:0 22px 60px rgba(0,0,0,.28);overflow:hidden;display:none;color:#2b241b}
    .kmi-chat.open{display:block}.kmi-chat-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;background:#2d2419;color:#f8e8a5;padding:14px 16px}.kmi-chat-head strong{display:block;font-family:Georgia,serif;font-size:18px}.kmi-chat-head span{display:block;font-size:12px;line-height:1.35;margin-top:3px;color:#fff3c4}.kmi-chat-close{border:0;background:transparent;color:#fff3c4;font-size:24px;line-height:1;cursor:pointer;padding:2px 5px;border-radius:8px}.kmi-chat-body{padding:14px 16px;max-height:min(560px,calc(100vh - 190px));overflow:auto}.kmi-chat-msg{border-radius:16px;padding:10px 12px;margin:8px 0;font-size:14px;line-height:1.45}.kmi-chat-msg.bot{background:#f1e6d4}.kmi-chat-msg strong{display:block;margin-bottom:4px}.kmi-chat-actions{display:grid;gap:8px;margin:12px 0}.kmi-chat-actions button{border:1px solid rgba(59,42,23,.18);background:#fff;border-radius:14px;padding:10px 12px;text-align:left;font-weight:800;cursor:pointer;color:#2b241b}.kmi-chat-actions button:hover,.kmi-chat-actions button:focus-visible{background:#fbf0d5}.kmi-chat-result{margin-top:10px;padding-top:10px;border-top:1px solid rgba(59,42,23,.14)}.kmi-chat-link{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:10px 13px;background:#3f4a35;color:#fff!important;text-decoration:none;font-weight:900}.kmi-chat-secondary{display:inline-block;margin:10px 0 0;color:#563d17;font-weight:800}.kmi-chat-small{font-size:12px;color:#6b5f4e;margin:12px 0 0;padding-top:10px;border-top:1px solid rgba(59,42,23,.12)}
    @media(max-width:560px){.kmi-chat-toggle{right:12px;bottom:12px}.kmi-chat{right:12px;bottom:70px;width:calc(100vw - 24px)}}
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'kmi-chat-toggle';
  toggle.textContent = 'How can we help?';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'kmiSupportAssistant');

  const chat = document.createElement('section');
  chat.className = 'kmi-chat';
  chat.id = 'kmiSupportAssistant';
  chat.setAttribute('role', 'dialog');
  chat.setAttribute('aria-label', 'KMI Support Assistant');
  chat.innerHTML = `
    <div class="kmi-chat-head">
      <div><strong>KMI Support Assistant</strong><span>Choose what you need and we’ll point you to the right KMI page.</span></div>
      <button class="kmi-chat-close" type="button" aria-label="Close KMI Support Assistant">×</button>
    </div>
    <div class="kmi-chat-body">
      <div class="kmi-chat-msg bot">Welcome to Kingdom Missions International. What would you like help with?</div>
      <div class="kmi-chat-actions">
        ${Object.entries(topics).map(([key, topic]) => `<button type="button" data-topic="${key}">${topic.label}</button>`).join('')}
      </div>
      <div class="kmi-chat-result" aria-live="polite"></div>
      <p class="kmi-chat-small">This assistant does not collect or store personal information. For a direct inquiry, use <a href="connect.html#contact">KMI Connect</a> or email <a href="mailto:${email}">${email}</a>.</p>
    </div>`;

  document.body.appendChild(toggle);
  document.body.appendChild(chat);

  const closeButton = chat.querySelector('.kmi-chat-close');
  const result = chat.querySelector('.kmi-chat-result');

  function setOpen(open) {
    chat.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) closeButton.focus();
  }

  function showTopic(key) {
    const topic = topics[key];
    if (!topic) return;
    result.innerHTML = `<div class="kmi-chat-msg bot"><strong>${topic.label}</strong>${topic.response}</div><a class="kmi-chat-link" href="${topic.href}">${topic.action}</a><br><a class="kmi-chat-secondary" href="mailto:${email}?subject=${encodeURIComponent(`KMI ${topic.label}`)}">Email KMI about this</a>`;
  }

  toggle.addEventListener('click', () => setOpen(!chat.classList.contains('open')));
  closeButton.addEventListener('click', () => {
    setOpen(false);
    toggle.focus();
  });
  chat.querySelectorAll('[data-topic]').forEach((button) => {
    button.addEventListener('click', () => showTopic(button.dataset.topic));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && chat.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.openKmiChat = (topic = 'resources') => {
    setOpen(true);
    showTopic(topic);
  };
})();
