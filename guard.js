/* ========================================================
   SDG INSIGHTS — CLOUD CONNECTED AUTO-BLOCKING GUARD
   Connected directly to SDG Insights Google Sheet Database
   ======================================================== */
const SDG_API_URL = "https://script.google.com/macros/s/AKfycbwSKD2hKMbDZ3gUtgMu48-M7oVNsSj2nCE1QPTtzfUdjvnSYGq2vHbjRuumJySIvs-RJQ/exec";

// 1. INSTANT OWNER / MASTER ADMIN WHITELIST (NO WAITING)
const SDG_OWNERS = [
  "munazamukhtarmukhtar@gmail.com",
  "munazammukhtarmukhtar@gmail.com",
  "sdginsightsedu@gmail.com",
  "aonefoodsandcafe@gmail.com"
];

function sdgGetCourseCode() {
  const path = window.location.pathname.toUpperCase();
  if (path.includes("MGT101")) return "MGT101";
  if (path.includes("CS610")) return "CS610";
  if (path.includes("MTH401")) return "MTH401";
  if (path.includes("CS301")) return "CS301";
  if (path.includes("CS101")) return "CS101";
  return "";
}

function sdgIsUnlockedLocally() {
  const params = new URLSearchParams(window.location.search);
  const student = params.get('student') ? params.get('student').toLowerCase().trim() : "";
  const session = sessionStorage.getItem("sdg_verified_student") ? sessionStorage.getItem("sdg_verified_student").toLowerCase().trim() : "";

  // Check if owner
  if (SDG_OWNERS.includes(student) || SDG_OWNERS.includes(session)) {
    return true;
  }
  return false;
}

// FULL-SCREEN LOCK SHIELD ON PAGE LOAD
(function initGuard() {
  // If owner, unlock instantly!
  if (sdgIsUnlockedLocally()) {
    console.log("SDG Insights: Master Owner Verified");
    return;
  }

  // Hide page content from unapproved visitors
  const style = document.createElement("style");
  style.id = "sdgLockStyle";
  style.innerHTML = `
    body > *:not(#sdgFullScreenLock) {
      filter: blur(18px) !important;
      pointer-events: none !important;
      user-select: none !important;
      opacity: 0.05 !important;
    }
  `;
  document.head.appendChild(style);

  // Render Secure Lock Modal
  const overlay = document.createElement("div");
  overlay.id = "sdgFullScreenLock";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(10, 22, 38, 0.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  `;

  overlay.innerHTML = `
    <div style="background:#ffffff; max-width:420px; width:100%; border-radius:28px; padding:32px 24px; text-align:center; box-shadow:0 30px 60px rgba(0,0,0,0.5); border:1px solid #e2e8f0;">
      <div style="width:60px; height:60px; background:#fef3c7; color:#d97706; border-radius:20px; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto; font-size:26px;">
        🔒
      </div>
      <h2 style="font-size:20px; font-weight:900; color:#102138; margin:0 0 8px 0;">Portal Locked</h2>
      <p style="font-size:13px; color:#64748b; line-height:1.6; margin:0 0 18px 0;">
        یہ مکمل نوٹس پورٹل صرف فیس ادا کرنے والے منظور شدہ طلبہ کے لیے ہے۔ رسائی حاصل کرنے کے لیے اپنی منظور شدہ جی میل درج کریں۔
      </p>
      
      <div style="margin-bottom:14px;">
        <input type="email" id="sdgUnlockEmailInput" placeholder="Enter Approved Gmail Address..." style="width:100%; box-sizing:border-box; border:2px solid #e2e8f0; border-radius:14px; padding:12px 16px; font-size:13px; outline:none; text-align:center; font-weight:600; color:#0f172a;" />
      </div>

      <button id="sdgUnlockBtn" style="width:100%; background:#102138; color:#ffffff; font-weight:800; border:none; border-radius:14px; padding:13px; font-size:13px; cursor:pointer; margin-bottom:14px; box-shadow:0 4px 12px rgba(16,33,56,0.2);">
        Unlock My Portal
      </button>

      <div id="sdgStatusMsg" style="font-size:12px; font-weight:700; min-height:20px; margin-bottom:10px;"></div>

      <div style="border-top:1px solid #f1f5f9; padding-top:14px; margin-bottom:14px;">
        <a href="https://wa.me/923198519637?text=Assalam-o-Alaikum!%20Mujhe%20exam%20portal%20unlock%20karwana%20hai." target="_blank" style="color:#059669; font-weight:800; font-size:13px; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
          💬 Pay & Unlock on WhatsApp (0319-8519637)
        </a>
      </div>

      <a href="index.html" style="color:#94a3b8; font-size:12px; text-decoration:none; font-weight:600; display:inline-block;">
        ← Back to SDG Insights Home
      </a>
    </div>
  `;

  document.body.appendChild(overlay);

  // AUTO-CHECK IF URL CONTAINS STUDENT EMAIL
  const params = new URLSearchParams(window.location.search);
  if (params.has('student')) {
    const sEmail = params.get('student').toLowerCase().trim();
    document.getElementById("sdgUnlockEmailInput").value = sEmail;
    verifyFromGoogleSheet(sEmail);
  }

  // CLICK HANDLER
  document.getElementById("sdgUnlockBtn").onclick = function() {
    const inputEmail = document.getElementById("sdgUnlockEmailInput").value.trim().toLowerCase();
    if (!inputEmail.includes("@")) {
      alert("Please enter a valid Gmail address.");
      return;
    }
    verifyFromGoogleSheet(inputEmail);
  };

  function verifyFromGoogleSheet(email) {
    const btn = document.getElementById("sdgUnlockBtn");
    const statusBox = document.getElementById("sdgStatusMsg");
    btn.disabled = true;
    btn.innerText = "Checking Google Sheet Database...";
    statusBox.innerText = "Connecting to SDG Database...";
    statusBox.style.color = "#3a80bc";

    // Fast Owner Bypass
    if (SDG_OWNERS.includes(email)) {
      sessionStorage.setItem("sdg_verified_student", email);
      overlay.remove();
      const st = document.getElementById("sdgLockStyle");
      if (st) st.remove();
      alert("✓ Welcome Master Instructor! Portal Unlocked.");
      return;
    }

    const course = sdgGetCourseCode();
    const fetchUrl = SDG_API_URL + "?email=" + encodeURIComponent(email) + "&course=" + encodeURIComponent(course);

    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        btn.disabled = false;
        btn.innerText = "Unlock My Portal";

        if (data.allowed) {
          sessionStorage.setItem("sdg_verified_student", email);
          alert(data.message || "✓ Access Approved! You have 1-month access.");
          overlay.remove();
          const st = document.getElementById("sdgLockStyle");
          if (st) st.remove();
        } else {
          statusBox.innerText = data.message || "❌ Access Denied";
          statusBox.style.color = "#dc2626";
          alert(data.message || "❌ Access Denied! Please verify payment on WhatsApp.");
        }
      })
      .catch(err => {
        btn.disabled = false;
        btn.innerText = "Unlock My Portal";
        statusBox.innerText = "Network error connecting to database.";
        statusBox.style.color = "#dc2626";
      });
  }
})();
