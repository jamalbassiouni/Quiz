// Selector.
const quizOptions = document.getElementById("quizOptions");
const categoryMenu = document.getElementById("categoryMenu");
const difficultyOptions = document.getElementById("difficultyOptions");
const questionsNumber = document.getElementById("questionsNumber");
const startBtn = document.getElementById("startBtn");
const questionsContainer = document.querySelector(".questions-container");

let groupQuestion;
let quiz;

startBtn.addEventListener("click", async function () {
  const category = categoryMenu.value;
  const difficulty = difficultyOptions.value;
  const numberOfQuestions = questionsNumber.value;
  quiz = new Quiz(category, difficulty, numberOfQuestions);
  groupQuestion = await quiz.getQuestion();
  console.log(groupQuestion);
  const questionApi = new Question(0);
  console.log(questionApi);
  quizOptions.classList.replace("d-flex", "d-none");
  questionApi.display();
});

// Class Quiz , Fetch API
class Quiz {
  constructor(category, difficulty, questionsNumber) {
    this.category = category;
    this.difficulty = difficulty;
    this.number = questionsNumber;
    this.score = 0;
  }
  getApiReady() {
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`;
  }
  async getQuestion() {
    const response = await fetch(this.getApiReady());
    const questions = await response.json();
    return questions.results;
  }
  // Show result.
  showResult() {
    return `
    <div class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
      <h2 class="mb-0">
      ${this.score == this.number
        ? `Congratulations 🎉`
        : `Your score is ${this.score}`
      }      
      </h2>
      <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
    </div>
  `;
  }
}

// Take the question from API.
class Question {
  constructor(index) {
    this.index = index;
    this.question = groupQuestion[index].question;
    this.category = groupQuestion[index].category;
    this.difficulty = groupQuestion[index].difficulty;
    this.correct = groupQuestion[index].correct_answer;
    this.choices = this.getChoices(groupQuestion[index]);
    this.answered = false;
  }

  getChoices(questionDetails) {
    return questionDetails.incorrect_answers
      .concat(questionDetails.correct_answer)
      .sort();
  }
  // Display Question.
  display() {
    const questionMarkUp = `
          <div
            class="question shadow-lg col-lg-6 offset-lg-3 p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
            <div class="w-100 d-flex justify-content-between">
              <span class="btn btn-category">${this.category}</span>
              <span class="fs-6 btn btn-questions">${this.index + 1} of ${groupQuestion.length
      } Questions</span>
            </div>
            <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
            <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
            ${this.choices
        .map((choice) => `<li>${choice}</li>`)
        .toString()
        .replaceAll(",", "")}
            </ul>
            <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${quiz.score
      }</h2>        
          </div>
        `;
        
// ${this.choices[1] ? `<li>${this.choices[1]}</li>` : ""}
// ${this.choices[2] ? `<li>${this.choices[2]}</li>` : ""}
// ${this.choices[3] ? `<li>${this.choices[3]}</li>` : ""}

    questionsContainer.innerHTML = questionMarkUp;

    const choices = document.querySelectorAll("ul li");
    for (let i = 0; i < choices.length; i++) {
      choices[i].addEventListener("click", () => {
        this.checkAnswer(choices[i]);
        this.animateQuestion(choices[i]);
        this.nextQuestion();
      });
    }
  }

  // Answer choose.
  checkAnswer(choice) {
    if (!this.answered) {
      this.answered = true;
      if (choice.innerHTML == this.correct) {
        choice.classList.add(
          "correct",
          "animate__animated",
          "animate__flipInY"
        );
        quiz.score++;
      } else {
        choice.classList.add("wrong", "animate__animated", "animate__shakeX");
      }
    }
  }

  nextQuestion() {
    this.index++;
    setTimeout(() => {
      if (this.index < groupQuestion.length) {
        const newQuestion = new Question(this.index);
        newQuestion.display();
      } else {
        questionsContainer.innerHTML = quiz.showResult();
        const tryAgain = document.querySelector(".again");
        tryAgain.addEventListener("click", function () {
          questionsContainer.querySelector(".question").classList.replace("d-flex", "d-none");
          categoryMenu.value = "";
          difficultyOptions.value = "easy";
          questionsNumber.value = "";
          quizOptions.classList.replace("d-none", "d-flex");

          // & Another Solution.
          // window.location.reload();

          // & Another Solution but need server.
          // location.href = '../../Index.Html';
        });
      }
    }, 1000);
  }

  // animate All Question
  animateQuestion(choice) {
    setTimeout(() => {
      choice
        .closest(".question")
        .classList.add("animate__animated", "animate__bounceOutLeft");
    }, 1000);
  }
}
