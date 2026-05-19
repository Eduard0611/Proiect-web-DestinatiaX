window.onload= function(){
    document.getElementById("filtrare").onclick = function(){
        let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase()

        let produse = document.getElementsByClassName("produs")
        for (let prod of produse){
            prod.style.display = "none"

            let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()

            let cond1 = nume.includes(inpNume)

            if (cond1) {
                prod.style.display = "block"
            }
        }
    }

    document.getElementById("resetare").onclick=function(){
        
        document.getElementById("inp-nume").value=""
        document.getElementById("inp-pret").value="0"
        document.getElementById("infoRange").innerHTML="(0)"
        document.getElementById("inp-categorie").value="toate"
        document.getElementById("i_rad4").checked=true

        let produse=document.getElementsByClassName("produs")
        for (let prod of produse){
            prod.style.display="block"
        }

    }
}
