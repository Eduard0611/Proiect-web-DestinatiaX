window.addEventListener("DOMContentLoaded", function() {
    const temaCurenta = localStorage.getItem("tema");
    const switchTema = document.getElementById("switch-tema");
    const iconTema = document.getElementById("icon-tema");

    if (temaCurenta === "dark") {
        document.body.classList.add("dark-mode"); 
        
        if(switchTema) switchTema.checked = true;
        if(iconTema) iconTema.innerHTML = '<i class="fa-solid fa-moon"></i>'; 
    } else {
        document.body.classList.remove("dark-mode");
        
        if(switchTema) switchTema.checked = false; 
        if(iconTema) iconTema.innerHTML = '<i class="fa-solid fa-sun"></i>'; 
    }
});