// load-header.js
fetch("header.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("include-header").innerHTML = data;
  });
