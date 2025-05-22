document.addEventListener("DOMContentLoaded", function () {
  const desktopBtn = document.getElementById("submitPinButton");
  const desktopInput1 = document.getElementById("input1");
  const desktopInput2 = document.getElementById("input2");
  const desktopInput3 = document.getElementById("input3");
  const desktopCombined = document.getElementById("pinCode");
  const errorDisplay = document.getElementById("pin-error");

  const desktopInputs = [desktopInput1, desktopInput2, desktopInput3];

  function updatePinValue() {
    if (desktopCombined) {
      const val = `${desktopInput1?.value || ""}${desktopInput2?.value || ""}${desktopInput3?.value || ""}`;
      desktopCombined.value = val;
    }
  }

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

  if (desktopBtn && desktopCombined) {
    desktopBtn.addEventListener("click", async function () {
      const pin = desktopCombined.value;
      if (!/^\d{3}$/.test(pin)) {
        if (errorDisplay) errorDisplay.innerText = "Vul een geldige 3-cijferige code in.";
        return;
      }

      const internalVisitId = localStorage.getItem("internalVisitId");
      const transaction_id = localStorage.getItem("t_id") || localStorage.getItem("transaction_id");
      const aff_id = localStorage.getItem("aff_id");
      const offer_id = localStorage.getItem("offer_id");
      const sub_id = localStorage.getItem("sub_id");

      try {
        const res = await fetch("https://cdn.909support.com/NL/4.1/stage/assets/php/SubmitPin.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            affId: aff_id,
            offerId: offer_id,
            subId: sub_id,
            internalVisitId,
            clickId: transaction_id,
            pin,
            gameName: "MemoryGame"
          })
        });

        const data = await res.json();

        if (data.callId) {
          const redirectUrl = new URL("https://play.909skillgames.com/memory");
          redirectUrl.searchParams.set("call_id", data.callId);
          redirectUrl.searchParams.set("t_id", transaction_id);
          redirectUrl.searchParams.set("aff_id", aff_id);
          redirectUrl.searchParams.set("offer_id", offer_id);
          redirectUrl.searchParams.set("sub_id", sub_id);
          redirectUrl.searchParams.set("f_2_title", localStorage.getItem("f_2_title") || "");
          redirectUrl.searchParams.set("f_3_firstname", localStorage.getItem("f_3_firstname") || "");
          redirectUrl.searchParams.set("f_4_lastname", localStorage.getItem("f_4_lastname") || "");
          redirectUrl.searchParams.set("f_1_email", localStorage.getItem("f_1_email") || "");

          window.location.href = redirectUrl.toString();
        } else {
          if (errorDisplay) errorDisplay.innerText = "Onjuiste pincode. Probeer het opnieuw.";
        }
      } catch (err) {
        if (errorDisplay) errorDisplay.innerText = "Er ging iets mis. Probeer opnieuw.";
        console.error("Pin submit error:", err);
      }
    });
  }
});
