window.onload= function(){

    let zboruriInit = Array.from(document.getElementsByClassName("zboruri"));

    document.getElementById("inp-locuri").oninput = function(){
        document.getElementById("infoRange").innerHTML = `(${this.value})`;
    }


    document.getElementById("filtrare").onclick = function(){
        let inpDestinatie = document.getElementById("inp-destinatie").value.trim().toLowerCase();
  

        let escalaGrupRadio = document.getElementsByName("gr_rad");
        let valEscalaCautata = "toate";
        for (let rad of escalaGrupRadio){
            if (rad.checked){
                    valEscalaCautata = rad.value.toLowerCase();
                    break;
                }
            }

        let inpCompanieZbor = document.getElementById("inp-companie").value.trim().toLowerCase();


        
        let zboruri = document.getElementsByClassName("zboruri");
        for (let zbor of zboruri){
            zbor.style.display = "none";

            let dest = zbor.getElementsByClassName("val-destinatie")[0].innerHTML.trim().toLowerCase();
            let cond1 = dest.includes(inpDestinatie);


            let valEscala = zbor.getElementsByClassName("val-escala")[0].innerHTML.trim().toLowerCase();
            let cond2 = (valEscalaCautata == "toate") || (valEscalaCautata == valEscala);

            let valCompanie = zbor.getElementsByClassName("val-companie")[0].innerHTML.trim().toLowerCase();
            let cond3 = (inpCompanieZbor == "") || (valCompanie == inpCompanieZbor);



            if (cond1 && cond2 && cond3){
                zbor.style.display = "grid"; 
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

            document.getElementById("inp-destinatie").value = "";
            document.getElementById("inp-companie").value = "";
            document.getElementById("gr_rad4").checked = true;
            document.getElementById("inp-locuri").value = "0";
            document.getElementById("infoRange").innerHTML = "(0)";
            document.getElementById("inp-descriere").value = "";
            document.getElementById("inp-international").checked = false;
            document.getElementById("inp-categorie").value = "toate";
            let zboruri = document.getElementsByClassName("zboruri");
            let zboruriInit = Array.from(document.getElementsByClassName("zboruri")); 
            
            for (let zbor of zboruriInit){
                zbor.style.display = "grid";
                zbor.parentElement.parentElement.appendChild(zbor.parentElement);
            }
        }
    }
}