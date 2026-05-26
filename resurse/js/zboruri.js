window.onload= function(){

    let zboruriInit = Array.from(document.getElementsByClassName("zboruri"));

    let minPreturi = {};

    for (let zbor of zboruriInit) {
        let categorie = zbor.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
        let pret = parseFloat(zbor.getElementsByClassName("pret-zbor")[0].innerHTML.trim());
        
        if (minPreturi[categorie] === undefined || pret < minPreturi[categorie]) {
            minPreturi[categorie] = pret;
        }
    }

    for (let zbor of zboruriInit) {
        let categorie = zbor.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
        let pret = parseFloat(zbor.getElementsByClassName("pret-zbor")[0].innerHTML.trim());
        
        if (pret === minPreturi[categorie]) {
            zbor.classList.add("produs-ieftin"); 
        }
    }

    let idInputuriText = ["inp-destinatie", "inp-companie", "inp-descriere"];
    for (let id of idInputuriText) {
        let input = document.getElementById(id);
        if (input) {
            input.oninput = function() {
                this.classList.remove("is-invalid");
            };
        }
    }

    function valideazaInputuri(){
        let valid = true;
        let erori = [];

        let regTextStandard = /^[a-zA-Z\s\-ăâîșțĂÂÎȘȚ]*$/; 

        // validare destinatie
        let inpDestinatie = document.getElementById("inp-destinatie");
        if (!regTextStandard.test(inpDestinatie.value.trim())) {
            inpDestinatie.classList.add("is-invalid");
            erori.push("- Destinația poate conține doar litere, spații și cratimă.");
            valid = false;
        }

        // validare companie 
        let inpCompanie = document.getElementById("inp-companie");
        if (!regTextStandard.test(inpCompanie.value.trim())) {
            inpCompanie.classList.add("is-invalid");
            erori.push("- Compania poate conține doar litere, spații și cratimă.");
            valid = false;
        }

        // validare textarea
        let inpDescriere = document.getElementById("inp-descriere");
        let regDescriere = /^[a-zA-Z\s\+\-ăâîșțĂÂÎȘȚ]*$/; 

        if (!regDescriere.test(inpDescriere.value.trim())) {
            inpDescriere.classList.add("is-invalid");
            erori.push("- Descrierea conține caractere nepermise (folosiți doar litere, + și -).");
            valid = false;
        }

        if (!valid) {
            alert("Eroare de validare:\n" + erori.join("\n"));
        }

        return valid;
    }

    function aplicaFiltre() {

        if (!valideazaInputuri()) { return; }


        // Filtru dupa destinatie
        let inpDestinatie = document.getElementById("inp-destinatie").value.trim().toLowerCase();

        // Filtru dupa escala 
        let escalaGrupRadio = document.getElementsByName("gr_rad");
        let valEscalaCautata = "toate";
        for (let rad of escalaGrupRadio){
            if (rad.checked){
                    valEscalaCautata = rad.value.toLowerCase();
                    break;
                }
            }

        // Filtru dupa companie
        let inpCompanieZbor = document.getElementById("inp-companie").value.trim().toLowerCase();

        //Filru dupa numarul de locuri
        let inpLocuriMin = parseInt(document.getElementById("inp-locuri").value.trim());

        //Filtru dupa clasa
        let inpClasa = document.getElementById("inp-categorie-clasa").value.trim().toLowerCase();

        // Filtru select multiplu (Pret)
        let inpPret = document.getElementById("inp-pret");
        let optiuniPretBifate = [];
        for (let opt of inpPret.options) {
            if (opt.selected) {
                optiuniPretBifate.push(opt.value);
            }
        }

        // Filtru textarea (Descriere)
        let textDescriere = document.getElementById("inp-descriere").value.trim().toLowerCase();
        let vectCuvinte = textDescriere.split(/\s+/);
        let cuvIncluse = [];
        let cuvExcluse = [];

        for (let cuv of vectCuvinte) {
            if (cuv.startsWith("+") && cuv.length > 1) {
                cuvIncluse.push(cuv.substring(1)); 
            } else if (cuv.startsWith("-") && cuv.length > 1) {
                cuvExcluse.push(cuv.substring(1));
            } else if (cuv.length > 0 && cuv !== "+" && cuv !== "-") {
                cuvIncluse.push(cuv);
            }
        }

        // Filtru checkbox (zbor international)
        let chkInternational = document.getElementById("inp-international").checked;


        let contorZboruri = 0;
        let zboruri = document.getElementsByClassName("zboruri");
        for (let zbor of zboruri){
            zbor.style.display = "none";

            let dest = zbor.getElementsByClassName("val-destinatie")[0].innerHTML.trim().toLowerCase();
            let cond1 = dest.includes(inpDestinatie);

            let valEscala = zbor.getElementsByClassName("val-escala")[0].innerHTML.trim().toLowerCase();
            let cond2 = (valEscalaCautata == "toate") || (valEscalaCautata == valEscala);

            let valCompanie = zbor.getElementsByClassName("val-companie")[0].innerHTML.trim().toLowerCase();
            let cond3 = (inpCompanieZbor == "") || (valCompanie.includes(inpCompanieZbor));

            let locuri = parseInt(zbor.getElementsByClassName("val-locuri")[0].innerHTML.trim());
            let cond4 = (locuri >= inpLocuriMin)

            let clasa = zbor.getElementsByClassName("val-clasa")[0].innerHTML.trim().toLowerCase();
            let cond5 = (inpClasa == "toate") || (inpClasa == clasa);

            let pretZbor = parseFloat(zbor.getElementsByClassName("pret-zbor")[0].innerHTML.trim());
            let cond6 = false;

            if (optiuniPretBifate.length == 0){
                cond6 = true;
            } else {
                for (let optiune of optiuniPretBifate){

                    let [min, max] = optiune.split("-");
                    let pretMin = parseFloat(min);
                    let pretMax = parseFloat(max);

                    if (pretZbor >= pretMin && pretZbor <= pretMax){
                        cond6 = true;
                        break;
                    }
                }
            }
             
            let descriereZbor = zbor.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase();
            let cond7 = true;

            for (let cuvInc of cuvIncluse){
                if (!descriereZbor.includes(cuvInc)){
                    cond7 = false;
                    break;
                }
            }

            if (cond7){
                for (let cuvExc of cuvExcluse){
                    if (descriereZbor.includes(cuvExc)){
                        cond7 = false;
                        break;
                    }
                }
            }

            let zborInternational = zbor.getElementsByClassName("val-international")[0].innerHTML.trim().toLowerCase();
            let cond8 = (!chkInternational) || (zborInternational == "true");

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8){
                zbor.style.display = "grid"; 
                contorZboruri = contorZboruri + 1;
            }
        }

        if (contorZboruri == 0){
            document.getElementById("nu-sunt-zboruri").innerHTML = "Nu s-a găsit niciun zbor disponibil. Ne pare rău."
        } else {
            if (contorZboruri == 1) {
                document.getElementById("nu-sunt-zboruri").innerHTML = "S-a găsit un zbor care indeplinește condițiile d-voastră."
            } else {
                document.getElementById("nu-sunt-zboruri").innerHTML = `S-au găsit ${contorZboruri} zboruri care indeplinesc condițiile d-voastră.`
            }
        }
    }

    document.getElementById("filtrare").onclick = aplicaFiltre;

    document.getElementById("inp-destinatie").oninput = aplicaFiltre;
    document.getElementById("inp-companie").oninput = aplicaFiltre;
    document.getElementById("inp-descriere").oninput = aplicaFiltre;
    document.getElementById("inp-categorie-clasa").onchange = aplicaFiltre;
    document.getElementById("inp-pret").onchange = aplicaFiltre;
    document.getElementById("inp-international").onchange = aplicaFiltre;

    let radioEscala = document.getElementsByName("gr_rad");
    for (let rad of radioEscala) {
        rad.onchange = aplicaFiltre;
    }

    document.getElementById("inp-locuri").oninput = function(){
        let val  = this.value.trim()
        document.getElementById("infoRange").innerHTML = `(${val})`;
        aplicaFiltre();
    }
    

    function sorteaza(semn) {

        if (!valideazaInputuri()) return;

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
            if (!valideazaInputuri()) return;

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
            document.getElementById("inp-categorie-clasa").value = "toate";
            document.getElementById("inp-pret").selectedIndex = -1;
            let zboruri = document.getElementsByClassName("zboruri");
            let zboruriInit = Array.from(document.getElementsByClassName("zboruri")); 
            
            for (let zbor of zboruriInit){
                zbor.style.display = "grid";
                zbor.parentElement.parentElement.appendChild(zbor.parentElement);
            }
        }
    }
}