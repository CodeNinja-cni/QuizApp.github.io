/* ══════════════════════════════════════════════
   TRIVIA CHALLENGE — quiz.js
   Features added:
   · 15-second countdown timer per question
   · Correct / wrong visual feedback on buttons
   · Emoji flash on answer
   · Streak tracker (consecutive correct answers)
   · LocalStorage leaderboard (top 10)
   · Animated score ring on result screen
   · Progress bar
   ══════════════════════════════════════════════ */

// ── DOM REFS ──
const startScreen    = document.getElementById('start-screen');
const quizScreen     = document.getElementById('quiz-screen');
const resultScreen   = document.getElementById('result-screen');
const nameInput      = document.getElementById('user-name');
const startBtn       = document.getElementById('start-btn');
const highScoreBtn   = document.getElementById('h_score');
const tracker        = document.getElementById('tracker');
const scoreBadge     = document.getElementById('score-badge');
const playerTag      = document.getElementById('player-tag');
const progressFill   = document.getElementById('progress-fill');
const questionEl     = document.getElementById('question');
const timerNum       = document.getElementById('timer-num');
const ringArc        = document.getElementById('ring-arc');
const streakBar      = document.getElementById('streak-bar');
const feedbackEl     = document.getElementById('feedback');
const optionBtns     = document.querySelectorAll('.option-btn');

// result screen
const resultEmoji    = document.getElementById('result-emoji');
const resultTitle    = document.getElementById('result-title');
const resultName     = document.getElementById('result-name');
const finalScore     = document.getElementById('final-score');
const srArc          = document.getElementById('sr-arc');
const rsCorrect      = document.getElementById('rs-correct');
const rsWrong        = document.getElementById('rs-wrong');
const rsStreak       = document.getElementById('rs-streak');
const resultMsg      = document.getElementById('result-msg');
const playAgainBtn   = document.getElementById('play-again-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');

// leaderboard modal
const lbModal   = document.getElementById('lb-modal');
const lbClose   = document.getElementById('lb-close');
const lbList    = document.getElementById('lb-list');
const lbClear   = document.getElementById('lb-clear');

