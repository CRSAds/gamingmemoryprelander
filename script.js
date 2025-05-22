document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);

  // 1. Identifiers instellen (t_id als centrale ID)
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

  const t_id = urlParams.get("t_id") || localStorage.getItem("t_id") || getTransactionId();
  localStorage.setItem("t_id", t_id);

  const affId = urlParams.get("aff_id") || localStorage.getItem("aff_id") || "1000";
  const offerId = urlParams.get("offer_id") || localStorage.getItem("offer_id") || "9999";
  const subId = urlParams.get("sub_id") || localStorage.getItem("sub_id") || "8888";

  localStorage.setItem("aff_id", affId);
  localStorage.setItem("offer_id", offerId);
  localStorage.setItem("sub_id", subId);

  // 2. Registreer bezoek
  async function registerVisit() {
    const stored = localStorage.getItem("internalVisitId");
    if (stored) return stored;

    try {
      const res = await fetch("https://cdn.909support.com/NL/4.1/assets/php/register_visit.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          clickId: t_id,
          affId,
          offerId,
          subId,
          subId2: subId
        }),
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

  // 3. Elementen ophalen
  const desktopBtn = document.getElementById("submitPinButton");
  const desktopInput1 = document.getElementById("input1");
  const desktopInput2 = document.getElementById("input2");
  const desktopInput3 = document.getElementById("input3");
  const desktopCombined = document.getElementById("pinCode");
  const errorDisplay = document.getElementById("pin-error");

  const mobileBtn = document.getElementById("show-pin-btn-mobile");
  const mobileContainer = document.getElementById("pin-container-mobile");
  const mobileBox = document.getElementById("pin-code-display-mobile");

  // 4. Mobiele PIN ophalen
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
            clickId: t_id,
            internalVisitId,
          }),
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

  // 5. PIN invoer logica
  const desktopInputs = [desktopInput1, desktopInput2, desktopInput3];

  desktopInputs.forEach((input, i, arr) => {
    if (input) {
      input.addEventListener("input", () => {
        if (errorDisplay) errorDisplay.textContent = "";
        if (input.value.length === input.maxLength && arr[i + 1]) {
          arr[i + 1].focus();
        }
        updatePinValue();
      });
    }
  });

  function updatePinValue() {
    if (desktopCombined) {
      const val = `${desktopInput1?.value || ""}${desktopInput2?.value || ""}${desktopInput3?.value || ""}`;
      desktopCombined.value = val;
    }
  }

  // 6. PIN versturen
  if (desktopBtn && desktopCombined) {
    desktopBtn.addEventListener("click", async function () {
      const pin = desktopCombined.value;
      if (!/^\d{3}$/.test(pin)) {
        if (errorDisplay) errorDisplay.innerText = "Vul een geldige 3-cijferige code in.";
        return;
      }

      try {
        const res = await fetch("https://cdn.909support.com/NL/4.1/stage/assets/php/SubmitPin.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            affId,
            offerId,
            subId,
            internalVisitId: localStorage.getItem("internalVisitId"),
            clickId: t_id,
            pin,
            gameName: "MemoryGame"
          })
        });

        const data = await res.json();

        if (data.returnUrl) {
          const query = new URLSearchParams({
            call_id: data.callId,
            t_id: localStorage.getItem("t_id"),
            aff_id: localStorage.getItem("aff_id"),
            offer_id: localStorage.getItem("offer_id"),
            sub_id: localStorage.getItem("sub_id"),
            f_2_title: localStorage.getItem("f_2_title") || '',
            f_3_firstname: localStorage.getItem("f_3_firstname") || '',
            f_4_lastname: localStorage.getItem("f_4_lastname") || '',
            f_1_email: localStorage.getItem("f_1_email") || ''
          });

          window.open(`${data.returnUrl}?${query.toString()}`, '_blank');

          setTimeout(() => {
            const closeBtn = document.querySelector('.close-icon');
            if (closeBtn) closeBtn.click();
          }, 7500);
        } else {
          if (errorDisplay) errorDisplay.innerText = "Onjuiste pincode. Probeer het opnieuw.";
        }
      } catch (err) {
        if (errorDisplay) errorDisplay.innerText = "Er ging iets mis. Probeer opnieuw.";
        console.error(err);
      }
    });
  }

  // 7. PIN animatie mobiel
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
