let box = document.getElementById("box");
let bouton = document.getElementById("bouton");
let commentaire = document.getElementById("commentaire");

let nombreADeviner = parseInt((Math.random() * 100)+1);
let userNombreADeviner = parseInt(box.value);

function commenter_resultat()
{
    userNombreADeviner = parseInt(box.value);
    box.value = null;

    if(userNombreADeviner == nombreADeviner)
    {
        commentaire.classList.add("gagne");
        commentaire.classList.remove("perdu");
        commentaire.innerHTML = "BRAVO ! Vous avez gagné !";
    }
    else
    {
        commentaire.classList.add("perdu");
        commentaire.classList.remove("gagne");

        if(userNombreADeviner > nombreADeviner)
        {
            commentaire.innerHTML = "Plus petit !";
        }
        else if(userNombreADeviner < nombreADeviner)
        {
            commentaire.innerHTML = "Plus grand !";
        }
        else
        {
            commentaire.innerHTML = "Rentrez un nombre valide !!!";
        }
    }
}

bouton.addEventListener("click", () => 
{
    commenter_resultat();
    box.value = "";
});

document.addEventListener("keypress", (e) => 
{
    if(e.key == "Enter")
    {
        if(document.activeElement == box)
        {
            commenter_resultat();
        }
    }
});
