//& VARIABLES
let ballList = document.querySelectorAll(".ballList > *");
let gameBox = document.querySelector(".gameBox");
let currentTrialLine = document.querySelector(".trialLine");
let blankTrialLine = currentTrialLine.cloneNode(true); // On garde la ligne originale en memoire pour la copier
let currentTrialBalls = currentTrialLine.querySelectorAll(".trialLine__bigBalls .ball");
let verifyButton = document.querySelector(".verifyButton");
let currentSmallBalls = currentTrialLine.querySelectorAll(".trialLine .ball--small");
let trialsNumber = document.querySelector(".trials__number");
let startButton = document.querySelector(".playButton--green");
let cancelButton = document.querySelector(".playButton--red");
let resultLine = document.querySelector(".resultLine");
let blankResultLine = resultLine.cloneNode(true);

let hasLost = false;
let hasStarted = false; // Ne pas pouvoir démarrer 2 fois de suite
let currentClassNumber = "";
let arrColorsBalls = ["ball--red", "ball--green", "ball--blue", "ball--yellow", "ball--orange", "ball--pink", "ball--black", "ball--white"];
let arrMysteryBalls = [null, null, null, null];
let arrUserBalls = [null, null, null, null];
let nbRightColors = 0;
let nbWellPlaced = 0;
let nbLives = 10;

//& FUNCTIONS
function getCurrentClassNumber(elt)
{
    return String(elt.classList).split(" ").filter(elt => (new RegExp(/[0-9]/)).test(elt))[0];
}

//& Colorier petites boules
function colorSmallBalls()
{
    let cpyRightColors = nbRightColors;

    //~ Verifs pre-fonction
    if(nbWellPlaced+nbRightColors > currentSmallBalls.length)
    {
        return false;
    }

    let i=0;

    //~ Bien placé = ajoute la classe "rouge"
    for(i=0; i<nbWellPlaced; i++)
    {
        currentSmallBalls[i].classList.add("ball--red");
    }

    //~ Bonne couleur
    for(; i<currentSmallBalls.length; i++)
    {
        if(cpyRightColors>0)
        {
            currentSmallBalls[i].classList.add("ball--white");
            cpyRightColors--; // Qd il vaut 0, on a fait toutes les couleurs bonne couleurs
        }
    }
}

//& Parametrage des trial balls
function handleDragOver(e)
{
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
}

function handleDrop(e)
{
    let data = e.dataTransfer.getData("text/plain");

    //~ On filtre pour ne garder que la couleur et laisser la classe qui numérote
    data = data.split(" ").filter((elt) => (elt!="ball--medium" && elt!="ball--small" && elt!="ball"))[0];

    //~ Boules numérotées: on recupere la classe numero de la boule actuelle et on met la nouvelle couleur dans la bonne case du tableau des essais
    currentClassNumber = getCurrentClassNumber(e.target); //Ex: "ball--0"
    arrUserBalls[parseInt(currentClassNumber[7])] = data; // Ex: arrUserBalls[0] = "ball--orange"

    //~ On supprime toutes les classes et on rajoute "ball" + la nouvelle couleur
    e.target.classList.remove(...e.target.classList);
    e.target.classList.add("ball", currentClassNumber, data);
}

function setUserBalls()
{
    //~ Ajoute une classe unique pour les différencier (uniquement pour le Javascript)
    for(let i=0; i<currentTrialBalls.length; i++)
    {
        currentTrialBalls[i].classList.add(".ball--" + i);
    }

    //~ Drop pour les boules essais
    currentTrialBalls.forEach(elt => {
        //~ Dragover pour chaque boule
        elt.addEventListener("dragover", handleDragOver);
        elt.addEventListener("drop", handleDrop);
    });
}

function setRandomColors()
{
    let randomNumber = 0;

    for(let i=0; i<arrMysteryBalls.length; i++)
    {
        // ~ Choisir un index (du tableau de couleurs possibles) au hasard et les definir
        randomNumber = parseInt(Math.random() * (arrColorsBalls.length));
        arrMysteryBalls[i] = arrColorsBalls[randomNumber];
    }

    // console.log(arrMysteryBalls); //? Décommenter ceci pour obtenir la réponse en console :)
}

//& Boules à glisser-déposer
function handleDrag(e)
{
    e.dataTransfer.setData("text/plain", e.target.classList);
}

function setHandleDrag()
{
    ballList.forEach((elt) => {
        elt.setAttribute("draggable", "true");

        elt.addEventListener("dragstart", handleDrag);
    });
}

function unsetHandleDrag()
{
    ballList.forEach(elt => {
        elt.removeAttribute("draggable");

        elt.removeEventListener("dragstart", handleDrag);
    });
}

//& Actions du jeu
function start()
{
    //~ Reset de l'ancienne partie
    cancel();
    resultLine.querySelectorAll(".ball").forEach(elt => {
        elt.classList.remove(...elt.classList);
        elt.classList.add("ball", "ball--darkgrey");
    });

    cancel();
    trialsNumber.textContent = nbLives;
    setRandomColors();
    setUserBalls();
    setHandleDrag();
    setVerifyButton();
}

