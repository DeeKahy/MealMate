document.addEventListener("DOMContentLoaded", (e) => {
    fetch("/API/gettopexp")
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("response was not in the 200 range " + response.Error)
        })
        .then(data => {
            // Create table element
            const table = document.createElement("table");


            // Create header row
            const headerRow = document.createElement("tr");
            const header1 = document.createElement("th");
            header1.textContent = "Location";
            headerRow.appendChild(header1);

            const header2 = document.createElement("th");
            header2.textContent = "Name";
            headerRow.appendChild(header2);

            const header3 = document.createElement("th");
            header3.textContent = "Expiration date";
            headerRow.appendChild(header3);

            // Add header row to table
            table.appendChild(headerRow);
            let currentDate = new Date();
            // Loop through data and create rows
            data.forEach(item => {
                const row = document.createElement("tr");
                const cell1 = document.createElement("td");
                cell1.textContent = item.location;
                row.appendChild(cell1);

                const cell2 = document.createElement("td");
                cell2.textContent = item.name;
                row.appendChild(cell2);

                const cell3 = document.createElement("td");
                let timeLeft = new Date(Date.parse(item.expirationDate) - currentDate);
                cell3.textContent = `Days left ${Math.ceil(timeLeft / (1000 * 60 * 60 * 24))}`;
                // cell3.textContent = item.expirationDate;
                row.appendChild(cell3);

                // Add row to table
                table.appendChild(row);
            });

            // Add table to HTML page
            const tableContainer = document.getElementById("container");
            tableContainer.appendChild(table);
        })
        .catch(error => console.error(error));
})

document.addEventListener("DOMContentLoaded", (e) => {
    fetch("/API/getUserName")
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("response was not in the 200 range " + response.Error)
        })
        .then(data => {
            let str = data.username;
            let username = str.charAt(0).toUpperCase() + str.slice(1); // Makes first letter of username capital

            // Selecting h1 element containing a welcome message and inserts username
            document.querySelector("#username").textContent = "Hi, " + username + "!";
        })
        

    fetch("/API/userItem")
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("response was not in the 200 range " + response.Error)
        })
        .then(data => {
            // Create table element
            const table = document.createElement("table");


            // Create header row
            const headerRow = document.createElement("tr");
            const recipieName = document.createElement("th");
            const IngredientNumber = document.createElement("th");
            IngredientNumber.textContent = "Amount of ingredients";
            recipieName.textContent = "Recipes";
            headerRow.appendChild(recipieName);
            headerRow.appendChild(IngredientNumber);
            table.appendChild(headerRow);
            data.forEach(el => {
                const listOfUserRecipies = document.createElement('tr');
                const listUnder = document.createElement("td");
                const ingredientAmount = document.createElement('td');
                listUnder.textContent = el.nameOfRecipe;
                ingredientAmount.textContent = `${el.score}/${el.ingredients.length}`
                listOfUserRecipies.appendChild(listUnder);
                listOfUserRecipies.appendChild(ingredientAmount);
                table.appendChild(listOfUserRecipies);
            })
            const container = document.querySelector('#recipeContainer');
            container.appendChild(table);
        })
})

function move(amount) {
    var elem = document.getElementById("myBar");
    var width = 0;
    var id = setInterval(frame, 10);
    function frame() {
        if (width >= amount) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}
