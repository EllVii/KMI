(() => {
  const storageKey = "kmiChatLeads";
  const css = `
    .kmi-chat-toggle{position:fixed;right:18px;bottom:18px;z-index:9999;border:0;border-radius:999px;background:linear-gradient(135deg,#f8e8a5,#d5a83a 55%,#8f6420);color:#241504;font-weight:900;padding:14px 18px;box-shadow:0 18px 40px rgba(0,0,0,.25);cursor:pointer}
    .kmi-chat{position:fixed;right:18px;bottom:76px;z-index:9999;width:min(390px,calc(100vw - 36px));background:#fffaf2;border:1px solid rgba(59,42,23,.18);border-radius:22px;box-shadow:0 22px 60px rgba(0,0,0,.28);overflow:hidden;display:none;color:#2b241b}
    .kmi-chat.open{display:block}.kmi-chat-head{background:#2d2419;color:#f8e8a5;padding:14px 16px}.kmi-chat-head strong{display:block;font-family:Georgia,serif;font-size:18px}.kmi-chat-head span{display:block;font-size:12px;line-height:1.3;margin-top:3px;color:#fff3c4}.kmi-chat-body{padding:14px 16px;max-height:520px;overflow:auto}.kmi-chat-msg{border-radius:16px;padding:10px 12px;margin:8px 0;font-size:14px;line-height:1.35}.kmi-chat-msg.bot{background:#f1e6d4}.kmi-chat-msg.user{background:#e5eddc;margin-left:35px}.kmi-chat-msg strong{display:block;margin-bottom:4px}.kmi-chat-actions{display:grid;gap:8px;margin:10px 0}.kmi-chat-actions button{border:1px solid rgba(59,42,23,.18);background:#fff;border-radius:999px;padding:9px 10px;text-align:left;font-weight:800;cursor:pointer}.kmi-chat-actions button:hover{background:#fbf0d5}.kmi-chat-form{display:grid;gap:8px;margin-top:10px}.kmi-chat-form input,.kmi-chat-form select,.kmi-chat-form textarea{width:100%;padding:10px;border-radius:12px;border:1px solid rgba(59,42,23,.22);font:inherit}.kmi-chat-form textarea{min-height:70px}.kmi-chat-form button{border:0;border-radius:999px;padding:11px 14px;background:#3f4a35;color:#fff;font-weight:900;cursor:pointer}.kmi-chat-small{font-size:12px;color:#6b5f4e;margin-top:8px}
  `;

  const responses = {
    "About KMI": "At Kingdom Missions International, the heart of the ministry is to love God and serve all people by sharing the life-changing Gospel of Jesus Christ. KMI provides hope, guidance, and spiritual growth through the truth of Scripture to anyone in need.",
    "Mission": "KMI’s mission is to restore marriages and heal families through Christ-centered counseling by creating a safe, compassionate, and faith-centered space where individuals can openly express and navigate life’s challenges.",
    "Vision": "KMI’s vision is to educate and train people in biblical truth and principles, using practical tools and spiritual wisdom while equipping others to do the same through the love of Jesus Christ in action.",
    "Servant Leaders": "Brother Marc and Sister Helen have been married for over seven years and both have a love for God and serving others. In 1994, Marc’s grandmother shared that he should not be surprised if he were to become a preacher or pastor one day, reflecting an early sense of calling. Sister Helen, a native of the Philippines, carries a deep passion for praise, worship, giving, and service.",
    "Resources": "KMI resources include housing referrals, food distribution, scholarship association support, life coaching, biblical counseling, and resource guides. Resource Guides are marked Coming Soon.",
    "Housing": "KMI believes safe, stable housing is a fundamental right for every individual who has served our country or calls the community home. KMI works as a resource and referral agency for unhoused individuals and homeless veterans.",
    "Food Distribution": "KMI’s food distribution focus is to alleviate food insecurity by providing equitable access to nutritious groceries while connecting individuals to essential social services, housing support, and financial resources.",
    "Education": "KMI helps connect people with degree opportunities, including Associate, Bachelor’s, Master’s, and Doctorate pathways. Education may include Religion or Business degrees, plus certifications such as Chaplaincy or Biblical Counseling.",
    "Outreach": "KMI outreach is grounded in service, humility, and fellowship—meeting people where they are while guiding them toward healing, accountability, and sustainable growth. Outreach includes food distribution, community partners, and volunteer opportunities.",
    "Community Partners": "KMI is looking for like-minded organizations that understand teamwork and cooperation for the greater good of humanity.",
    "Volunteer Opportunities": "If you have a people-first mindset and a gentle spirit, KMI welcomes partners who want to serve in cooperation with others for the enrichment of all.",
    "Brochure": "The KMI brochure is currently TBD and marked Coming Soon."
  };

  const topicMap = {
    "About KMI": "Other",
    "Mission": "Ministry",
    "Vision": "Ministry",
    "Servant Leaders": "Ministry",
    "Resources": "Resources",
    "Housing": "Resources",
    "Food Distribution": "Resources",
    "Education": "Education",
    "Outreach": "Outreach",
    "Community Partners": "Outreach",
    "Volunteer Opportunities": "Outreach",
    "Brochure": "Other"
  };

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const toggle = document.createElement("button");
  toggle.className = "kmi-chat-toggle";
  toggle.textContent = "Need help?";

  const chat = document.createElement("section");
  chat.className = "kmi-chat";
  chat.innerHTML = `
    <div class="kmi-chat-head"><strong>KMI Support Assistant</strong><span>Faith-centered support, outreach, education, resources, and referrals.</span></div>
    <div class="kmi-chat-body" id="kmiChatBody">
      <div class="kmi-chat-msg bot">Hi, welcome to Kingdom Missions International. Choose a topic below, or send KMI your question through the form.</div>
      <div class="kmi-chat-actions">
        <button data-topic="About KMI">About KMI</button>
        <button data-topic="Mission">Mission</button>
        <button data-topic="Vision">Vision</button>
        <button data-topic="Servant Leaders">Servant Leaders</button>
        <button data-topic="Resources">Resources and referrals</button>
        <button data-topic="Housing">Housing</button>
        <button data-topic="Food Distribution">Food Distribution</button>
        <button data-topic="Education">Education</button>
        <button data-topic="Outreach">Outreach</button>
        <button data-topic="Volunteer Opportunities">Volunteer Opportunities</button>
        <button data-topic="Brochure">Brochure</button>
      </div>
      <form class="kmi-chat-form" id="kmiChatForm">
        <input name="name" placeholder="Your name" required>
        <input name="email" type="email" placeholder="Email" required>
        <input name="phone" placeholder="Phone optional">
        <select name="topic">
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
        <textarea name="message" placeholder="Briefly tell us what you need, what you want to learn, or how you want to help."></textarea>
        <button type="submit">Send to KMI demo CRM</button>
      </form>
      <p class="kmi-chat-small">Prototype only. A live version would route this to the secure KMI CRM/dashboard.</p>
    </div>`;

  document.body.appendChild(toggle);
  document.body.appendChild(chat);
  toggle.addEventListener("click", () => chat.classList.toggle("open"));

  const body = chat.querySelector("#kmiChatBody");
  const form = chat.querySelector("#kmiChatForm");
  const topicSelect = chat.querySelector("select[name='topic']");

  function addMessage(kind, text, title = "") {
    const msg = document.createElement("div");
    msg.className = `kmi-chat-msg ${kind}`;
    msg.innerHTML = title ? `<strong>${title}</strong>${text}` : text;
    body.insertBefore(msg, form);
    body.scrollTop = body.scrollHeight;
  }

  chat.querySelectorAll("[data-topic]").forEach(btn => {
    btn.addEventListener("click", () => {
      const topic = btn.dataset.topic;
      const mappedTopic = topicMap[topic] || topic;
      const option = Array.from(topicSelect.options).find(opt => opt.value === mappedTopic || opt.textContent === mappedTopic);
      if (option) topicSelect.value = option.value || option.textContent;
      addMessage("user", btn.textContent);
      addMessage("bot", responses[topic] || "Please send KMI a message through the form and someone can follow up.", topic);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const entry = {
      date: new Date().toLocaleString(),
      name: fd.get("name") || "",
      email: fd.get("email") || "",
      phone: fd.get("phone") || "",
      topic: fd.get("topic") || "",
      message: fd.get("message") || "",
      status: "New chatbot lead"
    };
    const rows = JSON.parse(localStorage.getItem(storageKey) || "[]");
    rows.push(entry);
    localStorage.setItem(storageKey, JSON.stringify(rows));
    addMessage("bot", "Thank you. This demo saved your request to the local CRM dashboard prototype.");
    e.currentTarget.reset();
  });
})();