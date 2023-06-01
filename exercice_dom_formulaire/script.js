//* REGEXs
let rx1Char = new RegExp(/.+/);
let rxCodePostal = new RegExp(/^[0-9]{5}$/);
let rxEmail = new RegExp(/@+/);

//* RECUP ELEMENTS
let form = document.querySelector(".form");
let societe = document.querySelector("#societe");
let personneAContacter = document.querySelector("#personneAContacter");
let adresseDelEntreprise = document.querySelector("#adresseDelEntreprise");
let codePostal = document.querySelector("#codePostal");
let ville = document.querySelector("#ville");
let email = document.querySelector("#email");
let telephone = document.querySelector("#telephone");
let technique = document.querySelector("#technique");
let techniqueArea = document.querySelector("#techniqueArea");
let deletableArea = document.querySelector(".deletableArea");
let deletableArea__button = document.querySelector(".deletableArea__button");

//* FONCTIONS
function ajouterValeurTechnique(e)
{
    e.preventDefault();
    if(e.target.value != "")
    {
        techniqueArea.value += e.target.value + "\n";
    }
    e.target.value = null;
}

//* PROGRAMME
//& AFFICHER DATALIST DANS LA TEXTAREA
technique.addEventListener("change",  ajouterValeurTechnique);

//& QUAND ON FAIT ENTREE DANS LA ZONE DE TEXTE, CA AJOUTE L'ELT TECHNIQUE DANS LA ZONE A LA PLACE DE SUBMIT LE FORMULAIRE
document.addEventListener("keypress", (e) => 
{
    if(e.key == "Enter" && document.activeElement === technique)
    {
        ajouterValeurTechnique(e);
    }
});

//& Supprimer le dernier choix technique quand on appuie sur le bouton rouge
deletableArea__button.addEventListener("click", (e) => 
{
    //~ On devise le string en un tableau de plusieurs choix avec \n
    let techniqueAreaValue = techniqueArea.value.split("\n");
    techniqueAreaValue.pop(); // Supprimer le dernier "" qui s'ajoute

    //~ On retire le dernier elt
    techniqueAreaValue.pop();

    //~ On refait un string comme avant
    techniqueAreaValue = techniqueAreaValue.join("\n") + "\n";

    //~ Si il ne reste qu'un \n, on met directement la valeur du choix technique a null (pas qu'il rajoute ce saut de ligne inutile)
    if(techniqueAreaValue == "\n")
    {
        techniqueArea.value = null;
    }
    else
    {
        techniqueArea.value = techniqueAreaValue;
    }
});

//& FORM SUBMIT
form.addEventListener("submit", (e) => 
{
    e.preventDefault();

    //~ Tester valeurs
    if(!rx1Char.test(societe.value))
    {
        alert("ATTENTION: le nom de société doit contenir au moins 1 caractère !");
    }

    else if(!rx1Char.test(personneAContacter.value))
    {
        alert("ATTENTION: le nom de la personne à contacter doit contenir au moins 1 caractère !");
    }

    else if(!rxCodePostal.test(codePostal.value))
    {
        alert("ATTENTION: le code postal ne fait pas 5 chiffres !");
    }

    else if(!rx1Char.test(ville.value))
    {
        alert("ATTENTION: le nom de ville doit contenir au moins 1 caractère !");
    }

    else if(!rxEmail.test(email.value))
    {
        alert("ATTENTION: l'email doit contenir un '@' !");
    }

    else
    {
        form.submit();
    }
});
