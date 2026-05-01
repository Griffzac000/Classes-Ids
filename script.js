// ============================================================
//  VARIABLES & DATA TYPES
//  const for things that never change, let for things that do
// ============================================================

const SITE_NAME = "Images of Fashion";   // string
const CURRENT_YEAR = 2026;               // number
let activeFilter = "all";                // string — changes when user filters
let quizScore = 0;                       // number — changes as quiz runs
let quizAnswered = false;                // boolean — tracks quiz state


// ============================================================
//  ARRAYS & OBJECTS
//  Each fashion style is an object; all styles live in an array
// ============================================================

const fashionStyles = [
    {
        id: "streetwear",
        label: "Streetwear",
        emoji: "👟",
        tags: ["casual", "bold"],
        description:
            "A casual, youth-driven style blending comfort, bold graphics, and culture " +
            "from skateboarding, hip-hop, sportswear, and Japanese street culture.",
        imageSrc: "../images/streetwear.webp",
    },
    {
        id: "classical",
        label: "Classical",
        emoji: "🎩",
        tags: ["formal", "refined"],
        description:
            "Emphasises refinement, balance, and durability, drawing from traditional " +
            "European tailoring and mid-20th-century fashion icons.",
        imageSrc: "../images/classic.webp",
    },
    {
        id: "grunge",
        label: "Grunge",
        emoji: "🎸",
        tags: ["casual", "bold"],
        description:
            "A rebellious, undone style from the early-90s Seattle music scene — " +
            "effortless and slightly messy, often built from thrifted pieces.",
        imageSrc: "../images/grunge.jpg",
    },
    {
        id: "formal",
        label: "Formal",
        emoji: "🥂",
        tags: ["formal", "refined"],
        description:
            "Clothing worn for prestigious occasions — structured, well-fitted garments " +
            "made from high-quality fabrics, polished and elegant.",
        imageSrc: "../images/formal.jpg",
    },
    {
        id: "casual",
        label: "Casual",
        emoji: "☀️",
        tags: ["casual"],
        description:
            "About comfort, simplicity, and everyday wear. T-shirts, jeans, hoodies, " +
            "sneakers — easy to throw on while still looking put-together.",
        imageSrc: "../images/casual.webp",
    },
];

// Quiz questions stored as an array of objects
const quizQuestions = [
    {
        question: "What's your ideal Saturday?",
        answers: [
            { text: "Thrift shopping & concerts", style: "grunge" },
            { text: "Brunch then a gallery visit", style: "classical" },
            { text: "Skate park with friends", style: "streetwear" },
            { text: "Garden party or wedding", style: "formal" },
        ],
    },
    {
        question: "Pick a colour palette:",
        answers: [
            { text: "Black, grey, plaid", style: "grunge" },
            { text: "Navy, cream, camel", style: "classical" },
            { text: "Neon, white, graphic prints", style: "streetwear" },
            { text: "Ivory, champagne, deep jewel tones", style: "formal" },
        ],
    },
    {
        question: "Your go-to footwear?",
        answers: [
            { text: "Beat-up Doc Martens", style: "grunge" },
            { text: "Oxford shoes or loafers", style: "classical" },
            { text: "Limited-edition sneakers", style: "streetwear" },
            { text: "Heels or polished dress shoes", style: "formal" },
        ],
    },
];


// ============================================================
//  FUNCTION 1 — renderGallery
//  Builds gallery cards from the fashionStyles array and
//  inserts them into the DOM with innerHTML
// ============================================================

function renderGallery(filter) {
    const grid = document.querySelector(".gallery-grid");
    if (!grid) return;   // only runs on images.html

    // CONDITIONAL — decide which styles to show
    let stylesToShow;
    if (filter === "all") {
        stylesToShow = fashionStyles;
    } else {
        // LOOP — filter checks each style's tags array
        stylesToShow = fashionStyles.filter(style => style.tags.includes(filter));
    }

    // LOOP — build a card string for every matching style
    let cardsHTML = "";
    stylesToShow.forEach(style => {
        cardsHTML += `
            <div class="gallery-item" data-id="${style.id}">
                <img src="${style.imageSrc}"
                     alt="${style.label}"
                     onerror="this.style.display='none'">
                <p><strong>${style.label}</strong> — ${style.description}</p>
            </div>
        `;
    });

    // CONDITIONAL — show a message if nothing matched
    if (cardsHTML === "") {
        cardsHTML = "<p style='grid-column:1/-1; text-align:center;'>No styles match that filter.</p>";
    }

    grid.innerHTML = cardsHTML;   // DOM MANIPULATION — innerHTML
}


// ============================================================
//  FUNCTION 2 — renderQuiz
//  Builds the style-quiz UI and wires up answer buttons
// ============================================================

function renderQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    if (!quizContainer) return;   // only runs on images.html

    // LOOP — build one fieldset per question
    let quizHTML = '<h2 class="text-title">What\'s Your Style?</h2>';
    quizQuestions.forEach((q, qIndex) => {
        quizHTML += `<fieldset style="border:none; margin-bottom:1rem; padding:0;">
            <legend style="font-weight:bold; margin-bottom:0.5rem;">${q.question}</legend>`;

        q.answers.forEach((answer, aIndex) => {
            // Each answer is a radio button so only one per question is selectable
            quizHTML += `
                <label style="display:block; margin-bottom:4px; cursor:pointer;">
                    <input type="radio"
                           name="q${qIndex}"
                           value="${answer.style}"
                           id="q${qIndex}-a${aIndex}">
                    ${answer.text}
                </label>`;
        });

        quizHTML += `</fieldset>`;
    });

    quizHTML += `
        <button id="quiz-submit-btn" style="margin-top:0.5rem; padding:8px 20px; cursor:pointer;">
            See My Style
        </button>
        <p id="quiz-result" style="margin-top:1rem; font-weight:bold;"></p>`;

    quizContainer.innerHTML = quizHTML;   // DOM MANIPULATION — innerHTML

    // EVENT LISTENER 1 — click on the quiz submit button
    document.getElementById("quiz-submit-btn").addEventListener("click", evaluateQuiz);
}


