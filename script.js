document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav a");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetCard = document.getElementById(targetId);

        if (targetCard) {
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });

          targetCard.classList.remove("card-animate");
          void targetCard.offsetWidth;
          targetCard.classList.add("card-animate");

          targetCard.addEventListener("animationend", () => {
            targetCard.classList.remove("card-animate");
          }, { once: true });
        }
      }
    });
  });

  // Миготіння заголовків карток
  document.querySelectorAll('.card').forEach(card => {
    const heading = card.querySelector('h2');
    if (!heading) return;

    card.addEventListener('mouseenter', () => {
      heading.classList.remove('blink-animation');
      void heading.offsetWidth;
      heading.classList.add('blink-animation');
    });

    heading.addEventListener('animationend', () => {
      heading.classList.remove('blink-animation');
    });
  });

  // --- Розкриття блоку "Послуги" ---
  const serviceTrigger = document.getElementById("service-trigger");
  const servicesGrid = document.getElementById("services-grid");
  const serviceBack = document.getElementById("service-back");

  if (serviceTrigger && servicesGrid && serviceBack) {
    serviceTrigger.addEventListener("click", () => {
      servicesGrid.classList.remove("hidden");
      serviceTrigger.style.display = "none";
    });

    serviceBack.addEventListener("click", () => {
      servicesGrid.classList.add("hidden");
      serviceTrigger.style.display = "block";
    });
  }

  // --- Універсальний обробник кнопок "Докладніше/Сховати" ---
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    const parent = btn.closest(".card");
    const moreText = parent.querySelector(".more-text");

    if (moreText) {
      moreText.classList.add("hidden");

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        moreText.classList.toggle("hidden");
        btn.textContent = moreText.classList.contains("hidden")
          ? "Докладніше"
          : "Сховати";
      });
    }
  });

  // Валідація форми "Запис на прийом"
  const form = document.getElementById("appointmentForm");
  const nameInput = form.name;
  const phoneInput = form.phone;
  const dateInput = form.date;
  const messageBox = document.createElement("p");
  form.appendChild(messageBox);

  // --- Мінімальна дата = сьогодні ---
  const todayISO = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", todayISO);

  // --- Обмеження вводу для імені ---
  nameInput.addEventListener("input", () => {
    const invalidChars = /[^A-Za-zА-Яа-яЁёІіЇїЄєҐґ\s]/g;
    if (invalidChars.test(nameInput.value)) {
      messageBox.textContent = "Введіть коректне ім’я";
      messageBox.className = "error";
    } else {
      messageBox.textContent = "";
      messageBox.className = "";
    }

    nameInput.value = nameInput.value.replace(invalidChars, "");
    if (nameInput.value.length > 30) {
      nameInput.value = nameInput.value.slice(0, 30);
    }
  });

  // --- Обмеження вводу для телефону ---
  phoneInput.addEventListener("input", () => {
    let value = phoneInput.value;

    if (value.length === 1) {
      if (!/^\+?\d$/.test(value)) {
        value = "";
      }
    } else {
      value = value[0] === "+" ? "+" + value.slice(1).replace(/\D/g, "") : value.replace(/\D/g, "");
    }

    if (value[0] === "+") {
      value = "+" + value.slice(1, 16);
    } else {
      value = value.slice(0, 15);
    }

    phoneInput.value = value;

    const phonePattern = /^\+?\d{10,15}$/;
    if (value && !phonePattern.test(value)) {
      messageBox.textContent = "Введіть коректний номер телефону";
      messageBox.className = "error";
    } else if (nameInput.value.length >= 2 && dateInput.value) {
      messageBox.textContent = "";
      messageBox.className = "";
    }
  });

  // --- Заборона ручного вводу дати і підказка ---
  dateInput.addEventListener("keydown", (e) => {
    e.preventDefault();
    messageBox.textContent = "Оберіть дату з календаря";
    messageBox.className = "error";
  });

  dateInput.addEventListener("change", () => {
    messageBox.textContent = "";
    messageBox.className = "";
  });

  // --- Обробка відправки форми ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const date = dateInput.value;

    let errors = [];
    messageBox.textContent = "";
    messageBox.className = "";

    if (name.length < 2) {
      errors.push("Ім’я має містити щонайменше 2 символи.");
    }

    const phonePattern = /^\+?\d{10,15}$/;
    if (!phonePattern.test(phone)) {
      errors.push("Введіть коректний номер телефону.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (!date) {
      errors.push("Оберіть дату з календаря.");
    } else if (selectedDate < today) {
      errors.push("Дата не може бути раніше сьогоднішнього дня.");
    }

    if (errors.length > 0) {
      messageBox.textContent = errors.join(" ");
      messageBox.classList.add("error");
    } else {
      messageBox.textContent = "Запис успішно відправлено!";
      messageBox.classList.add("success");
      form.reset();
      dateInput.setAttribute("min", todayISO);
    }
  });
});