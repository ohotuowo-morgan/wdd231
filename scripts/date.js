// Dynamically insert current year
document.getElementById("currentyear").textContent = new Date().getFullYear();

// Insert last modified date
document.getElementById("lastModified").textContent = `Last Modifiication ${document.lastModified}`