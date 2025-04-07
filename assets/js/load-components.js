// load-components.js

function loadComponent(id, file, callback) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (typeof callback === "function") callback(); // Run additional setup
    })
    .catch(error => {
      console.error(`Error loading ${file}:`, error);
    });
}

function setupSidebarToggle() {
  const body = document.body;
  const sidebar = document.querySelector("#include-sidebar");
  const toggleLinks = document.querySelectorAll('a[href="#sidebar"]');

  toggleLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      body.classList.toggle("sidebar-visible");
    });
  });

  // Optional: close sidebar when clicking outside or on a close button
  document.addEventListener("click", function (e) {
    if (
      body.classList.contains("sidebar-visible") &&
      !e.target.closest("#include-sidebar") &&
      !e.target.closest('a[href="#sidebar"]')
    ) {
      body.classList.remove("sidebar-visible");
    }
  });
}

// Load header and sidebar, with toggle setup after sidebar is loaded
loadComponent("include-header", "header.html");
loadComponent("include-sidebar", "sidebar.html", setupSidebarToggle);
