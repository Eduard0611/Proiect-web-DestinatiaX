const express= require("express");
const path= require("path");
const fs= require("fs"); 
const sass= require("sass");

app= express();
app.set("view engine", "ejs")


obGlobal= {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
}

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);


app.use("/resurse", express.static(path.join(__dirname, "resurse")));

// app.get("/:a/:b", function (req, res){
//     res.sendFile(path.join(__dirname, "index.html"));
// });

app.get(["/", "/index", "/home"], function (req, res){
    //res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/index");
});

app.get("/despre", function (req, res){
    res.render("pagini/despre");
});


function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    let  erori= obGlobal.obErori= JSON.parse(continut)
    let err_default= erori.eroare_default
    err_default.imagine= path.join(erori.cale_baza, err_default.imagine)
    for (let eroare of erori.info_erori){
        eroare.imagine= path.join(erori.cale_baza, eroare.imagine)
    }
}
initErori()

app.get("/eroare", function (req, res){
    res.render("pagini/eroare",
        {
            imagine: obGlobal.obErori.eroare_default.imagine,
            titlu: obGlobal.obErori.eroare_default.titlu,
            text: obGlobal.obErori.eroare_default.text,
        });
});


app.get("/cale", function (req, res){
    console.log("Am primit o cerere GET pe /cale");
    res.send("Raspuns la <b style='color:red'>cererea</b> GET pe /cale");
});

app.get("/cale2", function (req, res){
    res.write("ceva ");
    res.write("altceva ");
    res.end();
});

app.get("/cale2/:a/:b", function (req, res){
    res.send(parseInt(req.params.a) + parseInt(req.params.b));
});


app.listen(8080);
console.log("Serverul a pornit!");