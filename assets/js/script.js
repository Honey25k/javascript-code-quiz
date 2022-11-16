// global variables to get elements we need. 
var  introQuiz = document.getElementById("intro-page");
var  startQuizButton = document.getElementById("start-quiz");
var  submitButton = document.getElementById("submit-button");
var  questionsPage = document.getElementById("question-screen");
var  timerLabel = document.querySelector(".header-bar p");
var  quizLastScreen = document.querySelector(".end-screen");
var  answerOptionContainer = document.querySelector("#question-screen ul");
var  scoresScreen = document.getElementById("high-scores");
var  firstNameTextBox = quizLastScreen.querySelector("input");

// variables for the different screen/pages 
var currentPage = introQuiz;
var previousPage = introQuiz;

// variables for questions and time  
var timeLeft = 60;
var currentQuestionNumber = 0; 
var finalUserScore; 
var timerSystem;

// questions for quiz
let listOfQuestions = [
    {
        title: "JavaScript File Has An Extension of:",
        choices: [".Java", ".js", ".javascript", ".xjs"], 
        rightAnswer: ".js"

    },

    {
        title: "IsNaN() Evaluates And Argument To Determine if Given Value:",
        choices: ["Is Not a Null", "Is Not a Number", "Is Not a New Object", "None Of The Above"],
        rightAnswer: "Is Not a Number"

    },

    {
        title: "Inside which HTML element do we put the JavaScript?",
        choices: ["Js", "JavaScript", "Script", "Scripting"],
        rightAnswer: "Script"

    },

    {
        title: "How do we write a comment on one line in javascript?",
        choices: ["//", "**", "#", "$$"],
        rightAnswer: "//"

    },

    {
        title: "Which of the following is correct about JavaScript?",
        choices: ["JavaScript is an Object-Based language", "JavaScript is Assembly-language", "JavaScript is a High-level language", "JavaScript is an Object-Oriented language"],
        rightAnswer: "JavaScript is an Object-Oriented language"
    },
]

// function to switch screens from start quiz page. 
// style.display: (display property sets or returns the element's display type)  
function changeToScreen(screen) {
    screen.style.display = "block";     
    currentPage.style.display = "none"; 
    previousPage = currentPage;  
    currentPage = screen; 
}

// timer update with text "time left" 
function updateTimerText() {
    timerLabel.textContent = "Time Left: " + timeLeft;
}

// function for clearing elements 
function clearElements(element) {
    const children = element.children;
    for (let i = children.length - 1; i >= 0; i--) {
        children[i].remove();
    }
}
// function ends quiz when there is no question + get element to use for next question data from list of questions    
function initiateNextQuestion() {
     
    if (currentQuestionNumber >= listOfQuestions.length) {
        whenQuizFinish();
        return;
    }
    
    const questionTitleLabel = document.querySelector("#question-screen h2");
     
    const currentQuestion = listOfQuestions[currentQuestionNumber];
    const questionChoices = currentQuestion.choices;
   
    questionTitleLabel.textContent = currentQuestion.title;
  
    clearElements(answerOptionContainer);

    // for loop: generates next question answer options and new list of question choices.   
    for (let i = 0; i < questionChoices.length; i++) {
        
        let currentChoice = questionChoices[i];

        let li = document.createElement("li");
        let button = document.createElement("button");

        button.textContent = currentChoice;

        li.appendChild(button);
        answerOptionContainer.appendChild(li);
    }
    // get next question to the list 
    currentQuestionNumber++;
}
// shows us last screen with your score and the time left after you finish quiz.
// clearInterval also stops the timer. 
function whenQuizFinish() { 
    changeToScreen(quizLastScreen);

    const scoreTitle = quizLastScreen.querySelector("p");
    scoreTitle.textContent = "Your Score: " + timeLeft;
    finalUserScore = timeLeft;

    clearInterval(timerCounter);

}
// when starting quiz, change to questions/answer screen and start timer (in milliseconds) 
function startQuiz() {
    
    changeToScreen(questionsPage);
    // timer countdown 
    timerCounter = setInterval(function() {
        timeLeft--;
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(timerCounter);
            whenQuizFinish();
        }
        updateTimerText();
    }, 1000);
     
    initiateNextQuestion();
}
// change to high score page 
function highScores() {
    changeToScreen(scoresScreen);
}
// view high scores and get localstorage highscore data    
function viewHighScores() {
    let highScoresContainer = scoresScreen.querySelector("ol");

    let highScoresData = localStorage.getItem("highscore-data");
    if (!highScoresData) {
        highScoresData = [];
    } else {
        highScoresData = JSON.parse(highScoresData);
    }

    clearElements(highScoresContainer);

    for (let i = 0; i < highScoresData.length; i++) {
        let highScoreObject = highScoresData[i];
        let highScoreLi = document.createElement("li");
        highScoreLi.textContent = highScoreObject.initials + " - " + highScoreObject.score;

        highScoresContainer.appendChild(highScoreLi);
    }

}
// add first name for submit box to get your score. 
  
function whenSubmitClick() {
    if (!firstNameTextBox.value) {
        return;
    }

    let oldData = localStorage.getItem("highscore-data");
    let dataToSave = {
        score: finalUserScore,
        initials: firstNameTextBox.value
    }

    if (!oldData) {
        oldData = [];
    } else {
        console.log("old data is:", oldData);
        oldData = JSON.parse(oldData);
    }

    oldData.push(dataToSave);
    localStorage.setItem("highscore-data", JSON.stringify(oldData));

    changeToScreen(scoresScreen);
    viewHighScores();
}

// when answer option is clicked generate text of your correct or wrong. 
// when answer is wrong we penalize uzer with -10 seconds time left.      
function answerOptionClicked(event) {

    let buttonSelected = event.target;
    const currentQuestion = listOfQuestions[currentQuestionNumber - 1];
    const answerMessage = questionsPage.querySelector("p");

    if (buttonSelected.matches("button")) {
        if (buttonSelected.textContent === currentQuestion.rightAnswer) {
            answerMessage.textContent = "You are correct!";
        } else {
            answerMessage.textContent = "You are wrong!";
            timeLeft -= 10; 
            updateTimerText();
        }
        setTimeout(function() {
            answerMessage.textContent = "";
        }, 1500);
        initiateNextQuestion();
    }
}
// event listeners for "start quiz" button, "submit" button and answer options buttons.  
startQuizButton.addEventListener("click", startQuiz);
submitButton.addEventListener("click", whenSubmitClick);
answerOptionContainer.addEventListener("click", answerOptionClicked)
