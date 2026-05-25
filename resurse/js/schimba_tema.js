window.addEventListener("DOMContentLoaded", function() {
    let switchTema = document.getElementById("switch-tema");
    let iconTema = document.getElementById("icon-tema");

    if (switchTema) {
        switchTema.addEventListener("change", function() {
            if (this.checked) {
                document.body.classList.add("dark-mode");
                localStorage.setItem("tema", "dark");
                iconTema.innerHTML = '<i class="fa-solid fa-moon"></i>';
            } else {
                document.body.classList.remove("dark-mode");
                localStorage.setItem("tema", "light");
                iconTema.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }
        });
    }
});