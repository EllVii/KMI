(() => {
  const keys = {
    chat: "kmiChatLeads",
    giving: "kmiGivingRecords",
    crm: "kmiCrmRecords"
  };
  const read = key => JSON.parse(localStorage.getItem(key) || "[]");
  const write = (key, rows) => localStorage.setItem(key, JSON.stringify(rows));
  const money = n => `$${Number(n || 0).toFixed(2)}`;
  function rowFallback(cols, text){ return `<tr><td colspan="${cols}">${text}</td></tr>`; }
  function render(){
    const chatRows = document.getElementById("chatRows");
    const givingRows = document.getElementById("givingRows");
    const crmRows = document.getElementById("crmRows");
    const chat = read(keys.chat);
    const giving = read(keys.giving);
    const crm = read(keys.crm);
    if(chatRows) chatRows.innerHTML = chat.length ? chat.map(r => `<tr><td>${r.date}</td><td>${r.name}</td><td>${r.topic}</td><td>${r.status}</td></tr>`).join("") : rowFallback(4,"No chatbot leads yet.");
    if(givingRows) givingRows.innerHTML = giving.length ? giving.map(r => `<tr><td>${r.date}</td><td>${r.source}</td><td>${r.category}</td><td>${money(r.amount)}</td></tr>`).join("") : rowFallback(4,"No giving records yet.");
    if(crmRows) crmRows.innerHTML = crm.length ? crm.map(r => `<tr><td>${r.date}</td><td>${r.name}</td><td>${r.area}</td><td>${r.status}</td><td>${r.owner}</td></tr>`).join("") : rowFallback(5,"No CRM records yet.");
  }
  const givingForm = document.getElementById("givingForm");
  if(givingForm){
    givingForm.addEventListener("submit", e => {
      e.preventDefault();
      const fd = new FormData(givingForm);
      const rows = read(keys.giving);
      rows.push({date:new Date().toLocaleString(),source:fd.get("source")||"",amount:fd.get("amount")||0,category:fd.get("category")||"",method:fd.get("method")||"",notes:fd.get("notes")||""});
      write(keys.giving, rows); givingForm.reset(); render();
    });
  }
  const crmForm = document.getElementById("crmForm");
  if(crmForm){
    crmForm.addEventListener("submit", e => {
      e.preventDefault();
      const fd = new FormData(crmForm);
      const rows = read(keys.crm);
      rows.push({date:new Date().toLocaleString(),name:fd.get("name")||"",email:fd.get("email")||"",phone:fd.get("phone")||"",area:fd.get("area")||"",status:fd.get("status")||"",owner:fd.get("owner")||"",notes:fd.get("notes")||""});
      write(keys.crm, rows); crmForm.reset(); render();
    });
  }
  const exportBtn = document.getElementById("exportBtn");
  if(exportBtn){
    exportBtn.addEventListener("click", () => {
      const data = {chatbot_leads:read(keys.chat),giving_records:read(keys.giving),crm_records:read(keys.crm)};
      const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "kmi-crm-demo-export.json"; a.click();
      URL.revokeObjectURL(url);
    });
  }
  const clearBtn = document.getElementById("clearBtn");
  if(clearBtn){
    clearBtn.addEventListener("click", () => {
      if(confirm("Clear all local demo CRM data?")){
        Object.values(keys).forEach(k => localStorage.removeItem(k));
        render();
      }
    });
  }
  render();
})();