function cancel(resetGame=true)
{
    //~ Reset compteurs de couleurs
    nbWellPlaced = 0;
    nbRightColors = 0;
    for(let i=0; i<arrUserBalls.length; i++)
    {
        arrUserBalls[i] = null;
    }

    //~ Reset compteur de vies
    nbLives = 10;
    trialsNumber.textContent = nbLives;

    //~ Retirer les event listeners
    currentTrialBalls.forEach(elt => {
        elt.removeEventListener("dragover", handleDragOver);
        elt.removeEventListener("drop", handleDrop);
    });
    disableButton();
    unsetHandleDrag();

    if(!resetGame)
    {
        return true;
    }

    //~ Supprimer les trial lines
    let lines = document.querySelectorAll(".trialLine");
    lines.forEach(elt => {elt.remove();});

    //~ Supprimer result line
    resultLine.querySelectorAll(".ball").forEach(elt => {
        elt.classList.remove(...elt.classList);
        elt.classList.add("ball", "ball--darkgrey");
    });

    //~ Ajouter une trial line vierge à la gameBox, comme au début
    currentTrialLine = gameBox.appendChild(blankTrialLine.cloneNode(true));

    //~ Nouvelles trial balls
    currentTrialBalls = currentTrialLine.querySelectorAll(".trialLine__bigBalls .ball");

    //~ Definir nouveau bouton valider
    verifyButton = currentTrialLine.querySelector(".verifyButton");
    disableButton();

    //~ Définir les nouvelles petites boules actuelles
    currentSmallBalls = currentTrialLine.querySelectorAll(".trialLine .ball--small");
}

function stop(victoire=true)
{
    //~ Pop-up
    if(victoire)
    {
        alert("Bien joué !");
    }
    else
    {
        alert("Perdu !");
    }

    disableButton();

    //~ Afficher solution dans la result line
    let resultBalls = resultLine.querySelectorAll(".ball");
    resultBalls.forEach(elt => {
        elt.classList.remove("ball--darkgrey");
    });

    for(let i=0; i<resultBalls.length; i++)
    {
        resultBalls[i].classList.add(arrMysteryBalls[i]);
    }

    //~ Signaler qu'on a perdu
    hasStarted = false;
}

function createNewTrialLine()
{
    //~ Reset les compteurs de couleurs et retrait d'une vie
    nbWellPlaced = 0;
    nbRightColors = 0;
    for(let i=0; i<arrUserBalls.length; i++)
    {
        arrUserBalls[i] = null;
    }

    //~ Retrait d'une vie et mise à jour de la boite de vie
    nbLives--;
    trialsNumber.textContent = nbLives;
    if(nbLives <= 0)
    {
        stop(false); //TODO: créer cette fonction
        return true;
    }

    //~ Ajoute et la defini comme actuelle
    currentTrialLine = gameBox.insertBefore(blankTrialLine.cloneNode(true), currentTrialLine);

    //~ Desactivation des anciennes boules et redéfinition des nouvelles trial balls
    currentTrialBalls.forEach(elt => {
        elt.removeEventListener("drop", handleDrop);
        elt.removeEventListener("dragover", handleDragOver);
    })
    currentTrialBalls = currentTrialLine.querySelectorAll(".trialLine__bigBalls .ball");

    //~ Desactiver ancien bouton et definir le nouveau
    disableButton();
    verifyButton = currentTrialLine.querySelector(".verifyButton");
    enableButton();

    //~ Definir les 4 nouvelles petites boules en actuelles
    currentSmallBalls = currentTrialLine.querySelectorAll(".trialLine .ball--small");

    //~ Ajouter les events listeners aux nouveaux arrivants
    setUserBalls(currentTrialBalls);
}

//& Bouton vérfier
function verifyAnswers()
{
    //~ Variables
    let i=0, index = 0;
    let cpyArrMysteryBalls = arrMysteryBalls.map(elt => (elt));

    //~ Verif qu'il a bien rentré des couleurs
    for(i=0; i<arrUserBalls.length; i++)
    {
        if(arrUserBalls[i] == null){
            return false;
        }
    }

    //~ Bien placés
    for(i=0; i<arrUserBalls.length; i++)
    {
        if(arrUserBalls[i] == arrMysteryBalls[i])
        {
            // Si on trouve bien placé, on fait en sorte de virer cette case pour qu'elle ne soit pas comptée dans les bonnes couleurs pas bien placées
            cpyArrMysteryBalls[i] = "ball--mediumgrey"; // On "supprime une case" sans modifier la taille du tableau
            nbWellPlaced++;
        }
    }

    //~ Si tous bien placés, on stop tout de suite
    if(nbWellPlaced>=4)
    {
        stop(true);
        return true;
    }

    //~ Bonne couleur mal pas bien placé
    for(i=0; i<arrUserBalls.length; i++)
    {
        index = cpyArrMysteryBalls.indexOf(arrUserBalls[i]);

        if(index>(-1) && arrUserBalls[i]!=arrMysteryBalls[i])
        {
            // On vire cette bonne couleur pour qu'elle ne soit pas comptée plusieurs fois
            nbRightColors++;
            cpyArrMysteryBalls.splice(index, 1);
        }
    }

    //~ Parametrer les petits boules
    colorSmallBalls();

    //~ Creer une nouvelle ligne et pointer dessus
    createNewTrialLine();

    return true;
}

function preventClickButton(e)
{
    e.preventDefault();
}

function enableClickButton(e)
{
    verifyAnswers();
}

function disableButton()
{
    if(!verifyButton.classList.contains("verifyButton--disabled"))
    {
        verifyButton.classList.add("verifyButton--disabled");
    }
    verifyButton.removeEventListener("click", enableClickButton);
    verifyButton.addEventListener("click", preventClickButton);
}

function enableButton()
{
    verifyButton.classList.remove("verifyButton--disabled");
    verifyButton.removeEventListener("click", preventClickButton);
    verifyButton.addEventListener("click", enableClickButton);
}

function setVerifyButton()
{
    enableButton();
}

//& INIT
trialsNumber.textContent = nbLives;
disableButton();
startButton.addEventListener("click", (e) => {
    if(!hasStarted)
    {
        start();
        hasStarted = true;
    }
});
cancelButton.addEventListener("click", (e) => {
    cancel();
    hasStarted = false;
})
