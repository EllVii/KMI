(() => {
  const storageKey = "kmiChatLeads";
  const css = `
    .kmi-chat-toggle{position:fixed;right:18px;bottom:18px;z-index:9999;border:0;border-radius:999px;background:linear-gradient(135deg,#f8e8a5,#d5a83a 55%,#8f6420);color:#241504;font-weight:900;padding:14px 18px;box-shadow:0 18px 40px rgba(0,0,0,.25);cursor:pointer}
    .kmi-chat{position:fixed;right:18px;bottom:76px;z-index:9999;width:min(370px,calc(100vw - 36px));background:#fffaf2;border:1px solid rgba(59,42,23,.18);border-radius:22px;box-shadow:0 22px 60px rgba(0,0,0,.28);overflow:hidden;display:none;color:#2b241b}
    .kmi-chat.open{display:block}.kmi-chat-head{background:#2d2419;color:#f8e8a5;padding:14px 16px}.kmi-chat-head strong{display:block;font-family:Georgia,serif;font-size:18px}.kmi-chat-body{padding:14px 16px;max-height:460px;overflow:auto}.kmi-chat-msg{border-radius:16px;padding:10px 12px;margin:8px 0;font-size:14px;line-height:1.35}.kmi-chat-msg.bot{background:#f1e6d4}.kmi-chat-msg.user{background:#e5eddc;margin-left:35px}.kmi-chat-actions{display:grid;gap:8px;margin:10px 0}.kmi-chat-actions button{border:1px solid rgba(59,42,23,.18);background:#fff;border-radius:999px;padding:9px 10px;text-align:left;font-weight:800;cursor:pointer}.kmi-chat-form{display:grid;gap:8px;margin-top:10px}.kmi-chat-form input,.kmi-chat-form select,.kmi-chat-form textarea{width:100%;padding:10px;border-radius:12px;border:1px solid rgba(59,42,23,.22);font:inherit}.kmi-chat-form textarea{min-height:70px}.kmi-chat-form button{border:0;border-radius:999px;padding:11px 14px;background:#3f4a35;color:#fff;font-weight:900;cursor:pointer}.kmi-chat-small{font-size:12px;color:#6b5f4e;margin-top:8px}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const toggle = document.createElement("button");
  toggle.className = "kmi-chat-toggle";
  toggle.textContent = "Need help?";

  const chat = document.createElement("section");
  chat.className = "kmi-chat";
  chat.innerHTML = `
    <div class="kmi-chat-head"><strong>KMI Support Assistant</strong><span>Faith-centered support, outreach, giving, and referrals.</span></div>
    <div class="kmi-chat-body" id="kmiChatBody">
      <div class="kmi-chat-msg bot">Hi, welcome to Kingdom Missions International. What would you like help with today?</div>
      <div class="kmi-chat-actions">
        <button data-topic="Resources">I need resources or a referral</button>
        <button data-topic="Ministry">I want ministry or marital support</button>
        <button data-topic="Giving">I want to give or support the mission</button>
        <button data-topic="Las Vegas Outreach">I want to help with Las Vegas outreach</button>
        <button data-topic="Philippines Missions">I want to help with Philippines missions</button>
      </div>
      <form class="kmi-chat-form" id="kmiChatForm">
        <input name="name" placeholder="Your name" required>
        <input name="email" type="email" placeholder="Email" required>
        <input name="phone" placeholder="Phone optional">
        <select name="topic"><option>Resources</option><option>Ministry</option><option>Giving</option><option>Las Vegas Outreach</option><option>Philippines Missions</option><option>Other</option></select>
        <textarea name="message" placeholder="Briefly tell us what you need or how you want to help."></textarea>
        <button type="submit">Send to KMI demo CRM</button>
      </form>
      <p class="kmi-chat-small">Prototype only. A live version would route this to the secure KMI CRM/dashboard.</p>
    </div>`;

  document.body.appendChild(toggle);
  document.body.appendChild(chat);
  toggle.addEventListener("click", () => chat.classList.toggle("open"));
  chat.querySelectorAll("[data-topic]").forEach(btn => {
    btn.addEventListener("click", () => {
      chat.querySelector("select[name='topic']").value = btn.dataset.topic;
      const msg = document.createElement("div");
      msg.className = "kmi-chat-msg user";
      msg.textContent = btn.textContent;
      chat.querySelector("#kmiChatBody").insertBefore(msg, chat.querySelector("#kmiChatForm"));
    });
  });
  chat.querySelector("#kmiChatForm").addEventListener("submit", (e) => {
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
    const msg = document.createElement("div");
    msg.className = "kmi-chat-msg bot";
    msg.textContent = "Thank you. This demo saved your request to the local CRM dashboard prototype.";
    chat.querySelector("#kmiChatBody").insertBefore(msg, e.currentTarget);
    e.currentTarget.reset();
  });
})();
