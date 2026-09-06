/* ========================================================
   SDG INSIGHTS — CLEAN AUTO-LOCK GUARD (ZERO BLUR)
   ======================================================== */
const SDG_API_URL = "https://script.google.com/macros/s/AKfycbwSKD2hKMbDZ3gUtgMu48-M7oVNsSj2nCE1QPTtzfUdjvnSYGq2vHbjRuumJySIvs-RJQ/exec";

const SDG_OWNERS = [
  "munazamukhtarmukhtar@gmail.com",
  "munazammukhtarmukhtar@gmail.com",
  "sdginsightsedu@gmail.com",
  "aonefoodsandcafe@gmail.com",
  "meeruali637@gmail.com"
];

function sdgGetCourseCode() {
  const path = window.location.pathname.toUpperCase();
  if (path.includes("MGT101")) return "MGT101";
  if (path.includes("CS610")) return "CS610";
  if (path.includes("MTH401")) return "MTH401";
  return "MGT101";
}

function sdgIsUnlockedLocally() {
  const params = new URLSearchParams(window.location.search);
  const student = params.get('student') ? params.get('student').toLowerCase().trim() : "";
  const session = sessionStorage.getItem("sdg_verified_student") ? sessionStorage.getItem("sdg_verified_student").toLowerCase().trim() : "";

  if (SDG_OWNERS.includes(student) || SDG_OWNERS.includes(session)) {
    return true;
  }
  return false;
}

(function initGuard() {
  // If verified, show content cleanly without any lock
  if (sdgIsUnlockedLocally()) {
    console.log("SDG Insights: Access Verified & Clean");
    return;
  }

  // Create clean full screen overlay (NO BLURRING OF CONTENT)
  const overlay = document.createElement("div");
  overlay.id = "sdgFullScreenLock";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: #0c1626;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    font-family: sans-serif;
  `;

  overlay.innerHTML = `
    <div style="background:#ffffff; max-width:400px; width:100%; border-radius:24px; padding:32px 24px; text-align:center; box-shadow:0 25px 50px rgba(0,0,0,0.5);">
      <div style="font-size:36px; margin-bottom:12px;">🔒</div>
      <h2 style="font-size:20px; font-weight:800; color:#102138; margin:0 0 8px 0;">Portal Locked</h2>
      <p style="font-size:12px; color:#64748b; line-height:1.6; margin:0 0 16px 0;">
        یہ مکمل نوٹس پورٹل صرف منظور شدہ طلبہ کے لیے ہے۔ رسائی کے لیے اپنی منظور شدہ جی میل درج کریں۔
      </p>
      <input type="email" id="sdgUnlockEmailInput" placeholder="Enter Approved Gmail Address..." style="width:100%; box-sizing:border-box; border:2px solid #cbd5e1; border-radius:12px; padding:12px; font-size:13px; outline:none; text-align:center; margin-bottom:12px;" />
      <button id="sdgUnlockBtn" style="width:100%; background:#102138; color:#ffffff; font-weight:700; border:none; border-radius:12px; padding:12px; font-size:13px; cursor:pointer; margin-bottom:12px;">
        Unlock Portal
      </button>
      <div id="sdgStatusMsg" style="font-size:12px; font-weight:bold; min-height:18px; margin-bottom:12px;"></div>
      <div style="border-top:1px solid #f1f5f9; padding-top:12px;">
        <a href="https://wa.me/923198519637" target="_blank" style="color:#059669; font-weight:bold; font-size:12px; text-decoration:none;">
          💬 WhatsApp for Access: 0319-8519637
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Auto check URL
  const params = new URLSearchParams(window.location.search);
  if (params.has('student')) {
    const sEmail = params.get('student').toLowerCase().trim();
    document.getElementById("sdgUnlockEmailInput").value = sEmail;
    verifyEmail(sEmail);
  }

  document.getElementById("sdgUnlockBtn").onclick = function() {
    const inputEmail = document.getElementById("sdgUnlockEmailInput").value.trim().toLowerCase();
    if (!inputEmail.includes("@")) {
      alert("Please enter a valid Gmail address.");
      return;
    }
    verifyEmail(inputEmail);
  };

  function verifyEmail(email) {
    const btn = document.getElementById("sdgUnlockBtn");
    const statusBox = document.getElementById("sdgStatusMsg");
    btn.disabled = true;
    btn.innerText = "Verifying...";
    statusBox.innerText = "Checking Database...";
    statusBox.style.color = "#3a80bc";

    if (SDG_OWNERS.includes(email)) {
      sessionStorage.setItem("sdg_verified_student", email);
      overlay.remove();
      return;
    }

    const course = sdgGetCourseCode();
    fetch(SDG_API_URL + "?email=" + encodeURIComponent(email) + "&course=" + encodeURIComponent(course))
      .then(res => res.json())
      .then(data => {
        btn.disabled = false;
        btn.innerText = "Unlock Portal";

        if (data.allowed) {
          sessionStorage.setItem("sdg_verified_student", email);
          overlay.remove();
        } else {
          statusBox.innerText = data.message || "❌ Access Denied";
          statusBox.style.color = "#dc2626";
        }
      })
      .catch(() => {
        btn.disabled = false;
        btn.innerText = "Unlock Portal";
        statusBox.innerText = "Error checking access.";
        statusBox.style.color = "#dc2626";
      });
  }
})();
