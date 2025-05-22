document.getElementById('lead-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const urlParams = new URLSearchParams(window.location.search);

  const transaction_id = urlParams.get('transaction_id') || '';
  const sub2 = urlParams.get('sub2') || '';
  const aff_id = urlParams.get('aff_id') || '';
  const offer_id = urlParams.get('offer_id') || '';

  const data = {
    gender: form.gender.value,
    firstname: form.firstname.value.trim(),
    lastname: form.lastname.value.trim(),
    dob_day: form.dob_day.value,
    dob_month: form.dob_month.value,
    dob_year: form.dob_year.value,
    email: form.email.value.trim(),
    transaction_id
  };

  try {
    const response = await fetch('https://gamingmemoryprelander.vercel.app/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
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
        offer_id
      });

const redirectBase = "https://nl.wincadeaukaarten.com/memoryspel/bedankt";
window.location.href = `${redirectBase}?${redirectParams.toString()}`;
      
    } else {
      alert('Er is iets misgegaan. Probeer het opnieuw.');
      console.error(result);
    }
  } catch (err) {
    alert('Verbinding mislukt.');
    console.error(err);
  }
});