// ============================================================
//  FUNCTION 3 — evaluateQuiz
//  Reads radio selections, tallies votes, and picks a winner
// ============================================================

function evaluateQuiz() {
    if (quizAnswered) return;   // CONDITIONAL — prevent re-submitting

    // OBJECT — tally votes for each style
    const votes = {
        streetwear: 0,
        classical: 0,
        grunge: 0,
        formal: 0,
    };

    let allAnswered = true;

    // LOOP — check every question
    quizQuestions.forEach((q, qIndex) => {
        const selected = document.querySelector(`input[name="q${qIndex}"]:checked`);
        if (selected) {
            votes[selected.value] += 1;   // increment the matching style
        } else {
            allAnswered = false;
        }
    });

    const resultEl = document.getElementById("quiz-result");   // DOM MANIPULATION — getElementById

    // CONDITIONAL — require all questions answered
    if (!allAnswered) {
        resultEl.textContent = "Please answer every question first!";
        resultEl.style.color = "crimson";
        return;
    }

    // Find the style with the highest vote count
    let topStyle = "";
    let topVotes = 0;
    for (const style in votes) {          // LOOP — for...in over the votes object
        if (votes[style] > topVotes) {
            topVotes = votes[style];
            topStyle = style;
        }
    }

    quizScore = topVotes;     // update the module-level variable
    quizAnswered = true;      // lock the quiz

    // SWITCH — pick a personalised message based on result
    let message = "";
    switch (topStyle) {
        case "streetwear":
            message = "You're Streetwear — expressive, current, and effortlessly cool.";
            break;
        case "classical":
            message = "You're Classical — timeless, refined, and always appropriate.";
            break;
        case "grunge":
            message = "You're Grunge — rebellious, authentic, and unapologetically you.";
            break;
        case "formal":
            message = "You're Formal — polished, elegant, and dressed for every occasion.";
            break;
        default:
            message = "You have eclectic taste — a true fashion chameleon!";
    }

    resultEl.textContent = message;                             // DOM MANIPULATION — textContent
    resultEl.style.color = "inherit";
    document.getElementById("quiz-submit-btn").textContent = "Submitted ✓";
    document.getElementById("quiz-submit-btn").disabled = true;
}


// ============================================================
//  FUNCTION 4 — setupFilterButtons
//  Adds click listeners to filter buttons on images.html
// ============================================================

function setupFilterButtons() {
    const buttons = document.querySelectorAll(".filter-btn");   // DOM MANIPULATION — querySelectorAll
    if (buttons.length === 0) return;

    // EVENT LISTENER 2 — click on any filter button
    buttons.forEach(btn => {
        btn.addEventListener("click", function () {
            activeFilter = this.dataset.filter;   // update the module-level variable

            // LOOP — remove active class from all, add to clicked
            buttons.forEach(b => b.classList.remove("active-filter"));
            this.classList.add("active-filter");

            renderGallery(activeFilter);   // re-render with new filter
        });
    });
}


// ============================================================
//  FUNCTION 5 — setupContactForm
//  Validates the contact form on contact.html
// ============================================================

function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;   // only runs on contact.html

    const feedback = document.getElementById("form-feedback");

    // EVENT LISTENER 3 — submit event on the form
    form.addEventListener("submit", function (event) {
        event.preventDefault();   // stop the page from reloading

        // VARIABLES — grab each field's current value
        const nameVal    = document.getElementById("name-input").value.trim();     // string
        const emailVal   = document.getElementById("email-input").value.trim();    // string
        const messageVal = document.getElementById("message-input").value.trim();  // string

        // CONDITIONAL — basic validation checks
        if (nameVal === "" || emailVal === "" || messageVal === "") {
            feedback.textContent = "Please fill in all fields.";
            feedback.style.color = "crimson";
            return;
        }

        // CONDITIONAL — simple email format check
        const hasAt   = emailVal.includes("@");   // boolean
        const hasDot  = emailVal.includes(".");   // boolean

        if (!hasAt || !hasDot) {
            feedback.textContent = "Please enter a valid email address.";
            feedback.style.color = "crimson";
            return;
        }

        // All good — confirm submission
        feedback.textContent = `Thanks, ${nameVal}! We'll be in touch at ${emailVal}.`;
        feedback.style.color = "green";
        form.reset();
    });

    // EVENT LISTENER 4 — input event clears old feedback as the user types
    form.addEventListener("input", function () {
        if (feedback.textContent !== "") {
            feedback.textContent = "";
        }
    });
}


// ============================================================
//  FUNCTION 6 — updateFooterYear
//  Small utility: keeps the copyright year current
// ============================================================

function updateFooterYear() {
    const footer = document.querySelector("footer p");   // DOM MANIPULATION — querySelector
    if (!footer) return;
    footer.textContent = `© ${CURRENT_YEAR} ${SITE_NAME}. All rights reserved.`;
}


// ============================================================
//  ENTRY POINT — runs once the page has fully loaded
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
    updateFooterYear();
    renderGallery("all");
    renderQuiz();
    setupFilterButtons();
    setupContactForm();
});