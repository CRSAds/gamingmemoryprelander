const urlParams = new URLSearchParams(window.location.search);
const firstname = urlParams.get("firstname");
const title = document.getElementById("thank-you-name");
if (firstname && title) {
  title.textContent = `Bedankt, ${firstname}!`;
}
