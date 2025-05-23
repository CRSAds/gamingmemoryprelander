document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);

  const affId = urlParams.get("aff_id") || "1000";
  const offerId = urlParams.get("offer_id") || "9999";
  const subId = urlParams.get("sub_id") || "8888";

  function getTransactionId() {
    if (crypto && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const transaction_id = urlParams.get("t_id") || getTransactionId();
  localStorage.setItem("t_id", transaction_id);
  localStorage.setItem("aff_id", affId);
  localStorage.setItem("offer_id", offerId);
  localStorage.setItem("sub_id", subId);

  async function registerVisit() {
    const stored = localStorage.getItem("internalVisitId");
    if (stored) return stored;

    try {
      const res = await fetch("https://cdn.909support.com/NL/4.1/assets/php/register_visit.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          clickId: transaction_id,
          affId,
          offerId,
          subId,
          subId2: subId
        })
      });

      const data = await res.json();
      if (data.internalVisitId) {
        localStorage.setItem("internalVisitId", data.internalVisitId);
        return data.internalVisitId;
      }
    } catch (err) {
      console.error("Visit registration failed", err);
    }
    return null;
  }

  const visitPromise = registerVisit();

  const mobileBtn = document.getElementById("show-pin-btn-mobile");
  const mobileContainer = document.getElementById("pin-container-mobile");
  const mobileBox = document.getElementById("pin-code-display-mobile");

  const desktopBtn = document.getElementById("show-pin-btn-desktop");
  const desktopContainer = document.getElementById("pin-container-desktop");
  const desktopBox = document.getElementById("pin-code-display-desktop");

  if (mobileBtn) {
    mobileBtn.addEventListener("click", async function () {
      mobileBtn.style.display = "none";
      mobileContainer.style.display = "block";

      try {
        const internalVisitId = await visitPromise;
        const pinRes = await fetch("https://cdn.909support.com/NL/4.1/stage/assets/php/request_pin.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            clickId: transaction_id,
            internalVisitId
          })
        });
        const pinData = await pinRes.json();
        if (pinData.pincode) {
          animatePinReveal(mobileBox, pinData.pincode);
        }
      } catch (err) {
        console.warn("Mobiele IVR mislukt:", err);
      }
    });
  }

  if (desktopBtn) {
    desktopBtn.addEventListener("click", async function () {
      desktopBtn.style.display = "none";
      desktopContainer.style.display = "block";

      try {
        const internalVisitId = await visitPromise;
        const pinRes = await fetch("https://cdn.909support.com/NL/4.1/stage/assets/php/request_pin.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            clickId: transaction_id,
            internalVisitId
          })
        });
        const pinData = await pinRes.json();
        if (pinData.pincode) {
          animatePinReveal(desktopBox, pinData.pincode);
        }
      } catch (err) {
        console.warn("Desktop IVR mislukt:", err);
      }
    });
  }

  function animatePinReveal(el, finalPin) {
    let frame = 0;
    const duration = 1000;
    const interval = 80;
    const totalFrames = duration / interval;

    const animator = setInterval(() => {
      if (frame < totalFrames) {
        el.innerText = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        frame++;
      } else {
        clearInterval(animator);
        el.innerText = finalPin;
      }
    }, interval);
  }
});
