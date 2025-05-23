form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);

  const t_id = urlParams.get('t_id') || crypto.randomUUID();
  const sub_id = urlParams.get('sub_id') || '';
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
    t_id
  };

  // Opslaan in localStorage
  localStorage.setItem('t_id', t_id);
  localStorage.setItem('aff_id', aff_id);
  localStorage.setItem('offer_id', offer_id);
  localStorage.setItem('sub_id', sub_id);
  localStorage.setItem('f_2_title', data.gender);
  localStorage.setItem('f_3_firstname', data.firstname);
  localStorage.setItem('f_4_lastname', data.lastname);
  localStorage.setItem('f_1_email', data.email);

  try {
    const response = await fetch('https://gamingmemoryprelander.vercel.app/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log("Response object:", response);
    const result = await response.json();
    console.log("Result JSON:", result);

    if (result.success) {
      const redirectParams = new URLSearchParams({
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        t_id,
        sub_id,
        aff_id,
        offer_id
      });

      const currentUrl = new URL(window.location.href);
      currentUrl.pathname = '/memoryspel/bedankt';
      currentUrl.search = redirectParams.toString();
      window.location.href = currentUrl.toString();

    } else {
      alert('Er is iets misgegaan. Probeer het opnieuw.');
      console.error("API gaf geen success:", result);
    }
  } catch (err) {
    alert('Verbinding mislukt.');
    console.error("Fout in fetch-blok:", err);
  }
});
