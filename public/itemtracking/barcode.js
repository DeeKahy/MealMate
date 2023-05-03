scan_button = document.getElementById("barcode");
barcode_backdrop = document.getElementById("barcode_backdrop")
close_barcode = document.getElementById("close_barcode")
name_of_item = document.getElementById("name_of_item")
weight_of_item = document.getElementById("weight_of_item")
found_barcode = document.getElementById("found_barcode")
confirm_button = document.getElementById("confirm_button")
expirationDate2 = document.getElementById("expirationDate2")
location_hidden = document.getElementById("location_hidden")
barcode_scanned_label = document.getElementById("barcode_scanned_label")
confirm_button2 = document.getElementById("confirm_button2")
new_item_pp = document.getElementById("new_item_pp")
expirationDate5 = document.getElementById("expirationDate5")
if_barcode_no_item = document.getElementById("if_barcode_no_item")
weight_of_new_item = document.getElementById("weight_of_new_item")


function checkInputs2() {
  if (expirationDate2) {
    confirm_button.disabled = false;
  } else {
    confirm_button.disabled = true;
  }
}
expirationDate2.addEventListener("input", checkInputs2)

confirm_button.addEventListener("click", (e) => {
  e.preventDefault();


  postlist(name_of_item.textContent, expirationDate2.value, weight_of_item.textContent, location_hidden.textContent)
window.location.reload();

})

close_barcode.addEventListener("click", (e) => {
  e.preventDefault();
  barcode_backdrop.style.visibility = "hidden"
  if_barcode_no_item.style.visibility="hidden"
})

let resoult_of_scan4 = 8710508551175;
let reoult_of_barcode_no_item = 871050855117102;
let resoult_of_scan2 = null
let resoult_of_scan = reoult_of_barcode_no_item

scan_button.addEventListener("click", (e) => {
  e.preventDefault();
  //Here goes barcode code start scanning
  //Here goes Test Barcode

  if (typeof resoult_of_scan !== "number") {
    alert("sorry did not find any barcode")//If no barcode is found
  } else {// if it is found


    resoult_of_scan = "" + resoult_of_scan;

    //So now that we have validated that it is a number, now we need to scan through our know list,
    const matchingObject = private_user_Item_property_data.find(obj => obj.barcode === resoult_of_scan);

    if (matchingObject) {// Check if a matching object was found aka item in our system
      console.log("Matching object found:", matchingObject.name);
      barcode_backdrop.style.visibility = "visible"
      found_barcode.style.display = "contents"
      name_of_item.textContent = matchingObject.name
      weight_of_item.textContent = matchingObject.weight
      location_hidden.textContent = matchingObject.location

    } else {// if no item was found
      console.log("No matching object found.");
      barcode_backdrop.style.visibility = "visible"
      if_barcode_no_item.style.visibility = "visible"
      barcode_scanned_label.textContent = resoult_of_scan
    }
  }


})


function checkInputs() {
  if (new_item_pp.value && expirationDate5.value &&  weight_of_new_item.value) {
    confirm_button2.disabled = false;
  } else {
    confirm_button2.disabled = true;
  }
}

new_item_pp.addEventListener("input", checkInputs)
expirationDate5.addEventListener("input", checkInputs)
weight_of_new_item.addEventListener("input", checkInputs)

confirm_button2.addEventListener("click", (e) => {
  e.preventDefault();

  let search_item = new_item_pp.value

  resoult_of_scan = "" + resoult_of_scan;
  const matching = private_user_Item_property_data.find(obj => obj.name === search_item);//here we try to find the item the user try to search for
  if (matching) {// if its found we link the item with the barcode, and then add the item to the users list.
    
    newproperty(search_item, "barcode", resoult_of_scan)
    
postlist(matching.name, expirationDate5.value, matching.weight, matching.location)
    


    console.log("linked item to barcode")
  }
  else {// Else we make a new item, and link barcode with it, and add the new item to the users list.
    let New_item_with_barcode = {
      "name": search_item,
    }
    fetch("/API/pp_new_item", {// ads item in private property
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(New_item_with_barcode)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log("Response from server:", data);
      })
      .catch(error => {
        console.error("Error sending POST request:", error);
      });
location2 = document.getElementById("location2")


async function executeFunctionsInOrder() {
  await newproperty(search_item, "barcode", resoult_of_scan);
  await newproperty(search_item, "weight", weight_of_new_item.value);
  await newproperty(search_item, "location", location2.value);
  await postlist(search_item, expirationDate5.value, weight_of_new_item.value, location2.value);
  console.log("Created new item & linked barcode")
  window.location.reload();
}
executeFunctionsInOrder();
      }
})

 function postlist(itemname, experation, weight, location){
  let data_add_item = {
    "name": itemname,
    "expirationDate": experation,
    "weight": weight,
    "location": location
  };
  fetch("/API/postlist", {// Here we ad the item to the users list
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data_add_item),
  });
}

async function newproperty(itemname, propname, valueofprop) {
  let let_data_property = {
    nameofitem: itemname,
    property: propname,
    value: valueofprop
  };

  try {
    const response = await fetch("/API/ppsavenewproperties", { // Here we add weight to the item
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(let_data_property)
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Response from server:", data);
  } catch (error) {
    console.error("Error sending POST request:", error);
  }
}






