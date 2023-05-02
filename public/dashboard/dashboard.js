let amount_of_people_in_household = 1;

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
            fetch("/API/getSettings")
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("response was not in the 200 range " + response.Error)
                })
                .then(data => {
      
                  let str = data.username;
                  let username = str.charAt(0).toUpperCase() + str.slice(1); // Makes first letter of username capital
                    
                  document.querySelector("#username").textContent = "Hi, " + username + "!";
                  amount_of_people_in_household = data.household;
      
      
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

document.addEventListener("DOMContentLoaded", (e) => {
    let totalWaste = 0;
    fetch("/API/getweeklyWaste")
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("response was not in the 200 range " + response.Error);
    })
    .then(data => {
      data.forEach(item => {
        totalWaste += (item.weight) - item.eaten;
      })
      let procent = ((totalWaste/(900 * amount_of_people_in_household)) * 100).toFixed(2);
      move(procent);
      document.getElementById("amount-wasted").textContent = "You have wasted " + totalWaste + " grams of food this week!";
      document.getElementById("p_sameline").textContent = "This amount is " + Math.abs((900 * amount_of_people_in_household - totalWaste)) + "g";
      const element = document.getElementById("red-green-selector");

      if (totalWaste > 900 * amount_of_people_in_household) {     
        element.textContent = " higher";
        element.className = "p_red";
      } else {
        element.textContent = " lower";
        element.className = "p_green";
      }
    })
 });


function move(amount) {
    var elem = document.getElementById("myBar");
    var width = 0;
    var id = setInterval(frame, 10);
    function frame() {
        if (width >= amount) {
            clearInterval(id);
        } else if (amount <= 100) {
            width++;
            elem.style.width = amount + '%';
        } else if (amount <= 200) {
            width++;
            elem.style.backgroundColor = 'yellow';
            elem.style.width = amount - 100 + '%';
        } else if (amount <= 300) {
            width++;
            elem.style.backgroundColor = 'red';
            elem.style.width = amount - 200 + '%';
        }
    }
}
