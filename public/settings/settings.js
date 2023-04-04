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
            document.querySelector("#username-placeholder").textContent = username;
        })
    })

    document.addEventListener("DOMContentLoaded", (e) => {
        const form = document.querySelector("#myForm");
        const errorMessage = document.querySelector("#message");
      
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const formData = new FormData(form); // Get the form data

          const userData = {
              oldPassword: formData.get('old-password'), // Replace 'username' with the name of your username input field
              newPassword1: formData.get('new-password'), // Replace 'password' with the name of your password input field
              newPassword2: formData.get('confirm-password') // Replace 'password' with the name of your password input field
          };
      
          // Make fetch request to server with oldPassword and newPassword
          fetch("/API/changePassword", {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((error) => {
                    throw new Error(error.error);
                });
            }
        })        
            .then((data) => {
              // Display success message to user
              errorMessage.textContent = "Password successfully changed";
              form.reset();
            })
            .catch((error) => {
              // Display error message to user
              errorMessage.textContent = error.message;
            });
        });
      });