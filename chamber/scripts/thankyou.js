const getString = window.location.search;
console.log(getString);


const myInfo = new URLSearchParams(getString);
console.log(myInfo);

function showDate(dateString) {
    if (!dateString) return "Date not recorded";
    const date = new Date(dateString); // Convert ISO string to Date object
    return date.toLocaleString(); // Formats it to user's local time (e.g. 2/1/2026, 4:00 PM)
}

console.log(myInfo.get('firstname'));
console.log(myInfo.get('lastname'));
console.log(myInfo.get('title'));
console.log(myInfo.get('org'));
console.log(myInfo.get('phone'));
console.log(myInfo.get('email'));
console.log(myInfo.get('level'));
console.log(myInfo.get('description'));
console.log(showDate(myInfo.get('timestamp')));

document.querySelector('#results').innerHTML = `
<p>First name: <strong>${myInfo.get('firstname')}</strong></p>
<p>Last name: <strong>${myInfo.get('lastname')}</strong> </p>
<p>Email: <strong>${myInfo.get('email')}</strong> </p>
<p>Phone no: <strong>${myInfo.get('phone')}</strong> </p>
<p>Business Name: <strong>${myInfo.get('title')}</strong> </p>
<p>Time Stamp: <strong>${showDate(myInfo.get('timestamp'))}</strong> </p>

`


document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;
