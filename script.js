// Button Size Updater
function updateButtonTransform() {
    let btn = document.getElementById("start-button");
    if (!btn) return;

    let vw = window.innerWidth;

    let translateY = Math.max(-150, Math.min(0, 0 - (0.1 * vw)));

    let scale = Math.max(0.5, Math.min(1.5, 0.7 + (0.8 * (vw / 1920))));

    btn.style.transform = `translateY(${translateY}px) scale(${scale})`;
}

updateButtonTransform();


document.addEventListener('DOMContentLoaded', () => {
    addRandomBricksToSections();
    document.querySelectorAll('.section').forEach((section) => observer.observe(section));
});

// List of brick image files
const brickImages = [
    "img/bricks/big_blue.png",
    "img/bricks/blue_small.png",
    "img/bricks/blue.png",
    "img/bricks/green_big.png",
    "img/bricks/green_smaller.png",
    "img/bricks/red_big.png",
    "img/bricks/red_small.png",
    "img/bricks/red_smaller.png",
    "img/bricks/yellow_big.png",
    "img/bricks/yellow_small.png"
];

const sectionBricksMap = new Map(); // Keep track of bricks in each section

function addRandomBricksToSections() {
    const sections = document.querySelectorAll('.section');

    sections.forEach((section) => {
        section.style.position = 'relative';

        const bricks = [];

        brickImages.forEach((image) => {
            const imgElement = document.createElement('img');
            imgElement.src = image;
            imgElement.classList.add('brick-image');

            const sectionHeight = section.offsetHeight;
            const sectionWidth = section.offsetWidth;

            const randomTop = Math.floor(Math.random() * sectionHeight) + 130;
            const randomLeft = Math.floor(Math.random() * sectionWidth);

            imgElement.style.top = `${randomTop}px`;
            imgElement.style.left = `${randomLeft}px`;

            section.appendChild(imgElement);
            bricks.push(imgElement);
        });

        sectionBricksMap.set(section, bricks);
    });
}

function moveVisibleBricks() {
    visibleSections.forEach((section) => {
        const offset = window.scrollY * 0.1;
        const bricks = sectionBricksMap.get(section) || [];

        bricks.forEach((brick) => {
            brick.style.transform = `translate(${-offset}px, ${-offset}px)`;
        });
    });
}

const visibleSections = new Set(); // Tracks sections in view

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            visibleSections.add(entry.target);
        } else {
            visibleSections.delete(entry.target);
        }
    });
}, { threshold: 0.1 });

window.addEventListener('scroll', moveVisibleBricks);

// addRandomBricksToSections();


// Observe all sections
document.querySelectorAll('.section').forEach((section) => {
    observer.observe(section);
});


const components = [
    { title: "Arduino UNO R3", image: "img/Components/Arduino.png", desc: "The main microcontroller board that reads inputs from sensors and controls outputs like LEDs, displays, and buzzers. It serves as the brain of your project." },
    { title: "7-Segment Display", image: "img/Components/7segment.png", desc: "Shows numerical data (0–9), useful for counters or timers." },
    { title: "LED", image: "img/Components/LED.png", desc: "Lights up to show status, signals, or sensor results." },
    { title: "LCD Module", image: "img/Components/LCD.png", desc: "Displays text and numbers from Arduino data like temperature or distance." },
    { title: "RGB LED", image: "img/Components/RGB_LED.png", desc: "Single LED that can emit various colors by mixing red, green, and blue." },
    { title: "Passive/Active Buzzer", image: "img/Components/Passive_and_Active_Buzzer.png", desc: "Produces sound: active buzzers play tones, passive ones allow custom melodies." },
    { title: "Ultrasonic Sensor", image: "img/Components/Ultrasonic.png", desc: "Measures distance by sound waves bouncing off surfaces." },
    { title: "Water Level Detection Sensor", image: "img/Components/Water_Level_Detection.png", desc: "Detects presence or level of water for monitoring or alerts." },
    { title: "DHT11 Module", image: "img/Components/DHT11.png", desc: "Measures temperature and humidity, useful for weather stations." },
    { title: "Sound Sensor Module", image: "img/Components/Sound_Sensor.png", desc: "Detects sound intensity, perfect for clap-controlled devices." },
    { title: "Joystick Module", image: "img/Components/Joystick.png", desc: "Directional input device with X, Y axes plus push button." },
    { title: "Potentiometer", image: "img/Components/potentiometer.png", desc: "Adjusts brightness or volume by varying resistance." },
    { title: "74HC595 (Shift Register)", image: "img/Components/74HC595.png", desc: "Expands Arduino output pins for more LEDs or displays." },
    { title: "L293D Motor Driver", image: "img/Components/L293D.png", desc: "Controls motors’ speed and direction with Arduino." },
    { title: "Push Button", image: "img/Components/Push_Button.png", desc: "Simple switch for triggering actions manually." },
    { title: "Slide Switch", image: "img/Components/Slide_Switch.png", desc: "Toggle switch for switching between modes (on/off)." }
];

