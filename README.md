# Gaming Memory Prelander

This project is a small pre-landing page written in HTML, CSS and JavaScript. It collects a 3-digit VIP code either through input fields on desktop or by revealing a pin on mobile. The script communicates with remote PHP endpoints to register visits and submit or request a code.

## How to open

1. Ensure you have a modern web browser installed (e.g. Chrome, Firefox, Edge).
2. Download or clone this repository.
3. Open `index.html` in your browser. No additional build steps are required.

The page will automatically attempt to register the visitor and later fetch or submit PIN codes using network requests.

## Expected network interactions

Upon loading, the JavaScript (`script.js`) sends a POST request to `register_visit.php` to obtain an internal visit ID. When the mobile user reveals a pin, it requests `request_pin.php`. Submitting the pin calls `SubmitPin.php` and then redirects the user based on the returned URL. These interactions require a working network connection.

## Prerequisites

- A modern browser with JavaScript enabled.
- An active internet connection so that the page can reach the remote PHP endpoints.

