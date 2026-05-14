# Proiect Web - Tehnici Web

Acesta este un proiect web dezvoltat cu Node.js, Express, EJS și SASS. Mai jos sunt instrucțiunile necesare pentru a-l rula pe o altă mașină.

Înainte de toate, asigurați-vă că aveți instalat instalat pe calculatorul d-voastră:
*   [Node.js](https://nodejs.org/). Instalarea Node.js va adăuga automat și `npm` (Node Package Manager).
*   PostgreSQL. Sistemul de gestiune a bazelor de date relaționale.

## Instalare

1.  **Clonați repository-ul.**

2.  **Deschideți un terminal** (Command Prompt, PowerShell, sau orice alt terminal) și navigați în directorul rădăcină al proiectului.

3.  **Instalați dependențele necesare.**
    Rulați următoarea comandă pentru a instala pachetele de care proiectul are nevoie (se vor citi și instala automat din `package.json`):

    ```bash
    npm install
    ```

## Configurare Bază de Date

Aplicația necesită o bază de date PostgreSQL pentru a funcționa corect (conține tabele pentru zboruri).

1. Deschideți utilitarul `psql` sau `pgAdmin`.
2. Creați o bază de date nouă denumită **`destinatiax_bd`**.
3. Rulați pe rând, în această bază de date, scripturile SQL incluse în proiect, pentru a crea utilizatorul, tabelele și a le popula cu date:
   * `Creeare_Utilizator.sql` - creează utilizatorul `admin_destinatiax` cu parola `parola` și îi dă permisiuni.
   * `Script_bd.sql` - creează tabela `zboruri` și adaugă date de test.

## Rularea aplicației

După ce ați instalat cu succes dependențele, puteți porni serverul.

1.  **În același terminal, rulați comanda:**
    ```bash
    node index.js
    ```

2.  Serverul va porni, iar în consolă veți vedea mesajul: `Serverul a pornit!`.

3.  **Deschideți un browser web și accesați adresa:** http://localhost:8080