const container = document.getElementById('carousel');
components.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openPopup(c.title, c.desc, c.image);

    const img = document.createElement('img');
    img.src = c.image;

    const title = document.createElement('div');
    title.className = 'title';
    title.innerText = c.title;

    card.appendChild(img);
    card.appendChild(title);
    container.appendChild(card);
});

document.querySelector('.arrow.left').addEventListener('click', () => {
    carousel.scrollBy({ left: -600, behavior: 'smooth' });
});

document.querySelector('.arrow.right').addEventListener('click', () => {
    carousel.scrollBy({ left: 600, behavior: 'smooth' });
});

document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById('carousel');
    const progressBar = document.getElementById('carousel-progress-bar');

    function updateProgress() {
        const scrollLeft = carousel.scrollLeft;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        const scrollPercent = (scrollLeft / maxScroll) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    }

    // Update progress on scroll and on button click
    carousel.addEventListener('scroll', updateProgress);
    updateProgress(); // initialize on load

    // Optional: Button scroll functionality
    document.querySelector('.arrow.left').addEventListener('click', () => {
        carousel.scrollBy({ left: -300, behavior: 'smooth' });
    });

    document.querySelector('.arrow.right').addEventListener('click', () => {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
    });
});

// Windows Support Drag-Click Carousel

let isDown = false;
let startX;
let scrollLeft;

const carouselWrapper = document.getElementById('carousel-wrapper');
const carousel = document.getElementById('carousel');
const carouselBlock = document.getElementById('carousel-block')

carouselWrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('active');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    setTimeout(() => {
        carouselBlock.style.display = 'block'
    }, 100);
});

carouselWrapper.addEventListener('mouseleave', () => {
    isDown = false;
    setTimeout(() => {
        carouselBlock.style.display = 'none'
    }, 100);
    carousel.classList.remove('active');
});

carouselWrapper.addEventListener('mouseup', () => {
    isDown = false;
    setTimeout(() => {
        carouselBlock.style.display = 'none'
    }, 100);
    carousel.classList.remove('active');
});

carouselWrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5; // multiplier controls scroll speed
    carousel.scrollLeft = scrollLeft - walk;
});

// Touchscreen Support for Mobile

let touchStartX = 0;
let touchScrollLeft = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - touchStartX) * 1.5;
    carousel.scrollLeft = touchScrollLeft - walk;
});


function openPopup(title, desc, imgPath) {

    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-desc').innerText = desc;
    document.getElementById('popup-img').src = imgPath;
    document.getElementById('popup-background').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup-background').style.display = 'none';
}

const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-middle a");

function updateActiveLink() {
    let index = sections.length;

    while (--index >= 0 && window.scrollY + 100 < sections[index].offsetTop) { }

    navLinks.forEach(link => link.classList.remove("active"));
    if (index >= 0) {
        const currentSectionId = sections[index].id;
        const activeLink = document.querySelector(`.nav-middle a[href="#${currentSectionId}"]`);
        if (activeLink) activeLink.classList.add("active");
    }
}

window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink); // Run once on load

window.addEventListener('load', () => {
    // Optional: Remove hash from URL

    if (location.hash) {
        history.replaceState(null, null, ' ');
    }

    const homeSection = document.getElementById('home');

    // Smooth scroll to top on next animation frame
    if (home) homeSection.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
        document.body.classList.remove("loading");
        document.getElementById("loader").style.display = "none";
    }, 100);
});

const menuBtn = document.getElementById('navbar-mobile-button');
const mobileMenu = document.getElementById('navbar-mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

// Close menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
});