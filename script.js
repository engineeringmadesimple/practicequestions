const quizQuestions = {
    "Civil Engineering": [
        {
            question: "What is the standard unit for measuring concrete strength?",
            options: ["Newton", "Pascal", "Megapascal", "Kilogram"],
            correct: 2
        },
        {
            question: "Which material is commonly used as a binding agent in concrete?",
            options: ["Lime", "Cement", "Sand", "Gravel"],
            correct: 1
        },
    ],
    "Mechanical Engineering": [
        {
            question: "What type of energy is stored in a compressed spring?",
            options: ["Kinetic energy", "Thermal energy", "Potential energy", "Nuclear energy"],
            correct: 2
        },
        {
            question: "Which of the following is a thermodynamic cycle?",
            options: ["Carnot cycle", "Hooke's law", "Ohm's law", "Euler's formula"],
            correct: 0
        },
    ],
    "Electrical Engineering": [
        {
            question: "What is the SI unit of electrical resistance?",
            options: ["Ohm", "Ampere", "Volt", "Watt"],
            correct: 0
        },
        {
            question: "Which component is used to store electrical energy?",
            options: ["Resistor", "Capacitor", "Inductor", "Diode"],
            correct: 1
        },
    ]
};

function updateProgress() {
    const answered = document.querySelectorAll('input[type="radio"]:checked').length;
    const total = document.querySelectorAll('.question-container').length;

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    const percentage = (answered / total) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `Questions Answered: ${answered}/${total}`;
}

function createQuiz(topic) {
    const allQuestions = quizQuestions[topic];
    if (!allQuestions) return;

    const questions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);

    const quizContainer = document.getElementById('quizContainer');
    const progressContainer = document.getElementById('progressContainer');

    quizContainer.style.display = 'block';
    progressContainer.style.display = 'block';
    quizContainer.innerHTML = '';

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        questionDiv.dataset.correct = q.correct;

        const questionText = document.createElement('div');
        questionText.className = 'question';
        questionText.textContent = `${index + 1}. ${q.question}`;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        q.options.forEach((opt, optIndex) => {
            const option = document.createElement('label');
            option.className = 'option';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `question${index}`;
            radio.value = optIndex;
            radio.addEventListener('change', updateProgress);

            const optionText = document.createTextNode(opt);
            const resultIndicator = document.createElement('span');
            resultIndicator.className = 'result-indicator';
            resultIndicator.innerHTML = '✓';

            option.appendChild(radio);
            option.appendChild(optionText);
            option.appendChild(resultIndicator);
            optionsDiv.appendChild(option);
        });

        questionDiv.appendChild(questionText);
        questionDiv.appendChild(optionsDiv);
        quizContainer.appendChild(questionDiv);
    });

    const submitButton = document.createElement('button');
    submitButton.className = 'submit-btn';
    submitButton.textContent = 'Submit Quiz';
    submitButton.disabled = true;

    const enableSubmitButton = () => {
        const totalQuestions = document.querySelectorAll('.question-container').length;
        const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
        submitButton.disabled = answeredQuestions < totalQuestions;
    };

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', enableSubmitButton);
    });

    submitButton.onclick = () => {
        checkAnswers();
        submitButton.style.display = 'none';
    };

    quizContainer.appendChild(submitButton);

    updateProgress();
}

function checkAnswers() {
    const questionContainers = document.querySelectorAll('.question-container');
    let score = 0;

    questionContainers.forEach((container, index) => {
        const selectedOption = container.querySelector(`input[name="question${index}"]:checked`);
        const resultIndicators = container.querySelectorAll('.result-indicator');

        resultIndicators.forEach(indicator => {
            indicator.style.display = 'none';
        });

        if (selectedOption) {
            const correctAnswer = parseInt(container.dataset.correct);
            const isCorrect = parseInt(selectedOption.value) === correctAnswer;

            const indicator = selectedOption.parentElement.querySelector('.result-indicator');
            indicator.innerHTML = isCorrect ? '✓' : '✗';
            indicator.className = `result-indicator ${isCorrect ? 'correct' : 'incorrect'}`;
            indicator.style.display = 'inline';

            if (isCorrect) score++;
        }
    });

    const scorePopup = document.createElement('div');
    scorePopup.className = 'score-popup';
    scorePopup.style.display = 'block';

    const scorePopupContent = document.createElement('div');
    scorePopupContent.className = 'score-popup-content';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = `Your score: ${score}/${questionContainers.length}`;

    const tryAgainButton = document.createElement('button');
    tryAgainButton.className = 'try-again-btn';
    tryAgainButton.textContent = 'Try Another Round';
    tryAgainButton.onclick = () => {
        const currentTopic = document.getElementById('topicSelect').value;
        createQuiz(currentTopic);
        scorePopup.remove();
    };

    scorePopupContent.appendChild(scoreDisplay);
    scorePopupContent.appendChild(tryAgainButton);
    scorePopup.appendChild(scorePopupContent);
    document.body.appendChild(scorePopup);

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.disabled = true;
    });
}

document.getElementById('topicSelect').addEventListener('change', (e) => {
    createQuiz(e.target.value);
});
