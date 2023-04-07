document.addEventListener("DOMContentLoaded", function() {
    fetch("/navbar.html")
      .then(response => {
        return response.text()
      })
      .then(data => {
        document.querySelector("#nav-placeholder").innerHTML = data;
      });
  });

  setTimeout(() => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu ul');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            navMenu.style.display = 'block';
        } else {
            navMenu.style.display = 'none';
        }
    });
  }, 3000);

