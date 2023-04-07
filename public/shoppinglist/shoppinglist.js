const form = document.querySelector("#itemForm");
const backdrop = document.querySelector("#backdrop");

let refIndex = undefined;

document.addEventListener("DOMContentLoaded", (e) => {
  loadShoppinglist();
})

function loadShoppinglist() {
  fetch("/api/shoppingList")
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
      header1.textContent = "Product";
      headerRow.appendChild(header1);

      const header2 = document.createElement("th");
      header2.textContent = "Quantity";
      headerRow.appendChild(header2);

      const header3 = document.createElement("th");
      header3.textContent = "Price";
      headerRow.appendChild(header3);

      const header4 = document.createElement("th");
      header4.textContent = "";
      headerRow.appendChild(header4);

      // Add header row to table
      table.appendChild(headerRow);

      let total = 0;
      const pricePromises = [];
  
      // Loop through data and create rows
      data.forEach(item => {
        let productName = "";
          const row = document.createElement("tr");
          const cell1 = document.createElement("td");
          cell1.textContent = item.name;
          row.appendChild(cell1);

          const cell2 = document.createElement("td");
          cell2.textContent = item.quantity;
          row.appendChild(cell2);

          const cell3 = document.createElement("td");
          cell3.textContent = "";
          cell3.addEventListener("mouseover", () => {
            cell3.setAttribute("title", productName);
          });
          row.appendChild(cell3);

          const cell4 = document.createElement("td");
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.onclick = () => {
            fetch(`/api/shoppingList/${item.id}`, {
              method: 'DELETE'
            })
              .then(response => {
                // Remove row from table on successful deletion
                if (response.ok) {
                  table.removeChild(row);
                  location.reload();
                }
              })
              .catch(error => console.error(error));
          };
          cell4.appendChild(deleteButton);

          const addToInventory = document.createElement("button");
          addToInventory.textContent = "Add to inventory";
          addToInventory.onclick = () => {
              addNewItem(item.name, item.id);
          }

          cell4.appendChild(addToInventory);

          row.appendChild(cell4);

          const pricePromise = fetch(`/api/productPrice?query=${item.name}`, {
          })
          .then(response => response.json())
          .then(data => {
            // Get the price for the first product in the suggestions array
            const price = data.suggestions[0].price;

            cell3.textContent = price.toFixed(2) + " kr";
            if (productName === "") {
              productName = data.suggestions[0].title;
            }

            return price * item.quantity;

          })
          .catch(error => console.error(error));
        // Add row to table

        pricePromises.push(pricePromise);

        table.appendChild(row);
      });
      Promise.all(pricePromises)
      .then(prices => {
        prices.forEach(price => {
          total += price;
        });
        // Add total row to table
        const totalRow = document.createElement("tr");
        const totalCell1 = document.createElement("td");
        totalCell1.textContent = "Total";
        totalCell1.style.fontWeight = "bold";
        totalRow.appendChild(totalCell1);
    
        const totalCell2 = document.createElement("td");
        totalCell2.textContent = "";
        totalRow.appendChild(totalCell2);
    
        const totalCell3 = document.createElement("td");
        totalCell3.textContent = total.toFixed(2) + " kr";
        totalCell3.style.fontWeight = "bold";
        totalRow.appendChild(totalCell3);
    
        const totalCell4 = document.createElement("td");
        totalRow.appendChild(totalCell4);
    
        // Add total row to table
        table.appendChild(totalRow);
      })
      .catch(error => console.error(error));

      // Add table to HTML page
      const tableContainer = document.getElementById("shoppinglist");
      tableContainer.appendChild(table);
  })
  .catch(error => console.error(error));
}


const addItemForm = document.getElementById('shoppinglist-form');
addItemForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(addItemForm); // Get the form data

  const quantityInput = formData.get('shoppinglist-amount');
  const parsedQuantity = parseInt(quantityInput);
  let itemData = {};

  if (!isNaN(parsedQuantity) && parsedQuantity >= 0 && parsedQuantity <= 1000) {
    itemData = {
      name: formData.get('shoppinglist-input'), // Replace 'username' with the name of your username input field
      quantity: parsedQuantity // Replace 'password' with the name of your password input field
    };
  } else {
    alert("Please enter a number between 1 and 1000 for the quantity.");
    return;
  }

  fetch('/api/shoppingList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(itemData)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Update the shopping list in the DOM
    location.reload();
  })
  .catch(error => {
    console.error(error);

    location.reload();
    /*
    Reloading the page here, some kind of error with the JSON-format.
    Can't figure it out, so I'm just reloading the page when receiving an error.
    */
  });
});

function addNewItemToPersonalList(itemId) {
  if (refIndex === undefined) {

    let data = {
      "location": form.location.value,
      "name": form.name.value,
      "expirationDate": form.expirationDate.value
    };
    fetch("/API/postlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          fetch(`/api/shoppingList/` + itemId, {
            method: 'DELETE'
          })
            .then(response => {
              // Remove row from table on successful deletion
              if (response.ok) {
                location.reload();
              }
            })
        } else {
          throw new Error("Error adding item to personal list");
        }
      })
      .catch(error => {
        console.error(error);
        alert("Error adding item to personal list");
      });
  }
}


//addNewItem() function decleration
function addNewItem(itemName, itemId) {
  form.classList.toggle("visible");
  if (backdrop.style.display === "block") {
      backdrop.style.display = "none";
  }
  else {
      backdrop.style.display = "block";
  }

  document.getElementById("name").value = itemName;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewItemToPersonalList(itemId);
   });
}
backdrop.addEventListener("click", (e) => {
  addNewItem();
  refIndex = undefined;
})