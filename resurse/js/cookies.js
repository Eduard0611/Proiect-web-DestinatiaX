

//setCookie("a",10, 1000)
function setCookie(nume, val, timpExpirare){//timpExpirare in milisecunde
    let d=new Date();
    d.setTime(d.getTime()+timpExpirare)
    document.cookie=`${nume}=${val}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(nume){
    let vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"]
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume+"="))
            return param.split("=")[1]
    }
    return null;
}

function deleteCookie(nume){
    document.cookie = `${nume}=0; expires=${(new Date(0)).toUTCString()}; path=/`;
}

function deleteAllCookies() {
    let vectorParametri = document.cookie.split(";");
    for(let param of vectorParametri) {
        let numeCookie = param.split("=")[0].trim();
        deleteCookie(numeCookie);
    }
    console.log("Toate cookie-urile au fost șterse!");
}

window.addEventListener("load", function(){
    let banner = document.getElementById("banner");
    if (banner) {
        if (getCookie("acceptat_banner")){
            banner.style.display="none";
        } else {
            banner.style.display="flex"; 
            document.getElementById("ok_cookies").onclick=function(){
                setCookie("acceptat_banner", "true", 5000); 
                banner.style.display="none"
            }
        }
    }

    let paginaCurenta = window.location.pathname;
    let ultimaPagina = getCookie("ultima_pagina");
    let paragrafInfo = document.getElementById("info_ultima_pagina");
    
    if (paragrafInfo) {
        if (ultimaPagina) {
            paragrafInfo.innerHTML = "Ultima pagină vizitată: " + ultimaPagina;
        } else {
            paragrafInfo.innerHTML = "Aceasta este prima vizită pe site (sau au fost șterse cookies).";
        }
    }
    
    setCookie("ultima_pagina", paginaCurenta, 24*60*60*1000); 
})
