const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(section => {
    const top = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    if (top < windowHeight - revealPoint) {
      section.classList.add("active");
    }
  });
}

// Run on scroll
window.addEventListener("scroll", revealOnScroll);

// ALSO run once on page load (THIS WAS MISSING)
revealOnScroll();
