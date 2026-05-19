window.onload= function(){

    let zboruriInit = Array.from(document.getElementsByClassName("zboruri"));

    document.getElementById("inp-pret").onchange = function(){
        let val = this.value.trim()
        document.getElementById("infoRange").innerHTML = `(${val})`
    }


    document.getElementById("filtrare").onclick = function(){

        let inpDestinatie = document.getElementById("inp-destinatie").value.trim().toLowerCase()

        let grupRadio = document.getElementsByName("gr_rad")
        let valEscalaCautata, isToateEscala = false;

        for (let rad of grupRadio){
            if (rad.checked){
                if (rad.value != "toate"){
                    valEscalaCautata = rad.value.trim().toLowerCase();
                }
                else { 
                    isToateEscala = true;
                }
                break;
            }
        }

        let inpPretMax = parseFloat(document.getElementById("inp-pret").value.trim())
        let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase()
        
        
        let zboruri = document.getElementsByClassName("zboruri")
        for (let zbor of zboruri){
            zbor.style.display = "none"

            let nume = zbor.getElementsByClassName("val-destinatie")[0].textContent.trim().toLowerCase()
            let cond1 = nume.includes(inpDestinatie)

            let escala = zbor.getElementsByClassName("val-escala")[0].textContent.trim().toLowerCase()
            let cond2 = (escala === valEscalaCautata) || isToateEscala;

            let pret = parseFloat(zbor.getElementsByClassName("pret-zbor")[0].textContent.trim())
            let cond3 = (pret <= inpPretMax)

            let clasa = zbor.getElementsByClassName("val-clasa")[0].textContent.trim().toLowerCase()
            let cond4 = (clasa === inpCategorie) || (inpCategorie === "toate")

            if (cond1 && cond2 && cond3 && cond4){
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
                p.innerHTML = "Suma preturilor biletelor afișate este: " + suma + " EUR"
                p.id = "infoSuma"
                let sectiuneZboruri = this.document.getElementById("produse")
                sectiuneZboruri.parentElement.insertBefore(p, sectiuneZboruri)
                this.setTimeout(function(){
                    let p1 = this.document.getElementById("infoSuma") 
                    p1.remove()
                }, 2000)
            }
            else {
                p.innerHTML = "Suma preturilor biletelor afișate este: " + suma + " EUR"
            }


        }
    }


    document.getElementById("resetare").onclick = function(){

        let raspuns = confirm("Sunteți sigur că doriți să resetați filtrele?");
        if (raspuns) {
            document.getElementById("inp-destinatie").value = ""
            document.getElementById("inp-pret").value = "2500" // resetat la max
            document.getElementById("infoRange").innerHTML = "(2500)"
            document.getElementById("inp-categorie").value = "toate"
            document.getElementById("i_rad4").checked = true

            let zboruri = document.getElementsByClassName("zboruri")
            for (let zbor of zboruriInit){
                zbor.style.display = "grid"
                zbor.parentElement.parentElement.appendChild(zbor.parentElement)
            }
        }
    }
}