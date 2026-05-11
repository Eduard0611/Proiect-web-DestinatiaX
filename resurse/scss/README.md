# Proiect Web - Tehnici Web

Acesta este un proiect web dezvoltat cu Node.js, Express, EJS și SASS. Mai jos sunt instrucțiunile necesare pentru a-l rula pe o altă mașină.



Înainte de toate, asigurați-vă că aveți instalat pe calcultorul d-voastră:
*   [Node.js](https://nodejs.org/). Instalarea Node.js va adăuga automat și `npm` (Node Package Manager).

## Instalare

1.  **Clonați repository-ul.**

2.  **Deschideți un terminal** (Command Prompt, PowerShell, sau orice alt terminal) și navigați în directorul rădăcină al proiectului.

3.  **Instalați dependențele necesare.**
    Rulați următoarea comandă pentru a instala pachetele de care proiectul are nevoie:

    ```bash
    npm install express sass sharp ejs
    ```
    
    *   `express`: Framework-ul pentru serverul web.
    *   `sass`: Pentru compilarea fișierelor SCSS în CSS.
    *   `sharp`: Pentru procesarea și optimizarea imaginilor din galerie.
    *   `ejs`: Motorul de template-uri folosit pentru a genera paginile HTML.

## Rularea aplicației

După ce ați instalat cu succes dependențele, puteți porni serverul.

1.  **În același terminal, rulați comanda:**
    ```bash
    node index.js
    ```

2.  Serverul va porni, iar în consolă veți vedea mesajul: `Serverul a pornit!`.

3.  **Deschideți un browser web și accesați adresa:** http://localhost:8080
