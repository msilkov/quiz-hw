// Code optimization with DRY concept dry - dont repeat yourself

// Обьект со сбором данных
var answers = {};

// Движение вперед
var btnNext = document.querySelectorAll('[data-nav ="next"]');
btnNext.forEach(function (button) {
  button.addEventListener("click", function () {
    var thisCard = this.closest("[data-card]");
    var thisCardNumber = parseInt(thisCard.dataset.card);
    // card validation
    if (thisCard.dataset.validate == "novalidate") {
      navigate("next", thisCard);
      updProgressBar("next", thisCardNumber);
    } else {
      // сохраняем данные в объект при движении вперед
      saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));
      if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
        navigate("next", thisCard);
        updProgressBar("next", thisCardNumber);
      } else {
        alert("Выберите вариант ответа для перехода к следующему вопросу!");
      }
    }
  });
});

var btnPrev = document.querySelectorAll('[data-nav ="prev"]');
btnPrev.forEach(function (button) {
  button.addEventListener("click", function () {
    var thisCard = this.closest("[data-card]");
    var thisCardNumber = parseInt(thisCard.dataset.card);
    navigate("prev", thisCard);
    updProgressBar("prev", thisCardNumber);
  });
});

// функция навигации вперед и назад
function navigate(direction, thisCard) {
  var thisCardNumber = parseInt(thisCard.dataset.card);
  var nextCardNumber;
  if (direction == "next") {
    nextCardNumber = thisCardNumber + 1;
  } else if (direction == "prev") {
    nextCardNumber = thisCardNumber - 1;
  }

  thisCard.classList.add("hidden");

  thisCard.classList.add("hidden");
  document
    .querySelector(`[data-card="${nextCardNumber}"]`)
    .classList.remove("hidden");
}

// функция сбора данных из текущей карточки
function gatherCardData(number) {
  var question;
  var result = [];

  // находим карточку по номеру и дата атрибуту

  var currentCard = document.querySelector(`[data-card = "${number}"]`);
  //  находим главый вопрос
  question = currentCard.querySelector("[data-question]").innerText;
  // get radio info
  var radioValues = currentCard.querySelectorAll('[type="radio"]');

  radioValues.forEach(function (item) {
    // если кнопка нажата то забираем ее значение свойство checked
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });
  // find info from checkboxes
  var checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');

  checkBoxValues.forEach(function (item) {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  var inputValues = currentCard.querySelectorAll(
    '[type="text"], [type="email"], [type="number"]'
  );
  inputValues.forEach(function (item) {
    itemValue = item.value;
    if (itemValue.trim() != "") {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });
  //  формирование обьекта с вопросм и ответом
  var data = {
    question: question,
    answer: result,
  };
  return data;
}

// функция записи ответа в объект с ответами

function saveAnswer(number, data) {
  answers[number] = data;
}
// функция проверки на заполненость в карточке ответа
function isFilled(number) {
  if (answers[number].answer.length > 0) {
    return true;
  } else {
    return false;
  }
}
// функция проверки валидного email
function validateEmail(email) {
  var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
  return pattern.test(email);
}
// функция проверки заполнения обязательных полей
function checkOnRequired(number) {
  // находим карточку по номеру и дата атрибуту
  var currentCard = document.querySelector(`[data-card = "${number}"]`);
  var requiredField = currentCard.querySelectorAll("[required]");
  var isValidArray = [];
  requiredField.forEach(function (item) {
    if (item.type == "checkbox" && item.checked == false) {
      isValidArray.push(false);
    } else if (item.type == "email") {
      if (validateEmail(item.value)) {
        isValidArray.push(true);
      } else {
        isValidArray.push(false);
      }
    }
  });
  if (isValidArray.indexOf(false) == -1) {
    return true;
  } else {
    return false;
  }
}

// подсветка рамки у радиокнопок
document.querySelectorAll(".radio-group").forEach(function (item) {
  item.addEventListener("click", function (e) {
    var label = e.target.closest("label");
    if (label) {
      label
        .closest(".radio-group")
        .querySelectorAll("label")
        .forEach(function (item) {
          item.classList.remove("radio-block--active");
        });
      label.classList.add("radio-block--active");
    }
  });
});
// подсветка рамки у checckbox
document
  .querySelectorAll('label.checkbox-block input[type="checkbox"]')
  .forEach(function (item) {
    item.addEventListener("change", function () {
      if (item.checked) {
        // если тру то добавляем рамку
        item.closest("label").classList.add("checkbox-block--active");
      } else {
        item.closest("label").classList.remove("checkbox-block--active");
      }
    });
  });
// progress bar

function updProgressBar(direction, cardNumber) {
  var cardsQuantity = document.querySelectorAll("[data-card]").length;
  if (direction == "next") {
    cardNumber = cardNumber + 1;
  } else if (direction == "prev") {
    cardNumber = cardNumber - 1;
  }

  var progress = ((cardNumber * 100) / cardsQuantity).toFixed();

  var progressBar = document
    .querySelector(`[data-card = "${cardNumber}"]`)
    .querySelector(".progress");

  if (progressBar) {
    progressBar.querySelector(
      ".progress__label strong"
    ).innerText = `${progress}%`;
    progressBar.querySelector(
      ".progress__line-bar"
    ).style = `width: ${progress}%`;
  }
}
