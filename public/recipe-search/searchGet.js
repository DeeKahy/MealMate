let itemsSaved = [];

const form = document.querySelector("#searchForm");
document.addEventListener("DOMContentLoaded", (e) => {
    fetchForItemsSaved();
})
form.addEventListener("submit", (e) => {
    createButton();
    e.preventDefault();
    fetchForItemsSaved();
})

function fetchForItemsSaved() {
    let data = {
        "itemsSaved": itemsSaved,
    };
    data.itemsSaved = [...new Set(data.itemsSaved)];
    fetch("/API/search", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
        .then(result => result.json())
        .then(jsonData => listCreation(jsonData))
        .catch(error => console.log(error))
}

function listCreation(recipes) {
    form.reset();
    const allList = document.getElementById('resultList');
    allList.textContent = '';
    // const favoriteButton = document.createElement('button');
    // favoriteButton.textContent = `Favorite`;
    // favoriteButton.classList.add('favorite');
    // const favoriteButtonDeleter = document.createElement('button');
    // favoriteButtonDeleter.textContent = `x`;
    // favoriteButtonDeleter.classList.add('deleter');
    recipes.forEach(ULelement => {
      const recipieListOrder = document.createElement('ul');
      recipieListOrder.textContent = `${ULelement.nameOfRecipe} ${ULelement.score} / ${ULelement.ingredients.length}`;
    //   const clonefavoriteButton = favoriteButton.cloneNode(true);
    //   const clonefavoriteButtonDeleter = favoriteButtonDeleter.cloneNode(true);
    //   recipieListOrder.appendChild(clonefavoriteButton);
    //   recipieListOrder.appendChild(clonefavoriteButtonDeleter)
      ULelement.ingredients.forEach(LIelement => {
        const listIngredients = document.createElement('li');
        listIngredients.textContent = `${LIelement.ingredient} amount: ${LIelement.amount}`
        recipieListOrder.appendChild(listIngredients);
      });
      ULelement.instructions.forEach(instelement => {
        const listInstructions = document.createElement('li');
        listInstructions.textContent = instelement.inst;
        recipieListOrder.appendChild(listInstructions)
      });
    //   clonefavoriteButton.addEventListener('click', () => { 
    //     clonefavoriteButton.textContent = 'Favorited'
    //     let data = {
    //         "itemsSaved": document.querySelector('#favorite'),
    //     };
    //     fetch("/API/favoriteButton", {
    //         method: "POST", // *GET, POST, PUT, DELETE, etc.
    //         mode: "cors", // no-cors, *cors, same-origin
    //         cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //         credentials: "same-origin", // include, *same-origin, omit
    //         headers: {
    //             "Content-Type": "application/json",
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         redirect: "follow", // manual, *follow, error
    //         referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //         body: JSON.stringify(data), // body data type must match "Content-Type" header
    //     })
    //     .then(result => result.json())
    //     .catch(error => console.log(error))
    //   });
    //   clonefavoriteButtonDeleter.addEventListener('click', () => { 
    //     let data = {
    //         "itemsSaved": document.querySelector('#deleter'),
    //     };
    //     fetch("/API/favoriteButtonDeleter", {
    //         method: "POST", // *GET, POST, PUT, DELETE, etc.
    //         mode: "cors", // no-cors, *cors, same-origin
    //         cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //         credentials: "same-origin", // include, *same-origin, omit
    //         headers: {
    //             "Content-Type": "application/json",
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         redirect: "follow", // manual, *follow, error
    //         referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //         body: JSON.stringify(data), // body data type must match "Content-Type" header
    //     })
    //     .then(result => result.json())
    //     .catch(error => console.log(error))
    //   });
      allList.appendChild(recipieListOrder);
    });
}
  

function createButton() {
    const itemName = document.createElement('span');
    let searchMethod = document.querySelector('#search').value;
    console.log(searchMethod);
    if (!itemsSaved.includes(searchMethod)) {
        itemName.textContent = `[${searchMethod}]`;
        itemName.className = 'item-name';
        itemsSaved.push(document.querySelector('#search').value);
        form.appendChild(itemName);
    }
    const resetFilter = document.querySelector('#resetFilter');
    resetFilter.addEventListener('click', function () {
        while (itemsSaved.length > 0) {
            itemsSaved.pop();
            form.lastChild.remove();
        }
        location.reload();
    })
}

const listItems = document.querySelector('.list');

let ShowRecipies = true;
listItems.addEventListener('click', (e) => {
    if (ShowRecipies) {
        ShowRecipies = false;
        // Convert it to array form
        const childList = Array.from(e.target.querySelectorAll('li'));
        // Loops through all the list items and shows them
        for (const lists of childList) {
            lists.style.display = 'block';
        }
    } else {
        ShowRecipies = true;
        const childList = Array.from(e.target.querySelectorAll('li'));
        // Loops through all the list items and shows them
        for (const lists of childList) {
            lists.style.display = 'none';
        }
    }
})

