<<<<<<< HEAD
// Button Size Updater
function updateButtonTransform() {
    let btn = document.querySelector("button");
    if (!btn) return;

    let vw = window.innerWidth;

    let translateY = Math.max(-150, Math.min(0, 0 - (0.1 * vw))); 

    let scale = Math.max(0.5, Math.min(1.5, 0.7 + (0.8 * (vw / 1920))));

    btn.style.transform = `translateY(${translateY}px) scale(${scale})`;
}

updateButtonTransform();


// Smooth Scroll
window.addEventListener("resize", updateButtonTransform);
document.addEventListener("DOMContentLoaded", function () {
    let scrollLinks = document.querySelectorAll(".nbtn, #start");

    scrollLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            let targetId = this.getAttribute("href");
            let targetSection = document.querySelector(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 50,
                    behavior: "smooth"
                });
            }
        });
    });
});
=======
// Button Size Updater
function updateButtonTransform() {
    let btn = document.querySelector("button");
    if (!btn) return;

    let vw = window.innerWidth;

    let translateY = Math.max(-150, Math.min(0, 0 - (0.1 * vw))); 

    let scale = Math.max(0.5, Math.min(1.5, 0.7 + (0.8 * (vw / 1920))));

    btn.style.transform = `translateY(${translateY}px) scale(${scale})`;
}

updateButtonTransform();


// Smooth Scroll
window.addEventListener("resize", updateButtonTransform);
document.addEventListener("DOMContentLoaded", function () {
    let scrollLinks = document.querySelectorAll(".nbtn, #start");

    scrollLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            let targetId = this.getAttribute("href");
            let targetSection = document.querySelector(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 50,
                    behavior: "smooth"
                });
            }
        });
    });
});
>>>>>>> 15e3c88 (First Version Control)
