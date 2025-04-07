// load-components.js

function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
    .catch(error => {
      console.error(`Error loading ${file}:`, error);
    });
}

// Load header and sidebar
loadComponent("include-header", "header.html");
loadComponent("include-sidebar", "sidebar.html");
