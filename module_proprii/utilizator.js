const AccesBD=require('./accesbd.js');
const parole=require('./parole.js');

const {RolFactory}=require('./roluri.js');
const crypto=require("crypto");
const nodemailer=require("nodemailer");

/**
 * Clasa reprezentand un utilizator al aplicatiei.
 */
class Utilizator{
    static tipConexiune="local";
    static tabel="utilizatori"
    static parolaCriptare="tehniciweb";
    static emailServer="test.tweb.node@gmail.com";
    static lungimeCod=64;
    static numeDomeniu="localhost:8080";
    #eroare;

    constructor({id, username, nume, prenume, email, parola, rol, culoare_chat="black", poza}={}) {
        this.id = id;

        try {
            if(username === undefined || this.checkUsername(username)) this.username = username;
            else throw new Error("Username incorect");

            if(nume === undefined || this.checkName(nume)) this.nume = nume;
            else throw new Error("Nume incorect (trebuie sa contina doar litere si sa inceapa cu litera mare)");

            if(prenume === undefined || this.checkName(prenume)) this.prenume = prenume;
            else throw new Error("Prenume incorect (trebuie sa contina doar litere si sa inceapa cu litera mare)");

            if(email === undefined || this.checkEmail(email)) this.email = email;
            else throw new Error("Format email incorect");

        } catch(e) { 
            this.#eroare = e.message; 
        }

        for(let prop in arguments[0]){ 
            if(prop !== "username" && prop !== "nume" && prop !== "prenume" && prop !== "email") {
                this[prop] = arguments[0][prop];
            }
        }

        if(this.rol) {
            this.rol = this.rol.cod ? RolFactory.creeazaRol(this.rol.cod) : RolFactory.creeazaRol(this.rol);
        }

        if (!this.#eroare) this.#eroare = "";
    }

    /**
     * Verifica daca numele contine doar litere si incepe cu majuscula.
     * @param {string} nume - Numele de verificat.
     * @returns {boolean} True daca este valid, altfel false.
     */
    checkName(nume){
        return nume!="" && nume.match(new RegExp("^[A-Z][a-z]+$")) ;
    }

    /**
     * Seteaza numele utilizatorului, verificand daca este valid.
     * @param {string} nume - Numele de setat.
     */
    set setareNume(nume){
        if (this.checkName(nume)) this.nume=nume
        else{
            throw new Error("Nume gresit")
        }
    }

    /**
     * Folosit doar la inregistrare si modificare profil
     */
    set setareUsername(username){
        if (this.checkUsername(username)) this.username=username
        else{
            throw new Error("Username gresit")
        }
    }

    /**
     * Verifica daca username-ul este valid
     * @param {string} username - Username-ul de verificat.
     * @returns {boolean} True daca este valid, altfel false.
     */
    checkUsername(username){
        return username!="" && username.match(new RegExp("^[A-Za-z0-9#_./]+$")) ;
    }

    checkEmail(email) {
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email && email.match(regex);
    }

    /**
     * O metoda care primeste un obiect cu noile date ale utilizatorului si modifica inregistrarea din tabel.
     * Arunca o eroare daca utilizatorul nu exista.
     */
    async modifica(obiectNou) {
        let rezultat = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({
            tabel: Utilizator.tabel,
            campuri: ["id"],
            conditiiAnd: [`id=${this.id}`]
        });

        if (!rezultat || rezultat.rowCount === 0) {
            throw new Error("Eroare la modificare: Utilizatorul nu exista in baza de date!");
        }

        AccesBD.getInstanta(Utilizator.tipConexiune).update({
            tabel: Utilizator.tabel,
            campuri: obiectNou,
            conditiiAnd: [`id=${this.id}`]
        }, function(err, rez) {
            if (err) console.error("Eroare la update utilizator:", err);
        });
    }

    /**
     * Sterge din tabel utilizatorul curent si arunca o eroare daca acesta nu exista.
     */
    async sterge() {
        let rezultat = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({
            tabel: Utilizator.tabel,
            campuri: ["id"],
            conditiiAnd: [`id=${this.id}`]
        });

        if (!rezultat || rezultat.rowCount === 0) {
            throw new Error("Eroare la stergere: Utilizatorul nu exista in baza de date!");
        }

        AccesBD.getInstanta(Utilizator.tipConexiune).delete({
            tabel: Utilizator.tabel,
            conditiiAnd: [`id=${this.id}`]
        }, function(err, rez) {
            if (err) console.error("Eroare la delete utilizator:", err);
        });
    }

    /**
     * Metoda statica sincrona care cauta utilizatori pe baza unui obiect de parametri.
     * Returneaza prin callback un vector de obiecte de tip Utilizator.
     */
    static cauta(obParam, callback) {
        let conditii = [];
        for (let prop in obParam) {
            if (obParam[prop] !== undefined) {
                conditii.push(`${prop}='${obParam[prop]}'`);
            }
        }

        AccesBD.getInstanta(Utilizator.tipConexiune).select({
            tabel: Utilizator.tabel,
            campuri: ['*'],
            conditiiAnd: conditii
        }, function(err, rez) {
            if (err) {
                callback(err, []);
            } else {
                let listaUtilizatori = rez.rows.map(rand => new Utilizator(rand));
                callback(null, listaUtilizatori);
            }
        });
    }

    /**
     * Metoda statica asincrona care cauta utilizatori pe baza unui obiect de parametri.
     */
    static async cautaAsync(obParam) {
        let conditii = [];
        for (let prop in obParam) {
            if (obParam[prop] !== undefined) {
                conditii.push(`${prop}='${obParam[prop]}'`);
            }
        }

        try {
            let rez = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({
                tabel: Utilizator.tabel,
                campuri: ['*'],
                conditiiAnd: conditii
            });

            if (rez && rez.rows) {
                return rez.rows.map(rand => new Utilizator(rand));
            }
            return [];
        } catch(e) {
            console.error("Eroare cautaAsync:", e);
            return [];
        }
    }

    /**
     * Cripteaza parola folosind algoritmul scrypt.
     * @param {string} parola - Parola in format clar.
     * @returns {string} Parola criptata (hex).
     */
    static criptareParola(parola){
        return crypto.scryptSync(parola,Utilizator.parolaCriptare,Utilizator.lungimeCod).toString("hex");
    }

    /**
     * Insereaza utilizatorul curent in baza de date si ii trimite mailul de confirmare a inregistrarii.
     */
    salvareUtilizator(){
        let parolaCriptata=Utilizator.criptareParola(this.parola);
        let utiliz=this;
        let token=parole.genereazaToken(100);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({tabel:Utilizator.tabel,
            campuri:{
                username:this.username,
                nume: this.nume,
                prenume:this.prenume,
                parola:parolaCriptata,
                email:this.email,
                culoare_chat:this.culoare_chat,
                cod:token,
                poza:this.poza}
            }, function(err, rez){
            if(err)
                console.log(err);
            else
                utiliz.trimiteMail("Te-ai inregistrat cu succes","Username-ul tau este "+utiliz.username,
            `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`,
            )
        });
    }

    /**
     * Trimite un email catre adresa utilizatorului curent.
     * @param {string} subiect - Subiectul email-ului.
     * @param {string} mesajText - Corpul email-ului formatat ca text simplu.
     * @param {string} mesajHtml - Corpul email-ului formatat ca HTML.
     * @param {Array} [atasamente=[]] - Lista optionala de fisiere atasate.
     */
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{ 
                user:Utilizator.emailServer,
                pass:"rwgmgkldxnarxrgu"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        
        await transp.sendMail({
            from:Utilizator.emailServer,
            to:this.email,
            subject:subiect,
            text:mesajText,
            html: mesajHtml,
            attachments: atasamente
        })
        console.log("trimis mail");
    }

    /**
     * Cauta in mod asincron un utilizator in baza de date folosind username-ul.
     * @param {string} username - Username-ul cautat.
     * @returns {Promise<Utilizator|null>} O instanta Utilizator daca este gasit, altfel null.
     */
    static async getUtilizDupaUsernameAsync(username){
        if (!username) return null;
        try{
            let rezSelect= await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]
            });
            if(rezSelect.rowCount!=0){
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e){
            console.log(e);
            return null;
        }
        
    }

    /**
     * Cauta un utilizator in baza de date si apeleaza o functie callback cu rezultatul.
     * @param {string} username - Username-ul cautat.
     * @param {Object} obparam - Parametri aditionali trimisi mai departe catre callback.
     * @param {Function} proceseazaUtiliz - Functia callback care va procesa utilizatorul gasit.
     */
    static getUtilizDupaUsername (username, obparam, proceseazaUtiliz){
        if (!username) return null;
        let eroare=null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]}
        , function (err, rezSelect){
            if(err){
                console.error("Utilizator:", err);
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1;
            }
            
            let u= new Utilizator(rezSelect.rows[0])
            proceseazaUtiliz(u, obparam, eroare);
        });
    }

    /**
     * Verifica daca utilizatorul curent are un anumit drept pe baza rolului sau.
     * @param {Symbol} drept - Dreptul care se verifica.
     * @returns {boolean} True daca are permisiunea, altfel false.
     */
    areDreptul(drept){
        return this.rol.areDreptul(drept);
    }
}

module.exports={Utilizator:Utilizator}