(() => {
  if (document.querySelector('.kmi-chat-toggle')) return;

  const storageKey = 'kmiChatLeads';
  const css = `
    .kmi-chat-toggle{position:fixed;right:18px;bottom:18px;z-index:9999;border:0;border-radius:999px;background:linear-gradient(135deg,#f8e8a5,#d5a83a 55%,#8f6420);color:#241504;font-weight:900;padding:14px 18px;box-shadow:0 18px 40px rgba(0,0,0,.25);cursor:pointer}
    .kmi-chat{position:fixed;right:18px;bottom:76px;z-index:9999;width:min(410px,calc(100vw - 36px));background:#fffaf2;border:1px solid rgba(59,42,23,.18);border-radius:22px;box-shadow:0 22px 60px rgba(0,0,0,.28);overflow:hidden;display:none;color:#2b241b}
    .kmi-chat.open{display:block}.kmi-chat-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;background:#2d2419;color:#f8e8a5;padding:14px 16px}.kmi-chat-head strong{display:block;font-family:Georgia,serif;font-size:18px}.kmi-chat-head span{display:block;font-size:12px;line-height:1.3;margin-top:3px;color:#fff3c4}.kmi-chat-close{border:0;background:transparent;color:#fff3c4;font-size:24px;line-height:1;cursor:pointer;padding:0 2px}.kmi-chat-body{padding:14px 16px;max-height:min(570px,70vh);overflow:auto}.kmi-chat-msg{border-radius:16px;padding:10px 12px;margin:8px 0;font-size:14px;line-height:1.4}.kmi-chat-msg.bot{background:#f1e6d4}.kmi-chat-msg.user{background:#e5eddc;margin-left:35px}.kmi-chat-msg strong{display:block;margin-bottom:4px}.kmi-chat-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.kmi-chat-actions button{border:1px solid rgba(59,42,23,.18);background:#fff;border-radius:14px;padding:9px 10px;text-align:left;font-weight:800;cursor:pointer}.kmi-chat-actions button:hover,.kmi-chat-actions button:focus-visible{background:#fbf0d5}.kmi-chat-form{display:grid;gap:8px;margin-top:12px}.kmi-chat-form input,.kmi-chat-form select,.kmi-chat-form textarea{width:100%;padding:10px;border-radius:12px;border:1px solid rgba(59,42,23,.22);font:inherit}.kmi-chat-form textarea{min-height:80px}.kmi-chat-form button{border:0;border-radius:999px;padding:11px 14px;background:#3f4a35;color:#fff;font-weight:900;cursor:pointer}.kmi-chat-small{font-size:12px;color:#6b5f4e;margin-top:8px}.kmi-chat-status{background:#fff3c4;border:1px solid rgba(143,100,32,.25);border-radius:12px;padding:9px 10px;font-size:12px;line-height:1.4;color:#563d17}
    @media(max-width:520px){.kmi-chat{right:10px;bottom:70px;width:calc(100vw - 20px)}.kmi-chat-toggle{right:10px;bottom:10px}.kmi-chat-actions{grid-template-columns:1fr}}
  `;

  const responses = {
    'About KMI': 'Kingdom Missions International is a faith-centered religious order and educational society dedicated to honoring God by serving humanity, sharing spiritual truth, and offering high-quality education.',
    Mission: 'Guided by faith, KMI empowers communities through counseling, education, essential resources, and vital referrals to foster hope, dignity, and self-sufficiency for all.',
    Vision: 'KMI’s vision is to ignite hope and cultivate lasting transformation across neighborhoods, nations, and the world through unconditional love, empathy, and active compassion.',
    'Servant Leaders': 'Marc and Helen are a living testament to faith in action. United by their love for God and their missionary calling, they serve vulnerable communities and nurture spiritual growth.',
    Resources: 'KMI’s resource areas include housing referrals, food distribution, scholarship support, life coaching, biblical counseling, and community resource connections.',
    Housing: 'KMI seeks to walk alongside unhoused individuals, veterans, and community members by connecting them with trusted housing resources and referral pathways.',
    'Food Distribution': 'KMI supports neighbors facing hunger through food distribution, practical care, and community relationships.',
    Education: 'KMI is developing affordable degree and certification pathways, including Religion, Business, Chaplaincy, and Biblical Counseling.',
    Outreach: 'KMI outreach includes food distribution, community fellowship, volunteer service, education, and international mission support.',
    'Community Partners': 'KMI welcomes conversations with ministries, educators, service providers, nonprofits, and community organizations that share a people-first approach.',
    'Volunteer Opportunities': 'KMI welcomes people with a gentle spirit and a service mindset who want to support outreach, food distribution, fellowship, education, or mission work.',
    Other: 'Share your question below and choose the closest topic. This prototype will demonstrate how the request is categorized for future KMI follow-up.'
  };

  const topicMap = {
    'About KMI': 'Other',
    Mission: 'Ministry',
    Vision: 'Ministry',
    'Servant Leaders': 'Ministry',
    Resources: 'Resources',
    Housing: 'Resources',
    'Food Distribution': 'Resources',
    Education: 'Education',
    Outreach: 'Outreach',
    'Community Partners': 'Community Partners',
    'Volunteer Opportunities': 'Volunteer Opportunities',
    Other: 'Other'
  };

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'kmi-chat-toggle';
  toggle.textContent = 'Connect with KMI';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'kmiSupportAssistant');

  const chat = document.createElement('section');
  chat.className = 'kmi-chat';
  chat.id = 'kmiSupportAssistant';
  chat.setAttribute('aria-label', 'KMI Support Assistant');
  chat.innerHTML = `
    <div class="kmi-chat-head">
      <div><strong>KMI Support Assistant</strong><span>Resources, volunteering, partnerships, education, outreach, and ministry questions.</span></div>
      <button class="kmi-chat-close" type="button" aria-label="Close KMI Support Assistant">×</button>
    </div>
    <div class="kmi-chat-body" id="kmiChatBody">
      <div class="kmi-chat-msg bot">Welcome to Kingdom Missions International. Choose a path below or describe what you need.</div>
      <div class="kmi-chat-actions">
        <button type="button" data-topic="Resources">Get resource guidance</button>
        <button type="button" data-topic="Volunteer Opportunities">Volunteer with KMI</button>
        <button type="button" data-topic="Community Partners">Discuss a partnership</button>
        <button type="button" data-topic="Education">Education questions</button>
        <button type="button" data-topic="Outreach">Outreach and missions</button>
        <button type="button" data-topic="Other">Contact KMI</button>
      </div>
      <form class="kmi-chat-form" id="kmiChatForm">
        <input name="name" autocomplete="name" placeholder="Your name" required>
        <input name="email" type="email" autocomplete="email" placeholder="Email" required>
        <input name="phone" autocomplete="tel" placeholder="Phone optional">
        <select name="topic" aria-label="Inquiry topic">
          <option>Resources</option>
          <option>Ministry</option>
          <option>Education</option>
          <option>Outreach</option>
          <option>Community Partners</option>
          <option>Volunteer Opportunities</option>
          <option>Giving</option>
          <option>Las Vegas Outreach</option>
          <option>Philippines Missions</option>
          <option>Other</option>
        </select>
        <textarea name="message" placeholder="Briefly tell us what you need, what you want to learn, or how you want to help." required></textarea>
        <button type="submit">Save Prototype Inquiry</button>
      </form>
      <p class="kmi-chat-status"><strong>Prototype notice:</strong> This demonstration stores the inquiry only in this browser. It does not yet email or transmit your information to KMI. Secure CRM delivery must be connected before public launch.</p>
    </div>`;

  document.body.appendChild(toggle);
  document.body.appendChild(chat);

  const closeButton = chat.querySelector('.kmi-chat-close');
  const body = chat.querySelector('#kmiChatBody');
  const form = chat.querySelector('#kmiChatForm');
  const topicSelect = chat.querySelector("select[name='topic']");

  function setOpen(open) {
    chat.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) chat.querySelector('button, input, select, textarea')?.focus();
  }

  function addMessage(kind, text, title = '') {
    const message = document.createElement('div');
    message.className = `kmi-chat-msg ${kind}`;
    if (title) {
      const heading = document.createElement('strong');
      heading.textContent = title;
      message.appendChild(heading);
    }
    message.appendChild(document.createTextNode(text));
    body.insertBefore(message, form);
    body.scrollTop = body.scrollHeight;
  }

  function selectTopic(topic, announce = true) {
    const mappedTopic = topicMap[topic] || topic || 'Other';
    const option = Array.from(topicSelect.options).find((item) => item.value === mappedTopic || item.textContent === mappedTopic);
    topicSelect.value = option ? option.value || option.textContent : 'Other';
    if (announce) addMessage('bot', responses[topic] || responses[mappedTopic] || responses.Other, topic || mappedTopic);
  }

  window.openKmiChat = (topic = 'Other') => {
    setOpen(true);
    selectTopic(topic, true);
  };

  toggle.addEventListener('click', () => setOpen(!chat.classList.contains('open')));
  closeButton.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && chat.classList.contains('open')) setOpen(false);
  });

  chat.querySelectorAll('[data-topic]').forEach((button) => {
    button.addEventListener('click', () => {
      const topic = button.dataset.topic || 'Other';
      addMessage('user', button.textContent.trim());
      selectTopic(topic, true);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entry = {
      date: new Date().toISOString(),
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      topic: formData.get('topic') || '',
      message: formData.get('message') || '',
      status: 'Prototype inquiry saved locally'
    };
    const rows = JSON.parse(localStorage.getItem(storageKey) || '[]');
    rows.push(entry);
    localStorage.setItem(storageKey, JSON.stringify(rows));
    addMessage('bot', 'Your prototype inquiry was saved in this browser for demonstration. It was not transmitted to KMI.');
    event.currentTarget.reset();
  });

  if (window.kmiPendingChatTopic) {
    const pendingTopic = window.kmiPendingChatTopic;
    delete window.kmiPendingChatTopic;
    window.openKmiChat(pendingTopic);
  }
})();