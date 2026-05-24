const express= require("express");
const path= require("path");
const fs= require("fs"); 
const sass= require("sass");
const sharp= require("sharp");

// const ejs= require("ejs");
const pg= require("pg");

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


// Conectarea la baza de date

client= new pg.Client({
    database: "destinatiax_bd",
    user: "admin_destinatiax",
    password: "parola",
    host: "localhost",
    port: 5432,
});


client.connect()
    .then(() => {
        console.log("Conectat cu succes la baza de date!")
        client.query(`select unnest(enum_range(null::continente)) as continent`)
        .then(rez => app.locals.continente = rez.rows).catch(err => console.log(err))
    })
    .catch(err => console.error("Eroare la conectare: ", err.stack));

// client.query("select * from zboruri where id > 3", function(err, rez){
//     if (err){
//         console.log("Eroare", err)
//     }
//     else {
//         // console.log(rez)
//     }
// });





let vect_foldere=[ "temp", "logs", "backup", "fisiere_uploadate" ]
for (let folder of vect_foldere){
    let caleFolder=path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(path.join(caleFolder), {recursive:true});   
    }
}

app.use("/resurse", express.static(path.join(__dirname, "resurse")));
app.use("/dist", express.static(path.join(__dirname, "/node_modules/bootstrap/dist")));

// app.get("/:a/:b", function (req, res){
//     res.sendFile(path.join(__dirname, "index.html"));
// });

app.get ("/favicon.ico", function (req, res){
    res.sendFile(path.join(__dirname, "resurse/ico/favicon.ico"));
});


app.get(["/", "/index", "/home"], function (req, res){
    //res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/index", {
        ip: req.ip,
        imagini: obGlobal.obImagini.imagini
    });

});

app.get("/despre", function (req, res){
    res.render("pagini/despre");
});


// app.get("/produse", function (req, res){

//     let clauzaWhere= ""

//     if(req.query.tip){
//         clauzaWhere=`where tip_produs='${req.query.tip}'`
//     }

//     client.query(`select * from prajituri ${clauzaWhere}`, function(err, rez){

//         if (err){
//             console.log("Eroare", err)
//             afisareEroare(rez, 2)
//         }
//         else {

//             res.render("pagini/produse", {
//                 produse: rez.rows,
//                 optiuni: []
//             })
//         }
//     });
// });

// app.get("/produs/:id", function (req, res){

//     client.query(`select * from prajituri where id = ${req.params.id}`, function(err, rez){

//         if (err){
//             console.log("Eroare", err)
//             afisareEroare(rez, 2)
//         }
//         else {
//             if(rez.rowCount == 0){
//                 afisareEroare(res, 404, "Produsul nu a fost găsit!!!")
//             }
//             else{
//                 res.render("pagini/produs", {
//                     prod: rez.rows[0],
//                 })
//             }
//         }
//     });
// });


app.get("/zboruri", function (req, res){

    let clauzaWhere= ""

    if(req.query.tip){
        clauzaWhere=`where continent='${req.query.tip}'`
    }

    client.query(`select * from zboruri ${clauzaWhere}`, function(err, rez){

        if (err){
            console.log("Eroare extragere zboruri", err)
            afisareEroare(res, 2)
            return;
        }
        
        client.query(`select distinct companie_aeriana from zboruri`, function(err, rezCompanii){
            if (err){
                console.log("Eroare extragere companii zbor", err);
                afisareEroare(res, 2);
                return;
            }

            client.query(`select unnest(enum_range(null::clase_zbor)) as clasa`, function(err, rezClase){
                if (err){
                    console.log("Eroare extragere clase zbor", err);
                    afisareEroare(res, 2);
                    return;
                }


                res.render("pagini/zboruri", {
                    zboruri: rez.rows,
                    clase: rezClase.rows,
                    companii: rezCompanii.rows,
                    optiuni: []
                });
            });
        });
    });
});

app.get("/zbor/:id", function (req, res){

    client.query(`select * from zboruri where id = ${req.params.id}`, function(err, rez){

        if (err){
            console.log("Eroare", err)
            afisareEroare(rez, 2)
        }
        else {
            if(rez.rowCount == 0){
                afisareEroare(res, 404, "Zborul nu a fost găsit!!!")
            }
            else{
                res.render("pagini/zbor", {
                    zbor: rez.rows[0],
                })
            }
        }
    });
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

function afisareEroare(res, identificator, titlu, text, imagine){

    let eroare= obGlobal.obErori.info_erori.find((elem) =>
        elem.identificator==identificator
    );

    let errDefault= obGlobal.obErori.eroare_default;

    if (eroare?.status)
        res.status(eroare.identificator);


    res.render("pagini/eroare",{
        imagine: imagine || eroare?.imagine || errDefault.imagine,
        titlu: titlu || eroare?.titlu || errDefault.titlu,
        text: text || eroare?.text || errDefault.text,
    });
}

app.get("/eroare", function (req, res){
    afisareEroare(res, 404, "Titlu !!!!")
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


// Etapa 5 - Cerintele

function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleGalerie=obGlobal.obImagini.cale_galerie

    let caleAbs=path.join(__dirname,caleGalerie);
    let caleAbsMediu=path.join(caleAbs, "mediu");
    let caleAbsMic=path.join(caleAbs, "mic");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);
    
    for (let imag of vImagini){
        let [numeFis, ext]=imag.cale_imagine.split("."); //"ceva.png" -> ["ceva", "png"]
        let caleFisAbs=path.join(caleAbs,imag.cale_imagine);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        let caleFisMicAbs=path.join(caleAbsMic, numeFis+".webp");
        
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        sharp(caleFisAbs).resize(150).toFile(caleFisMicAbs);

        imag.cale_imagine_medie=path.join("/", caleGalerie, "mediu", numeFis+".webp" );
        imag.cale_imagine_mica=path.join("/", caleGalerie, "mic", numeFis+".webp" );

        imag.cale_imagine=path.join("/", caleGalerie, imag.cale_imagine );

    }
    // console.log(obGlobal.obImagini)
}
initImagini();


function compileazaScss(caleScss, caleCss){
    if(!caleCss){

        let numeFisExt=path.basename(caleScss); 
        let numeFis=numeFisExt.split(".")[0]  
        caleCss=numeFis+".css"; 
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss, caleScss)
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss, caleCss)
    
    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
    }

    rez=sass.compile(caleScss, {"sourceMap":true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
    });
    
    fs.writeFileSync(caleCss,rez.css)
    
}

//la pornirea serverului
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    if (eveniment=="change" || eveniment=="rename"){

        }        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        
    }
})

// Etapa 5 - Cerintele


app.get("/*pagina", function(req, res){
    console.log("Cale pagina", req.url);
    if (req.url.startsWith("/resurse") && path.extname(req.url)==""){
        afisareEroare(res,403);
        return;
    }
    if (path.extname(req.url)==".ejs"){
        afisareEroare(res,400);
        return;
    }
    try{
      
        res.render("pagini"+req.url, {
            ip: req.ip,
            imagini: obGlobal.obImagini.imagini
        }, 
        function(err, rezRandare) {


            if (err){
                if (err.message.includes("Failed to lookup view")){
                    afisareEroare(res,404)
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                res.send(rezRandare);
                // console.log("Rezultat randare", rezRandare);
            }
        });
    }
    catch(err){
        if (err.message.includes("Cannot find module")){
            afisareEroare(res,404)
        }
        else{
            afisareEroare(res);
        }
    }
});




app.listen(8080);
console.log("Serverul a pornit!");