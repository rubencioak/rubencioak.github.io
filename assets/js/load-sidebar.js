// load-sidebar.js
fetch("sidebar.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("include-sidebar").innerHTML = data;
  });
