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
  localStorage.setItem("transaction_id", transaction_id);

  localStorage.setItem("gameName", "MemoryGame");
  localStorage.setItem("hero-image", "hero-banner-placeholder.png");

  async function registerVisit() {
    const stored = localStorage.getItem("internalVisitId");
    if (stored) {
      return stored;
    }

    try {
      const res = await fetch(
        "https://cdn.909support.com/NL/4.1/assets/php/register_visit.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            clickId: transaction_id,
            affId,
            offerId,
            subId,
            subId2: subId,
          }),
        }
      );
      const data = await res.json();

      if (data.internalVisitId) {
        localStorage.setItem("internalVisitId", data.internalVisitId);
        localStorage.setItem("t_id", transaction_id);
        localStorage.setItem("aff_id", affId);
        localStorage.setItem("offer_id", offerId);
        localStorage.setItem("sub_id", subId);
        return data.internalVisitId;
      }
    } catch (err) {
      console.error("Visit registration failed", err);
    }
    return null;
  }

  const visitPromise = registerVisit();

  const desktopBtn = document.getElementById("submitPinButton");
  const desktopInput1 = document.getElementById("input1");
  const desktopInput2 = document.getElementById("input2");
  const desktopInput3 = document.getElementById("input3");
  const desktopCombined = document.getElementById("pinCode");
  const errorDisplay = document.getElementById("pin-error");

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
            affId: localStorage.getItem("aff_id"),
            offerId: localStorage.getItem("offer_id"),
            subId: localStorage.getItem("sub_id"),
            internalVisitId: localStorage.getItem("internalVisitId"),
            clickId: localStorage.getItem("transaction_id") || localStorage.getItem("t_id"),
            pin,
            gameName: localStorage.getItem("gameName") || "MemoryGame"
          })
        });

        const data = await res.json();
        console.log("SubmitPin HTTP status:", res.status);
        console.log("SubmitPin response body:", data);

        if (data.callId) {
          const redirectUrl = new URL("https://play.909skillgames.com/memory");
          redirectUrl.searchParams.set("call_id", data.callId);
          redirectUrl.searchParams.set("t_id", localStorage.getItem("transaction_id") || localStorage.getItem("t_id"));
          redirectUrl.searchParams.set("aff_id", localStorage.getItem("aff_id"));
          redirectUrl.searchParams.set("offer_id", localStorage.getItem("offer_id"));
          redirectUrl.searchParams.set("sub_id", localStorage.getItem("sub_id"));
          redirectUrl.searchParams.set("f_2_title", localStorage.getItem("f_2_title"));
          redirectUrl.searchParams.set("f_3_firstname", localStorage.getItem("f_3_firstname"));
          redirectUrl.searchParams.set("f_4_lastname", localStorage.getItem("f_4_lastname"));
          redirectUrl.searchParams.set("f_1_email", localStorage.getItem("f_1_email"));

          window.location.href = redirectUrl.toString();
        } else {
          if (errorDisplay) errorDisplay.innerText = "Onjuiste pincode. Probeer het opnieuw.";
        }
      } catch (err) {
        if (errorDisplay) errorDisplay.innerText = "Er ging iets mis. Probeer opnieuw.";
        console.error(err);
      }
    });
  }
});
