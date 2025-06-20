document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".template-card");
  const popup = document.getElementById("previewPopup");
  const overlay = document.getElementById("overlay");
  const popupImagesContainer = document.querySelector(".popup-images");
  const popupTitle = document.getElementById("popupTitle");
  const previewOpenBtn = document.getElementById("previewOpen");
  const previewCloseBtn = document.getElementById("previewClose");
  const popupPrevBtn = document.querySelector(".popup-btn.prev");
  const popupNextBtn = document.querySelector(".popup-btn.next");

  let currentImgIndex = 0;
  let currentImages = [];
  let selectedLink = "";

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
  const category = btn.getAttribute("data-category");
  pexelsContainer.innerHTML = "";
  page = 1;
  loadPexelsImages(category);
});
  });

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const mainImg = card.querySelector("img").src;
      const title = card.querySelector("h3").innerText;
      selectedLink = card.getAttribute("data-link");

      popupTitle.innerText = title;
      previewOpenBtn.setAttribute("data-link", selectedLink);

      const folder = mainImg.substring(0, mainImg.lastIndexOf("/") + 1);
      const filename = mainImg.split("/").pop(); 
      const match = filename.match(/^([a-zA-Z]+)(\d+)\.(\w+)$/);

      if (!match) return;

      const category = match[1]; 
      const currentNumber = parseInt(match[2]);
      const ext = match[3]; 

      currentImages = [];
      for (let i = 1; i <= 4; i++) {
        currentImages.push(`${folder}${category}${i}.${ext}`);
      }

      popupImagesContainer.innerHTML = "";
      currentImages.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = src;
        if (i === currentNumber - 1) img.classList.add("active");
        popupImagesContainer.appendChild(img);
      });

      currentImgIndex = currentNumber - 1;
      showPopupImage(currentImgIndex);

      popup.style.display = "block";
      overlay.style.display = "block";
    });
  });

  function showPopupImage(index) {
    const images = popupImagesContainer.querySelectorAll("img");
    images.forEach(img => img.classList.remove("active"));

    const activeImg = images[index];
    if (activeImg) activeImg.classList.add("active");

    const src = activeImg.getAttribute("src");
    const filename = src.split("/").pop();
    const match = filename.match(/^([a-zA-Z]+)(\d+)\.(\w+)$/);
    if (match) {
      const category = match[1];
      const number = match[2];
      const titleFormatted = category.charAt(0).toUpperCase() + category.slice(1) + " " + number;
      popupTitle.innerText = titleFormatted;
    }
  }

  popupPrevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentImgIndex = (currentImgIndex - 1 + currentImages.length) % currentImages.length;
    showPopupImage(currentImgIndex);
  });

  popupNextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentImgIndex = (currentImgIndex + 1) % currentImages.length;
    showPopupImage(currentImgIndex);
  });

  previewCloseBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", closePopup);
  function closePopup() {
    popup.style.display = "none";
    overlay.style.display = "none";
  }

  previewOpenBtn.addEventListener("click", () => {
    if (currentImages.length && selectedLink) {
      localStorage.setItem("selectedBgImage", currentImages[currentImgIndex]);
      window.location.href = selectedLink;
    }
  });

  const saveButtons = document.querySelectorAll(".save-btn");
  saveButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const title = button.getAttribute("data-title");
      const imgPath = button.getAttribute("data-img");

      convertImgToBase64(imgPath, (base64Img) => {
        const newTemplate = {
          title: title,
          img: base64Img,
          time: new Date().toISOString()
        };

        const templates = JSON.parse(localStorage.getItem("todoTemplates")) || [];
        templates.push(newTemplate);
        localStorage.setItem("todoTemplates", JSON.stringify(templates));

        alert("✅ Template saved to To-Do List!");
      });
    });
  });

  function convertImgToBase64(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }
});

const apiKey = "71IOksSFX1aRY9Coi3oZcadG20ctE2lUBw16x8sa4XYfgC7Hd0TIItqC";
const pexelsContainer = document.getElementById("pexelsSection");
let page = 1;
let loading = false;

function loadPexelsImages(query = "birthday") {
  if (loading) return;
  loading = true;

  fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=10&page=${page}`, {
    headers: {
      Authorization: apiKey
    }
  })
  .then(res => res.json())
  .then(data => {
    data.photos.forEach(photo => {
      const card = document.createElement("div");
      card.classList.add("template-card", query);
      card.setAttribute("data-link", "bd-editor.html");

      card.innerHTML = `
        <img src="${photo.src.medium}" alt="${photo.photographer}">
        <h3>${query.charAt(0).toUpperCase() + query.slice(1)}</h3>
        <button class="save-btn" data-title="${query}" data-img="${photo.src.medium}">Save</button>
      `;

      card.addEventListener("click", () => {
        openPopup(photo.src.medium, query, "bd-editor.html");
      });

      pexelsContainer.appendChild(card);
    });

    page++;
    loading = false;
  });
}

window.addEventListener("scroll", () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
    loadPexelsImages("birthday"); 
  }
});

loadPexelsImages("birthday");