// ── QUESTION BANK ──
const question_array = [
  { question: "What is the capital of France?",        a:"Berlin",      b:"Paris",       c:"Madrid",      d:"Rome",        correct:"b" },
  { question: "What is 2 + 2?",                        a:"3",           b:"4",           c:"5",           d:"6",           correct:"b" },
  { question: "Largest planet in solar system?",        a:"Jupiter",     b:"Saturn",      c:"Neptune",     d:"Uranus",      correct:"a" },
  { question: "Who wrote 'Hamlet'?",                   a:"Dickens",     b:"Shakespeare", c:"Austen",      d:"Twain",       correct:"b" },
  { question: "Symbol for gold?",                      a:"Ag",          b:"Au",          c:"Fe",          d:"Pb",          correct:"b" },
  { question: "Smallest prime number?",                a:"0",           b:"1",           c:"2",           d:"3",           correct:"c" },
  { question: "Year the Titanic sank?",                a:"1912",        b:"1913",        c:"1914",        d:"1915",        correct:"a" },
  { question: "Hardest natural substance?",            a:"Gold",        b:"Diamond",     c:"Iron",        d:"Platinum",    correct:"b" },
  { question: "Who painted the Mona Lisa?",            a:"Van Gogh",    b:"Picasso",     c:"Da Vinci",    d:"Dalí",        correct:"c" },
  { question: "Largest mammal?",                       a:"Blue Whale",  b:"Elephant",    c:"Giraffe",     d:"Hippo",       correct:"a" },
  { question: "Boiling point of water?",               a:"90°C",        b:"100°C",       c:"110°C",       d:"120°C",       correct:"b" },
  { question: "The Red Planet?",                       a:"Earth",       b:"Mars",        c:"Venus",       d:"Jupiter",     correct:"b" },
  { question: "Main ingredient in guacamole?",         a:"Tomato",      b:"Onion",       c:"Lime",        d:"Avocado",     correct:"d" },
  { question: "Father of Computers?",                  a:"Turing",      b:"Babbage",     c:"Gates",       d:"Jobs",        correct:"b" },
  { question: "Currency of Japan?",                    a:"Yen",         b:"Won",         c:"Yuan",        d:"Euro",        correct:"a" },
  { question: "Gas plants absorb?",                    a:"Oxygen",      b:"CO2",         c:"Nitrogen",    d:"Hydrogen",    correct:"b" },
  { question: "Discovered penicillin?",                a:"Curie",       b:"Fleming",     c:"Pasteur",     d:"Lister",      correct:"b" },
  { question: "Largest ocean?",                        a:"Atlantic",    b:"Indian",      c:"Pacific",     d:"Arctic",      correct:"c" },
  { question: "Smallest country?",                     a:"Monaco",      b:"Vatican City",c:"San Marino",  d:"Liechtenstein",correct:"b" },
  { question: "Formula for water?",                    a:"H2O",         b:"CO2",         c:"NaCl",        d:"O2",          correct:"a" },
  { question: "How many continents?",                  a:"5",           b:"6",           c:"7",           d:"8",           correct:"c" },
  { question: "Fastest land animal?",                  a:"Lion",        b:"Cheetah",     c:"Leopard",     d:"Tiger",       correct:"b" },
  { question: "Earth's natural satellite?",            a:"Sun",         b:"Mars",        c:"Moon",        d:"Venus",       correct:"c" },
  { question: "Invented the lightbulb?",               a:"Tesla",       b:"Edison",      c:"Bell",        d:"Newton",      correct:"b" },
  { question: "Longest river?",                        a:"Amazon",      b:"Nile",        c:"Mississippi", d:"Yangtze",     correct:"b" },
  { question: "Highest mountain?",                     a:"K2",          b:"Everest",     c:"Fuji",        d:"Denali",      correct:"b" },
  { question: "Square root of 81?",                    a:"7",           b:"8",           c:"9",           d:"10",          correct:"c" },
  { question: "Traditional primary colors?",           a:"R,G,B",       b:"R,Y,B",       c:"B,Y,G",       d:"R,Y,G",       correct:"b" },
  { question: "National animal of Scotland?",          a:"Lion",        b:"Eagle",       c:"Unicorn",     d:"Dragon",      correct:"c" },
  { question: "Colors in a rainbow?",                  a:"5",           b:"6",           c:"7",           d:"8",           correct:"c" },
  { question: "Which organ filters blood?",            a:"Heart",       b:"Liver",       c:"Kidney",      d:"Lungs",       correct:"c" },
  { question: "World's most populous city?",           a:"NYC",         b:"Shanghai",    c:"Tokyo",       d:"Delhi",       correct:"c" },
  { question: "Bones in the human ear?",               a:"1",           b:"2",           c:"3",           d:"4",           correct:"c" },
  { question: "Symbol for Iron?",                      a:"Ir",          b:"Fe",          c:"In",          d:"Au",          correct:"b" },
  { question: "Who wrote 'The Odyssey'?",              a:"Homer",       b:"Virgil",      c:"Socrates",    d:"Plato",       correct:"a" },
  { question: "Hottest planet in the solar system?",   a:"Mercury",     b:"Venus",       c:"Mars",        d:"Jupiter",     correct:"b" },
  { question: "Smallest unit of matter?",              a:"Cell",        b:"Atom",        c:"Molecule",    d:"Proton",      correct:"b" },
  { question: "Powerhouse of the cell?",               a:"Nucleus",     b:"Ribosome",    c:"Mitochondria",d:"Golgi",       correct:"c" },
  { question: "Who discovered gravity?",               a:"Einstein",    b:"Newton",      c:"Galileo",     d:"Hawking",     correct:"b" },
  { question: "Largest internal organ?",               a:"Heart",       b:"Lungs",       c:"Liver",       d:"Kidney",      correct:"c" },
  { question: "Elements in the periodic table?",       a:"100",         b:"112",         c:"118",         d:"120",         correct:"c" },
  { question: "Language spoken in Brazil?",            a:"Spanish",     b:"Portuguese",  c:"English",     d:"French",      correct:"b" },
  { question: "First man on the moon?",                a:"Aldrin",      b:"Armstrong",   c:"Collins",     d:"Gagarin",     correct:"b" },
  { question: "The 'Windy City'?",                     a:"NYC",         b:"Chicago",     c:"Seattle",     d:"Miami",       correct:"b" },
  { question: "How many hearts does an octopus have?", a:"1",           b:"2",           c:"3",           d:"4",           correct:"c" },
  { question: "What does CPU stand for?",              a:"Central Processing Unit",b:"Core Processing Unit",c:"Computer Power Unit",d:"Central Power Unit", correct:"a" },
  { question: "Largest desert on Earth?",              a:"Sahara",      b:"Gobi",        c:"Antarctica",  d:"Arabian",     correct:"c" },
  { question: "First commercially sold video game?",   a:"Pong",        b:"Tetris",      c:"Pac-Man",     d:"Tennis for Two", correct:"d" },
  { question: "The Statue of Liberty was a gift from?",a:"UK",          b:"Germany",     c:"France",      d:"Italy",       correct:"c" },
  { question: "How many sides does a hexagon have?",   a:"5",           b:"6",           c:"7",           d:"8",           correct:"b" },
];

