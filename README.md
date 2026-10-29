# Dineora — Premium Restaurant Website

A responsive restaurant website built with **HTML, CSS, and vanilla JavaScript**. No frameworks, Node.js, or backend are required.

## Files
- `index.html` — main restaurant website, menu, photo slider, gallery and reservation demo.
- `style.css` — responsive styling, cursive display headings, hover effects and animations.
- `script.js` — menu search/filter, add-to-order cart, image slider, reservation demo and reviews.
- `bill.html` — separate order bill page.
- `bill.css` — bill layout and print styling.
- `bill.js` — reads the current browser session's order, allows quantity edits/removal, recalculates totals and creates the bill.
- Additional sections: chef's note, events, guest-list demo form, FAQ accordion, favourites, and back-to-top button.

## Run it
Open `index.html` in a modern browser. Internet access is needed for Google Fonts and Unsplash photos.

## Publish with GitHub Pages
1. Upload all six project files (`index.html`, `style.css`, `script.js`, `bill.html`, `bill.css`, `bill.js`) and this README to the root of your repository.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**, choose `main` and `/(root)`, then save.
4. Wait for GitHub Pages to publish the site. Open the Pages URL and test adding a menu item, then choosing **Review order**.

## Order and bill note
This is a front-end demonstration. The cart is kept in `sessionStorage` for the current browser tab/session. The bill includes sample 5% service charge and 5% GST calculations for demonstration only. No real payment is processed and no order is sent to a restaurant. Real orders, payments, email notifications, or multi-device customer accounts require a secure backend and payment provider.
