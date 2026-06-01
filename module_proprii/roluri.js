
const Drepturi=require('./drepturi.js');

/**
 * Clasa de baza pentru definirea unui rol generic de utilizator.
 */
class Rol{
    static get tip() {return "generic"}
    static get drepturi() {return []}
    constructor (){
        this.cod=this.constructor.tip;
    }


    /**
     * Verifica daca acest rol include dreptul specificat.
     * @param {Symbol} drept - Dreptul de verificat.
     * @returns {boolean}
     */
    areDreptul(drept){ //drept trebuie sa fie tot Symbol
        console.log("in metoda rol!!!!")
        return this.constructor.drepturi.includes(drept); 
    }
}


class RolAdmin extends Rol{
    
    static get tip() {return "admin"}
    constructor (){
        super();
        
    }

    areDreptul(){
        return true; //pentru ca e admin
    }
}

class RolModerator extends Rol{
    
    static get tip() {return "moderator"}
    static get drepturi() { return [
        Drepturi.vizualizareUtilizatori,
        Drepturi.stergereUtilizatori
    ] }
    constructor (){
        super()
    }
}

class RolClient extends Rol{
    static get tip() {return "comun"}
    static get drepturi() { return [
        Drepturi.cumparareProduse
    ] }
    constructor (){
        super()
    }
}

/**
 * Clasa Factory (Sablonul Factory) responsabila de instantierea claselor de rol corespunzatoare.
 */
class RolFactory{
    /**
     * Creeaza si returneaza o instanta a unui rol in functie de codul sau tipul primit.
     * @param {string} tip - Tipul de rol (ex: "admin", "moderator", "comun").
     * @returns {Rol} O instanta a rolului specific.
     */
    static creeazaRol(tip) {
        switch(tip){
            case RolAdmin.tip : return new RolAdmin();
            case RolModerator.tip : return new RolModerator();
            case RolClient.tip : return new RolClient();
            default: return new Rol();
        }
    }
}


module.exports={
    Rol: Rol,
    RolFactory: RolFactory
}