// IMMEDIATE SCREEN SHIELD
(function() {
  const whitelist = [
    "munazamukhtarmukhtar@gmail.com",
    "sdginsightsedu@gmail.com",
    "ali.student@gmail.com"
  ];

  const params = new URLSearchParams(window.location.search);
  const student = params.get('student') ? params.get('student').toLowerCase() : "";
  const session = sessionStorage.getItem("sdg_verified_student");

  // If student is NOT allowed, BLOCK ENTIRE SCREEN IMMEDIATELY
  if (!whitelist.includes(student) && !whitelist.includes(session)) {
    document.documentElement.innerHTML = `
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Denied — SDG Insights</title>
        <style>
          body { margin:0; background:#0c1626; color:#ffffff; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; padding:20px; box-sizing:border-box; }
          .card { background:#ffffff; color:#0f172a; max-width:400px; width:100%; border-radius:24px; padding:32px 24px; text-align:center; }
          input { width:100%; box-sizing:border-box; border:2px solid #e2e8f0; border-radius:12px; padding:12px; font-size:13px; text-align:center; margin:16px 0 12px 0; outline:none; }
          button { width:100%; background:#102138; color:#fff; border:none; border-radius:12px; padding:12px; font-weight:bold; cursor:pointer; }
        </style>
      </head>
      <body>
        <div class="card">
          <div style="font-size:32px; margin-bottom:12px;">🔒</div>
          <h2 style="margin:0 0 8px 0; font-size:20px;">Portal Locked</h2>
          <p style="font-size:12px; color:#64748b; line-height:1.6; margin:0;">
            یہ پورٹل صرف فیس ادا کرنے والے منظور شدہ طلبہ کے لیے ہے۔ رسائی کے لیے اپنی منظور شدہ جی میل درج کریں۔
          </p>
          <input type="email" id="emailInput" placeholder="Enter Approved Gmail..." />
          <button onclick="checkAccess()">Unlock Portal</button>
          <div style="margin-top:16px; border-top:1px solid #f1f5f9; padding-top:14px;">
            <a href="https://wa.me/923198519637" style="color:#059669; font-size:12px; font-weight:bold; text-decoration:none;">
              💬 WhatsApp: 0319-8519637
            </a>
          </div>
        </div>
        <script>
          function checkAccess() {
            var em = document.getElementById('emailInput').value.trim().toLowerCase();
            var wl = ["munazammukhtarmukhtar@gmail.com", "sdginsightsedu@gmail.com", "ali.student@gmail.com"];
            if (wl.includes(em)) {
              sessionStorage.setItem("sdg_verified_student", em);
              location.reload();
            } else {
              alert("❌ Access Denied: This Gmail is not approved. Please contact on WhatsApp.");
            }
          }
        <\/script>
      </body>
    `;
    window.stop(); // Stops browser from downloading or rendering the 8000 lines of notes!
  }
})();
