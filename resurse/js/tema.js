window.addEventListener("DOMContentLoaded", function() {
    let temaCurenta = localStorage.getItem("tema");

    if (temaCurenta === "dark") {
        document.body.classList.add("dark-mode"); 
        
       document.getElementById("switch-tema").checked = true;
       document.getElementById("icon-tema").innerHTML = '<i class="fa-solid fa-moon"></i>'; 
       
    } else {
        document.body.classList.remove("dark-mode");
        
        document.getElementById("switch-tema").checked = false; 
        document.getElementById("icon-tema").innerHTML = '<i class="fa-solid fa-sun"></i>'; 
    }
});