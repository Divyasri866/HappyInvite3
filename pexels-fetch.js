document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".template-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const popup = document.getElementById("previewPopup");
  const overlay = document.getElementById("overlay");
  const popupImage = document.getElementById("popupImage");
  const popupTitle = document.getElementById("popupTitle");
  const previewOpenBtn = document.getElementById("previewOpen");
  const previewCloseBtn = document.getElementById("previewClose");

  const API_KEY = "71IOksSFX1aRY9Coi3oZcadG20ctE2lUBw16x8sa4XYfgC7Hd0TIItqC";

  const categoryQuery = {
    all: ["birthday invitation", "wedding invitation", "new year", "greeting card"],
    birthday: ["birthday card", "birthday invitation", "birthday celebration"],
    wedding: ["wedding card", "wedding party", "wedding invitation"],
    newyear: ["new year card", "new year party", "fireworks new year"],
    other: ["thank you card", "greeting card", "invitation design"]
  };

  const editorLinks = {
    birthday: "template/birthday-editor.html",
    wedding: "template/wedding-editor.html",
    newyear: "template/newyear-editor.html",
    other: "template/other-editor.html"
  };

  let selectedImg = "";
  let selectedLink = "";

  fetchImages("all");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");
      container.innerHTML = "";
      fetchImages(category);
    });
  });

  function fetchImages(category) {
    const queries = categoryQuery[category] || [];
    const editorLink = editorLinks[category] || "template/bd-editor.html";

    queries.forEach(query => {
      fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=4`, {
        headers: {
          Authorization: API_KEY
        }
      })
        .then(res => res.json())
        .then(data => {
          data.photos.forEach(photo => {
            const card = document.createElement("div");
            card.className = `template-card ${category}`;
            card.setAttribute("data-link", editorLink);
            card.innerHTML = `
              <img src="${photo.src.medium}" alt="${photo.alt}" />
              <h3>${photo.alt || "Pexels Photo"}</h3>
              <button class="save-btn" data-img="${photo.src.original}" data-title="${photo.alt}">➕ Save to To-Do</button>
            `;

            card.addEventListener("click", () => {
              selectedImg = photo.src.original;
              selectedLink = editorLink;
              popupImage.src = selectedImg;
              popupTitle.innerText = photo.alt || "Pexels Photo";
              previewOpenBtn.setAttribute("data-link", selectedLink);
              overlay.style.display = "block";
              popup.style.display = "block";
            });

            const saveBtn = card.querySelector(".save-btn");
            saveBtn.addEventListener("click", (e) => {
              e.stopPropagation(); 
              convertImgToBase64(photo.src.original, (base64Img) => {
                const newTemplate = {
                  title: photo.alt || "Pexels Photo",
                  img: base64Img,
                  time: new Date().toISOString()
                };
                const templates = JSON.parse(localStorage.getItem("todoTemplates")) || [];
                templates.push(newTemplate);
                localStorage.setItem("todoTemplates", JSON.stringify(templates));
                alert("✅ Template saved to To-Do List!");
              });
            });

            container.appendChild(card);
          });
        });
    });
  }

  previewOpenBtn.addEventListener("click", () => {
    if (selectedImg && selectedLink) {
      localStorage.setItem("selectedBgImage", selectedImg);
      window.location.href = selectedLink;
    }
  });

  previewCloseBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", closePopup);

  function closePopup() {
    popup.style.display = "none";
    overlay.style.display = "none";
  }

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
