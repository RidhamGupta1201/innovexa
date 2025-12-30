const title = document.getElementById("hero-title");

/* ===== 1. SCROLL SCALE EFFECT ===== */
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const scale = 1 + Math.min(scrollY / 800, 0.4);
  title.style.transform = `scale(${scale})`;
});

/* ===== 2. MOUSE TRACE COLOR EFFECT ===== */
const text = title.innerText;
title.innerHTML = "";

[...text].forEach(letter => {
  const span = document.createElement("span");
  span.innerText = letter;
  title.appendChild(span);
});

title.addEventListener("mousemove", e => {
  const rect = title.getBoundingClientRect();
  const x = e.clientX - rect.left;

  title.querySelectorAll("span").forEach((span, i) => {
    const distance = Math.abs(x - (i * rect.width / text.length));
    if (distance < 50) {
      span.style.color = "#3b82f6";
    } else {
      span.style.color = "#e5e7eb";
    }
  });
});

title.addEventListener("mouseleave", () => {
  title.querySelectorAll("span").forEach(span => {
    span.style.color = "#e5e7eb";
  });
});

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(section => {
    const top = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight - 150) {
      section.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

