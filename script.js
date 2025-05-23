// Handles PIN reveal on both mobile and desktop

document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('show-pin-btn-mobile');
  const mobileContainer = document.getElementById('pin-container-mobile');
  const mobileDisplay = document.getElementById('pin-code-display-mobile');

  const desktopBtn = document.getElementById('show-pin-btn-desktop');
  const desktopContainer = document.getElementById('pin-container-desktop');
  const desktopDisplay = document.getElementById('pin-code-display-desktop');

  // Register visit on first load
  (async function registerVisit() {
    try {
      const res = await fetch('https://cdn.909support.com/NL/4.1/stage/assets/php/register_visit.php', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.internalVisitId) {
        localStorage.setItem('internalVisitId', data.internalVisitId);
      }
    } catch (err) {
      console.error('Visit registration failed', err);
    }
  })();

  async function fetchPin() {
    const clickId = localStorage.getItem('t_id') || localStorage.getItem('transaction_id');
    const internalVisitId = localStorage.getItem('internalVisitId');
    if (!clickId || !internalVisitId) return null;

    try {
      const res = await fetch('https://cdn.909support.com/NL/4.1/stage/assets/php/request_pin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ clickId, internalVisitId })
      });
      const data = await res.json();
      return data.pin || null;
    } catch (err) {
      console.error('Pin request failed', err);
      return null;
    }
  }

  function animatePinReveal(el, pin) {
    if (!el) return;
    el.textContent = '';
    [...pin].forEach((char, i) => {
      setTimeout(() => {
        el.textContent += char;
      }, i * 200);
    });
  }

  function handleReveal(container, display) {
    return async () => {
      const pin = await fetchPin();
      container.style.display = 'block';
      animatePinReveal(display, pin || '000');
    };
  }

  if (mobileBtn && mobileContainer && mobileDisplay) {
    mobileBtn.addEventListener('click', handleReveal(mobileContainer, mobileDisplay));
  }

  if (desktopBtn && desktopContainer && desktopDisplay) {
    desktopBtn.addEventListener('click', handleReveal(desktopContainer, desktopDisplay));
  }
});
