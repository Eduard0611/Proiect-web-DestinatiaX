window.onload= function(){

    // Salvăm ordinea inițială a zborurilor la încărcarea paginii
    let zboruriInit = Array.from(document.getElementsByClassName("zboruri"));

    document.getElementById("filtrare").onclick = function(){
        let inpDestinatie = document.getElementById("inp-destinatie").value.trim().toLowerCase()

        let zboruri = document.getElementsByClassName("zboruri")
        for (let zbor of zboruri){
            zbor.style.display = "none"

            let nume = zbor.getElementsByClassName("val-destinatie")[0].innerHTML.trim().toLowerCase()

            let cond1 = nume.includes(inpDestinatie)

            if (cond1) {
                zbor.style.display = "grid"
            }
        }
    }

    
        


    function sorteaza(semn) {

        let zboruri = document.getElementsByClassName("zboruri")
        let vZboruri = Array.from(zboruri)
        vZboruri.sort(function(a,b){
            let pretA = parseFloat(a.getElementsByClassName("pret-zbor")[0].innerHTML.trim());
            let pretB = parseFloat(b.getElementsByClassName("pret-zbor")[0].innerHTML.trim());
            
            if (pretA == pretB) {
                let destA = a.getElementsByClassName("val-destinatie")[0].innerHTML.trim().toLowerCase();
                let destB = b.getElementsByClassName("val-destinatie")[0].innerHTML.trim().toLowerCase();

                return semn * destA.localeCompare(destB);
            }
            return semn * (pretA - pretB);
        })
        
        for (let zbor of vZboruri){
            zbor.parentElement.parentElement.appendChild(zbor.parentElement)
        }

    }

    document.getElementById("sortCrescPret").onclick = function(){sorteaza(1)} 
    document.getElementById("sortDescrescPret").onclick = function(){sorteaza(-1)} 


    window.onkeydown = function(e){
        if (e.key == 'c' &&  e.altKey){
            let zboruri = document.getElementsByClassName("zboruri");
            let suma = 0;
            for (let zbor of zboruri){
                if (zbor.style.display != "none")
                    suma += parseFloat(zbor.getElementsByClassName("pret-zbor")[0].innerHTML.trim())
            }

            let p = this.document.getElementById("infoSuma")

            if (!p){
                let p = this.document.createElement("p")
                p.innerHTML = suma
                p.id = "infoSuma"
                let sectiuneZboruri = this.document.getElementById("produse")
                sectiuneZboruri.parentElement.insertBefore(p, sectiuneZboruri)
                this.setTimeout(function(){
                    let p1 = this.document.getElementById("infoSuma") 
                    p1.remove()
                }, 2000)
            }
            else {
                p.innerHTML = suma 
            }


        }
    }



    document.getElementById("resetare").onclick = function(){
        let raspuns = confirm("Sunteți sigur că doriți să resetați filtrele?");
        if (raspuns) {
            document.getElementById("inp-destinatie").value=""
            document.getElementById("inp-pret").value="0"
            document.getElementById("infoRange").innerHTML="(2000)"
            document.getElementById("inp-categorie").value="toate"
            document.getElementById("i_rad4").checked=true

            for (let zbor of zboruriInit){
                zbor.style.display="grid"
                zbor.parentElement.parentElement.appendChild(zbor.parentElement)
            }
        }

    }
}