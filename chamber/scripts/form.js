document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

// variables
const hamburger = document.getElementById("hamburger");
const navigation = document.getElementById("navigation");
hamburger.addEventListener("click", ()=>{
    hamburger.classList.toggle("active");
    navigation.classList.toggle("open");
});

// form timestamp
function setupModal(btnId, modalId) {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector(".close-modal");

    // Open Modal
    btn.addEventListener("click", (event) => {
        event.preventDefault(); 
        modal.showModal();
    });

    // Close Modal (X button)
    closeBtn.addEventListener("click", () => {
        modal.close();
    });

    // Close Modal (Click outside)
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
}

setupModal("np-btn", "np-modal");
setupModal("bronze-btn", "bronze-modal");
setupModal("silver-btn", "silver-modal");
setupModal("gold-btn", "gold-modal");

// Set the timestamp (Required from previous step)
document.getElementById("timestamp").value = new Date().toISOString();