// ── STATE ──
let quizPool        = [];
let currentQuestion = null;
let questionCount   = 0;
let score           = 0;
let correctCount    = 0;
let wrongCount      = 0;
let streak          = 0;
let bestStreak      = 0;
let timerInterval   = null;
let timeLeft        = 15;
const TOTAL_Q       = 10;
const TIME_PER_Q    = 15;
const RING_CIRCUM   = 169.6;   // 2π × 27

// ── HELPERS ──
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  // force reflow so animation restarts
  void el.offsetWidth;
  el.classList.add('active');
}

// ── TIMER ──
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIME_PER_Q;
  updateTimerUI();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeExpired();
    }
  }, 1000);
}

function updateTimerUI() {
  timerNum.textContent = timeLeft;
  const offset = RING_CIRCUM * (1 - timeLeft / TIME_PER_Q);
  ringArc.style.strokeDashoffset = offset;

  ringArc.classList.remove('warning', 'danger');
  if (timeLeft <= 5)       ringArc.classList.add('danger');
  else if (timeLeft <= 8)  ringArc.classList.add('warning');
}

function timeExpired() {
  flashFeedback('⏰');
  lockOptions(null); // reveal correct without selecting
  streak = 0;
  wrongCount++;
  updateStreakBar();
  setTimeout(nextQuestion, 1200);
}

// ── QUESTIONS ──
function displayQuestion() {
  if (questionCount >= TOTAL_Q) { finishQuiz(); return; }

  currentQuestion = quizPool[questionCount];
  questionCount++;

  // text
  questionEl.textContent = currentQuestion.question;
  optionBtns.forEach(btn => {
    const key = btn.id;
    btn.querySelector('.opt-text').textContent = currentQuestion[key];
    btn.classList.remove('correct', 'wrong');
    btn.disabled = false;
    btn.style.opacity = '';
  });

  // header
  tracker.textContent    = `${questionCount} / ${TOTAL_Q}`;
  progressFill.style.width = `${(questionCount - 1) / TOTAL_Q * 100}%`;

  startTimer();
}

function nextQuestion() {
  progressFill.style.width = `${questionCount / TOTAL_Q * 100}%`;
  setTimeout(displayQuestion, 300);
}

// ── ANSWER ──
function handleAnswer(btn) {
  clearInterval(timerInterval);
  const chosen = btn.id;
  const isCorrect = chosen === currentQuestion.correct;

  lockOptions(isCorrect ? chosen : null);

  if (isCorrect) {
    score += 10;
    correctCount++;
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    scoreBadge.textContent = `${score} pts`;
    scoreBadge.classList.remove('pop');
    void scoreBadge.offsetWidth;
    scoreBadge.classList.add('pop');
    flashFeedback('✅');
  } else {
    wrongCount++;
    streak = 0;
    flashFeedback('❌');
    // show correct answer
    document.getElementById(currentQuestion.correct).classList.add('correct');
  }

  updateStreakBar();
  setTimeout(nextQuestion, 1100);
}

function lockOptions(correctId) {
  optionBtns.forEach(btn => {
    btn.disabled = true;
    if (btn.id === currentQuestion.correct) btn.classList.add('correct');
  });
}

// ── STREAK BAR ──
function updateStreakBar() {
  streakBar.innerHTML = '';
  for (let i = 0; i < streak; i++) {
    const dot = document.createElement('span');
    dot.className = 'streak-dot';
    streakBar.appendChild(dot);
  }
}

// ── FEEDBACK FLASH ──
function flashFeedback(emoji) {
  feedbackEl.textContent = emoji;
  feedbackEl.classList.remove('show');
  void feedbackEl.offsetWidth;
  feedbackEl.classList.add('show');
}

