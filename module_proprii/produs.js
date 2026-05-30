/**
 * Clasa reprezentand structura unui produs de tip zbor.
 */
class Produs{

    /**
     * Mapare automata a proprietatilor primite catre instanta clasei.
     * @param {Object} obj - Obiect continand campurile din baza de date pentru produs.
     */
    constructor({id, titlu_zbor, descriere, imagine, continent, clasa, pret, locuri_disponibile, data_plecare, data_sosire, companie_aeriana, facilitati, zbor_international, tip_zbor, oras_plecare, oras_sosire}={}) {

        for(let prop in arguments[0]){
            this[prop]=arguments[0][prop]
        }

    }

}