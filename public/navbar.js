document.addEventListener("DOMContentLoaded", function() {
    fetch("/navbar.html")
      .then(response => {
        return response.text()
      })
      .then(data => {
        document.querySelector("#nav-placeholder").innerHTML = data;
      });
  });