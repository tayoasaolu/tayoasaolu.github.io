// Collapse/Expand functionality for experience sections
function toggleSection(id) {
  const el = document.getElementById(id);
  if (el.style.display === "block") {
    el.style.display = "none";
  } else {
    el.style.display = "block";
  }
}

// Optional: close all collapsibles on load
window.onload = () => {
  const all = document.querySelectorAll(".collapsible");
  all.forEach(el => el.style.display = "none");
};

