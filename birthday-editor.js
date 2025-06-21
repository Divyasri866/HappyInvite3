document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const dateInput = document.getElementById("dateInput");
  const messageInput = document.getElementById("messageInput");
  const colorPicker = document.getElementById("textColorPicker");

  const previewName = document.getElementById("previewName");
  const previewDate = document.getElementById("previewDate");
  const previewMessage = document.getElementById("previewMessage");

  const draggableTexts = document.querySelectorAll(".draggable-text");

  nameInput.addEventListener("input", () => {
    previewName.textContent = nameInput.value || "Dear Friend";
  });
  dateInput.addEventListener("input", () => {
    previewDate.textContent = dateInput.value || "On Your Special Day";
  });
  messageInput.addEventListener("input", () => {
    previewMessage.textContent = messageInput.value || "Wishing you the happiest birthday ever! 🎂";
  });

 
  colorPicker.addEventListener("input", () => {
    draggableTexts.forEach(el => {
      el.style.color = colorPicker.value;
    });
  });

    const bgImage = document.getElementById("bgImage");
  const templateSelect = document.getElementById("templateSelect");

  templateSelect.addEventListener("change", () => {
    const selected = templateSelect.value;

    if (selected === "1") {
      bgImage.src = "../assets/images/birthday1.jpg";

      previewName.style.fontFamily = "Georgia, serif";
      previewName.style.color = "#b30086";
      previewName.style.top = "60px";
      previewName.style.left = "50px";

      previewDate.style.fontFamily = "Georgia, serif";
      previewDate.style.color = "#ff3399";
      previewDate.style.top = "120px";
      previewDate.style.left = "50px";

      previewMessage.style.fontFamily = "Georgia, serif";
      previewMessage.style.color = "#cc0066";
      previewMessage.style.top = "200px";
      previewMessage.style.left = "50px";

    } else if (selected === "2") {
      bgImage.src = "../assets/images/birthday1.jpg";

      previewName.style.fontFamily = "'Comic Sans MS', cursive";
      previewName.style.color = "#ff6600";
      previewName.style.top = "80px";
      previewName.style.left = "40px";

      previewDate.style.fontFamily = "'Comic Sans MS', cursive";
      previewDate.style.color = "#ff9900";
      previewDate.style.top = "140px";
      previewDate.style.left = "40px";

      previewMessage.style.fontFamily = "'Comic Sans MS', cursive";
      previewMessage.style.color = "#ff3300";
      previewMessage.style.top = "220px";
      previewMessage.style.left = "40px";

    } else if (selected === "3") {
      bgImage.src = "../assets/images/birthday1.jpg";

      previewName.style.fontFamily = "'Brush Script MT', cursive";
      previewName.style.color = "#339966";
      previewName.style.top = "70px";
      previewName.style.left = "60px";

      previewDate.style.fontFamily = "'Brush Script MT', cursive";
      previewDate.style.color = "#2e8b57";
      previewDate.style.top = "130px";
      previewDate.style.left = "60px";

      previewMessage.style.fontFamily = "'Brush Script MT', cursive";
      previewMessage.style.color = "#006644";
      previewMessage.style.top = "210px";
      previewMessage.style.left = "60px";
    }
  });



  draggableTexts.forEach(el => {
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();

      const parent = el.offsetParent;
      const parentRect = parent.getBoundingClientRect();
      const shiftX = e.clientX - el.getBoundingClientRect().left;
      const shiftY = e.clientY - el.getBoundingClientRect().top;

      function moveAt(pageX, pageY) {
        const newLeft = pageX - parentRect.left - shiftX;
        const newTop = pageY - parentRect.top - shiftY;
        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;
      }

      function onPointerMove(e) {
        moveAt(e.clientX, e.clientY);
      }

      document.addEventListener("pointermove", onPointerMove);

      document.addEventListener("pointerup", function stopMove() {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", stopMove);
      }, { once: true });
    });

    el.addEventListener("dragstart", () => false); 
  });

 
 document.getElementById("downloadBtn")?.addEventListener("click", () => {
  const card = document.getElementById("cardPreview");
  html2canvas(card).then(canvas => {
    const link = document.createElement("a");
    link.download = "birthday-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

});


document.addEventListener("DOMContentLoaded", () => {
  const selectedImg = localStorage.getItem("selectedBgImage");
  if (selectedImg) {
    document.body.style.backgroundImage = `url(${selectedImg})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  }
});
