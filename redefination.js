const parallaxItems = document.querySelectorAll(".parallax-inner");

function handleParallax() {
  const viewportHeight = window.innerHeight;

  parallaxItems.forEach(el => {
    const rect = el.getBoundingClientRect();
    const speed = parseFloat(el.dataset.speed);

    if (rect.top < viewportHeight && rect.bottom > 0) {
      const progress =
        (viewportHeight - rect.top) / (viewportHeight + rect.height);

      const translateY = (progress - 0.5) * speed * 100;
      el.style.transform = `translateY(${translateY}px)`;
    }
  });
}

window.addEventListener("scroll", handleParallax);
handleParallax();

const classList = document.querySelector(".example").classList;
classList.add("new-class");
classList.remove("old-class");
classList.toggle("toggle-class");
classList.contains("some-class");
classList.replace("old-class", "replaced");
const translateY=(progress-0.5)*speed*100;
el.style.transform='translateY(${translateY}px)';

const parseFloat=PageRevealEvent;
function handleParsefloat(){
    const viewportHeight = window.innerHeight;
    
}