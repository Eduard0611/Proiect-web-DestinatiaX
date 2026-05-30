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
        this.id=id;

        //optional sa facem asta in constructor
        try{
            if(this.checkUsername(username))
                this.username = username;
            else throw new Error("Username incorect");
            // Aici facem restul de verificari pentru celelalte campuri daca e nevoie

        }
        catch(e){ this.#eroare=e.message}

        for(let prop in arguments[0]){ 
            this[prop]=arguments[0][prop]
        }

        if(this.rol)
            this.rol=this.rol.cod? RolFactory.creeazaRol(this.rol.cod):  RolFactory.creeazaRol(this.rol);
        console.log(this.rol);

        this.#eroare="";
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

    /*
    * folosit doar la inregistrare si modificare profil
    */
    set setareUsername(username){
        if (this.checkUsername(username)) this.username=username
        else{
            throw new Error("Username gresit")
        }
    }

    /**
     * Verifica daca username-ul este valid (doar caractere alfanumerice si cateva simboluri permise).
     * @param {string} username - Username-ul de verificat.
     * @returns {boolean} True daca este valid, altfel false.
     */
    checkUsername(username){
        return username!="" && username.match(new RegExp("^[A-Za-z0-9#_./]+$")) ;
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
//xjxwhotvuuturmqm

    // Aici trebuie sa punem un mail al nostru
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
            auth:{//date login 
                user:Utilizator.emailServer,
                pass:"rwgmgkldxnarxrgu"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:Utilizator.emailServer,
            to:this.email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
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
                //throw new Error()
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1;
            }
            //constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza}={})
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