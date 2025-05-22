export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Of specifieker: 'https://nl.wincadeaukaarten.com'
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight check OK
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const {
    gender,
    firstname,
    lastname,
    dob_day,
    dob_month,
    dob_year,
    email,
    t_id // Let op: hier vervangen we transaction_id door t_id
  } = req.body;

  const dob = `${dob_day.padStart(2, '0')}/${dob_month.padStart(2, '0')}/${dob_year}`;
  const ipaddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const optindate = new Date().toISOString().split('T')[0];
  const campagne_url = req.headers.referer || '';

  const params = new URLSearchParams({
    cid: '4885',
    sid: '34',
    f_2_title: gender,
    f_3_firstname: firstname,
    f_4_lastname: lastname,
    f_1_email: email,
    f_5_dob: dob,
    f_17_ipaddress: ipaddress,
    f_55_optindate: optindate,
    f_1322_transaction_id: t_id, // hier gebruiken we t_id als waarde
    f_1453_campagne_url: campagne_url
  });

  try {
    const response = await fetch('https://crsadvertising.databowl.com/api/v1/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const result = await response.json();
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Databowl error:', error);
    return res.status(500).json({ success: false, message: 'Databowl request failed' });
  }
}
