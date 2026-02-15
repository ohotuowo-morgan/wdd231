const currentUrl = window.location.search;

const urlParams = new URLSearchParams(currentUrl);

const userEmail = urlParams.get('email');

const displayElement = document.getElementById('user-email');

if (userEmail) {
    displayElement.textContent = userEmail;
} else {
    displayElement.textContent = "No email provided";
}