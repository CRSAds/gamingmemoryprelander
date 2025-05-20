document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);

  const affId = urlParams.get("aff_id") || "1000";
  const offerId = urlParams.get("offer_id") || "9999";
  const subId = urlParams.get("sub_id") || "8888";
  const transaction_id = urlParams.get("transaction_id") || crypto.randomUUID();

  const desktopBtn = document.getElementById("submitPinButton");
  const desktopInput1 = document.getElementById("input1");
  const desktopInput2 = document.getElementById("input2");
  const desktopInput3 = document.getElementById("input3");
  const desktopCombined = document.getElementById("pinCode");
  const errorDisplay = document.getElementById("pin-error");

  const mobileBtn = document.getElementById("show-pin-btn-mobile");
  const mobileContainer = document.getElementById("pin-container-mobile");
  const mobileBox = document.getElementById("pin-code-display-mobile");

  if (mobileBtn) {
    mobileBtn.addEventListener("click", async function () {
      mobileBtn.style.display = "none";
      mobileContainer.style.display = "block";

      try {
        const visitRes = await fetch("https://cdn.909support.com/NL/4.1/assets/php/register_visit.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            clickId: transaction_id,
            affId,
            offerId,
            subId,
            subId2: subId,
          }),
        });
        const visitData = await visitRes.json();

        const pinRes = await fetch("https://cdn.909support.com/NL/4.1/stage/assets/php/request_pin.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            clickId: transaction_id,
            internalVisitId: visitData.internalVisitId,
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

  [desktopInput1, desktopInput2, desktopInput3].forEach((input, i, arr) => {
    input.addEventListener("input", () => {
      errorDisplay.textContent = "";
      if (input.value.length === input.maxLength && arr[i + 1]) {
        arr[i + 1].focus();
      }
      updatePinValue();
    });

    input.addEventListener("focus", () => input.setAttribute("data-placeholder", input.placeholder));
    input.addEventListener("blur", () => input.setAttribute("placeholder", input.getAttribute("data-placeholder")));
  });

  function updatePinValue() {
    const val = `${desktopInput1.value}${desktopInput2.value}${desktopInput3.value}`;
    desktopCombined.value = val;
  }

  if (desktopBtn) {
    desktopBtn.addEventListener("click", async function () {
      const pin = desktopCombined.value;
      if (!/^\d{3}$/.test(pin)) {
        errorDisplay.innerText = "Vul een geldige 3-cijferige code in.";
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
            internalVisitId: transaction_id,
            clickId: transaction_id,
            pin,
            gameName: "MemoryGame"
          })
        });
        const data = await res.json();

        if (data.callId && data.returnUrl) {
          window.location.href = `${data.returnUrl}?call_id=${data.callId}&t_id=${transaction_id}`;
        } else {
          errorDisplay.innerText = "Onjuiste pincode. Probeer het opnieuw.";
        }
      } catch (err) {
        errorDisplay.innerText = "Er ging iets mis. Probeer opnieuw.";
        console.error(err);
      }
    });
  }
});
