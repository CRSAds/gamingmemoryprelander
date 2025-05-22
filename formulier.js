document.getElementById("lead-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const urlParams = new URLSearchParams(window.location.search);

  const transaction_id =
    urlParams.get("transaction_id") || localStorage.getItem("transaction_id") || crypto.randomUUID();
  const aff_id = urlParams.get("aff_id") || localStorage.getItem("affId") || "1000";
  const offer_id = urlParams.get("offer_id") || localStorage.getItem("offerId") || "9999";
  const sub2 = urlParams.get("sub2") || localStorage.getItem("subId") || "8888";

  const data = {
    gender: form.gender.value,
    firstname: form.firstname.value.trim(),
    lastname: form.lastname.value.trim(),
    dob_day: form.dob_day.value,
    dob_month: form.dob_month.value,
    dob_year: form.dob_year.value,
    email: form.email.value.trim(),
    transaction_id,
  };

  try {
    const response = await fetch("https://spelenenwinnen-databowl.vercel.app/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      const redirectParams = new URLSearchParams({
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        transaction_id,
        sub2,
        aff_id,
        offer_id,
      });

      window.location.href = `https://nl.prijzen-winnaar.com/memory/bedankt-upsell?${redirectParams.toString()}`;
    } else {
      alert("Er is iets misgegaan. Probeer het opnieuw.");
      console.error(result);
    }
  } catch (err) {
    alert("Verbinding mislukt.");
    console.error(err);
  }
});

// Automatisch doorspringen bij geboortedatum
["dob-day", "dob-month"].forEach((id, index) => {
  document.getElementById(id).addEventListener("input", function (e) {
    const val = e.target.value;

    if (id === "dob-day" && parseInt(val) >= 4) {
      e.target.value = val.padStart(2, "0");
      document.querySelectorAll(".dob-group input")[index + 1]?.focus();
    }

    if (id === "dob-month") {
      if (val.length === 2 || (val.length === 1 && parseInt(val) >= 2)) {
        e.target.value = val.padStart(2, "0");
        document.querySelectorAll(".dob-group input")[index + 1]?.focus();
      }
    }
  });
});