// ── FINISH ──
function finishQuiz() {
  clearInterval(timerInterval);

  // choose result messaging
  const pct = score / 100;
  let emoji, title, msg;
  if (pct === 1)        { emoji = '🏆'; title = 'Perfect Score!';    msg = 'Flawless. You got every single one right — that\'s elite!'; }
  else if (pct >= 0.8)  { emoji = '🎉'; title = 'Excellent!';        msg = 'That\'s a strong performance. Almost perfect!'; }
  else if (pct >= 0.6)  { emoji = '😎'; title = 'Good Job!';         msg = 'Solid round. A few slipped through — try again for the perfect score.'; }
  else if (pct >= 0.4)  { emoji = '🤔'; title = 'Not Bad!';          msg = 'Room to grow. Brush up and go again!'; }
  else                  { emoji = '😅'; title = 'Better luck next time!'; msg = 'Rough round! Every expert started somewhere — keep going.'; }

  resultEmoji.textContent  = emoji;
  resultTitle.textContent  = title;
  resultName.textContent   = `${nameInput.value}, here\'s how you did:`;
  resultMsg.textContent    = msg;
  rsCorrect.textContent    = correctCount;
  rsWrong.textContent      = wrongCount;
  rsStreak.textContent     = bestStreak;

  showScreen('result-screen');

  // animate final score counter
  animateCount(finalScore, 0, score, 900);

  // animate score ring
  const pctOffset = RING_CIRCUM_RESULT * (1 - score / 100);
  setTimeout(() => { srArc.style.strokeDashoffset = pctOffset; }, 200);

  // save to leaderboard
  saveScore(nameInput.value.trim(), score);
}

const RING_CIRCUM_RESULT = 314.16; // 2π × 50

function animateCount(el, from, to, duration) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * ease);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── START ──
function startQuiz() {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    nameInput.style.borderColor = '#f87171';
    nameInput.style.boxShadow   = '0 0 0 3px rgba(248,113,113,0.2)';
    setTimeout(() => {
      nameInput.style.borderColor = '';
      nameInput.style.boxShadow   = '';
    }, 1500);
    return;
  }

  // reset state
  quizPool       = shuffle(question_array).slice(0, TOTAL_Q);
  questionCount  = 0;
  score          = 0;
  correctCount   = 0;
  wrongCount     = 0;
  streak         = 0;
  bestStreak     = 0;

  scoreBadge.textContent = '0 pts';
  playerTag.textContent  = name;
  srArc.style.strokeDashoffset = RING_CIRCUM_RESULT;

  showScreen('quiz-screen');
  displayQuestion();
}

// ── LEADERBOARD ──
const LB_KEY = 'trivia_leaderboard';

function getScores() {
  try { return JSON.parse(localStorage.getItem(LB_KEY)) || []; }
  catch { return []; }
}

function saveScore(name, pts) {
  const scores = getScores();
  scores.push({ name, pts, date: new Date().toLocaleDateString() });
  scores.sort((a, b) => b.pts - a.pts);
  localStorage.setItem(LB_KEY, JSON.stringify(scores.slice(0, 10)));
}

function renderLeaderboard() {
  const scores = getScores();
  if (!scores.length) {
    lbList.innerHTML = '<p class="lb-empty">No scores yet. Be the first!</p>';
    return;
  }
  const medals = ['gold', 'silver', 'bronze'];
  lbList.innerHTML = scores.map((s, i) => `
    <div class="lb-entry">
      <span class="lb-rank ${medals[i] || ''}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
      <div class="lb-info">
        <div class="lb-name">${s.name}</div>
        <div class="lb-date">${s.date}</div>
      </div>
      <span class="lb-pts">${s.pts}</span>
    </div>
  `).join('');
}

function openLeaderboard() {
  renderLeaderboard();
  lbModal.classList.add('open');
}

// ── EVENT LISTENERS ──
startBtn.addEventListener('click', startQuiz);
nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') startQuiz(); });

optionBtns.forEach(btn => {
  btn.addEventListener('click', function () { handleAnswer(this); });
});

highScoreBtn.addEventListener('click', openLeaderboard);
leaderboardBtn.addEventListener('click', openLeaderboard);
lbClose.addEventListener('click', () => lbModal.classList.remove('open'));
lbModal.addEventListener('click', e => { if (e.target === lbModal) lbModal.classList.remove('open'); });

lbClear.addEventListener('click', () => {
  if (confirm('Clear all scores? This cannot be undone.')) {
    localStorage.removeItem(LB_KEY);
    renderLeaderboard();
  }
});

playAgainBtn.addEventListener('click', () => {
  showScreen('start-screen');
  nameInput.value = '';
});
