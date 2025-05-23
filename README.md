# Gaming Memory Prelander

This project is a small pre-landing page written in HTML, CSS and JavaScript. Visitors reveal a 3-digit VIP code which they must enter via a telephone IVR. Both desktop and mobile users see a button to show the code. The script communicates with remote PHP endpoints to register visits and request the pin code.

## How to open

1. Ensure you have a modern web browser installed (e.g. Chrome, Firefox, Edge).
2. Download or clone this repository.
3. Open `index.html` in your browser. No additional build steps are required.

The page automatically registers the visitor and later fetches a PIN code using network requests.

## Expected network interactions

Upon loading, the JavaScript (`script.js`) sends a POST request to `register_visit.php` to obtain an internal visit ID. When the user reveals a pin, it requests `request_pin.php` to retrieve the code. The visitor then calls the hotline and enters the shown code. These interactions require a working network connection.

## Prerequisites

- A modern browser with JavaScript enabled.
- An active internet connection so that the page can reach the remote PHP endpoints.

