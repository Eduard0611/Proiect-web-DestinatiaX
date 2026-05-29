 window.onload= function(){
    var formular=document.getElementById("form_inreg");
    if(formular){
    formular.onsubmit= function(){
            var parola = document.getElementById("parola");
            var rparola = document.getElementById("rparola");
            
            if(parola && rparola && parola.value != rparola.value){
                alert("Nu ati introdus acelasi sir pentru campurile \"parola\" si \"reintroducere parola\".");
                return false;
            }

            return true;
        }
    }
 }