'use strict';

const BASE_URL = "https://portfolio.theapplicationdevelopers.in";

// Reusable fetch function
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "secret-key": "password"
      }
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

function loadAboutSection() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("name") || "jagadesh"; 

  if (!username) {
    console.error("No username found in localStorage.");
    return;
  }

  fetchData(`/api/V1/${username}/about`).then(data => {
    if (!data || !data.data || !data.data.applications) return;

    const aboutSection = document.querySelector(".about-text");
    aboutSection.innerHTML = data.data.applications.value;
  });
}



// Load Resume
function loadResume() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("name") || "jagadesh"; 

  if (!username) return;

  fetchData(`/api/V1/${username}/resume`).then(data => {
    if (!data || !data.data) return;

    const educationList = document.querySelector(".timeline:nth-of-type(1) .timeline-list");
    const experienceList = document.querySelector(".timeline:nth-of-type(2) .timeline-list");

    educationList.innerHTML = "";
    if (Array.isArray(data.data.education)) {
    data.data.education.forEach(item => {
      educationList.innerHTML += `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${item.institution}</h4>
          <span>${item.duration}</span>
          <p class="timeline-text">${item.description}</p>
        </li>`;
    });
  }

    experienceList.innerHTML = "";
    if (Array.isArray(data.data.experience)) {
    data.data.experience.forEach(item => {
      experienceList.innerHTML += `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${item.company}</h4>
          <span>${item.duration}</span>
          <p class="timeline-text">${item.description}</p>
        </li>`;
    });
  }
});
}

// Load Portfolio
function loadPortfolio() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("name") || "jagadesh"; // fallback to jagadesh if not provided

  fetchData(`/api/V1/${username}/portfolio?category_id=1`).then(data => {
    if (!data || !data.data || !Array.isArray(data.data.portfolios)) return;

    const projectList = document.querySelector(".project-list");
    projectList.innerHTML = "";

    data.data.portfolios.forEach(project => {
      projectList.innerHTML += `
        <li class="project-item active" data-filter-item data-category="${project.category}">
          <a href="${project.link || "#"}">
            <figure class="project-img">
              <div class="project-item-icon-box">
                <ion-icon name="eye-outline"></ion-icon>
              </div>
              <img src="${project.image}" alt="${project.title}" loading="lazy">
            </figure>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-category">${project.category}</p>
          </a>
        </li>`;
    });
  });
}

// Load Blog
function loadBlog() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("name") || "jagadesh"; // fallback to jagadesh if not provided

  fetchData(`/api/V1/${username}/blog`).then(data => {
    const blogList = document.querySelector(".blog-posts-list");
    blogList.innerHTML = "";

    if (!data || !data.data || !Array.isArray(data.data.blogs)) return;

    data.data.blogs.forEach(post => {
      blogList.innerHTML += `
        <li class="blog-post-item">
          <a href="${post.link || '#'}">
            <figure class="blog-banner-box">
              <img src="${post.image}" alt="${post.title}" loading="lazy">
            </figure>
            <div class="blog-content">
              <div class="blog-meta">
                <p class="blog-category">${post.category}</p>
                <span class="dot"></span>
                <time datetime="${post.date}">${post.date}</time>
              </div>
              <h3 class="h3 blog-item-title">${post.title}</h3>
              <p class="blog-text">${post.excerpt}</p>
            </div>
          </a>
        </li>`;
    });
  });
}

// Load Contact (optional)
function loadContact() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("name") || "jagadesh"; // fallback to jagadesh if not provided

  if (!username) return;

  fetchData(`/api/V1/${username}/contact`).then(data => {
    if (!data || !data.data) return;
    const emailEl = document.querySelector(".contact-link[href^='mailto']");
    const phoneEl = document.querySelector(".contact-link[href^='tel']");
    const birthdayEl = document.querySelector("time[datetime]");
    const addressEl = document.querySelector("address");

    if (emailEl) emailEl.textContent = data.data.email;
    if (phoneEl) phoneEl.textContent = data.data.phone;
    if (birthdayEl) birthdayEl.textContent = data.data.birthday;
    if (addressEl) addressEl.textContent = data.data.location;
  });
}

// Load everything on page load
window.addEventListener("DOMContentLoaded", () => {
  loadAboutSection();
  loadResume();
  loadPortfolio();
  loadBlog();
  loadContact();
});




// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}