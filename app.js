/**
 * לוגיקת המשחק: חידון המוזיקה הישראלית מכל הזמנים 🎵🇮🇱
 * כולל הקראה קולית חיה בעברית (Web Speech API), ניהול ניקוד, צלילים וקונפטי
 */

// --- מנוע הקראה קולית בעברית (Web Speech API) ---
class SpeechVoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
    this.hebrewVoice = null;
    this.loadVoices();

    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // חיפוש קול בעברית
    this.hebrewVoice = voices.find(v => v.lang && (v.lang.includes('he') || v.lang.includes('HE') || v.lang.includes('IL')));
  }

  speak(text, onStart, onEnd) {
    if (!this.synth) {
      alert('דפדפן זה אינו תומך בהקראה קולית. השורה מוצגת על המסך!');
      return;
    }

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const cleanText = text.replace(/[\n\r]+/g, ' ').replace(/\.{2,}/g, '.');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'he-IL';
    if (this.hebrewVoice) {
      utter.voice = this.hebrewVoice;
    }
    utter.rate = 0.88; // מהירות נוחה וברורה
    utter.pitch = 1.0;

    utter.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utter.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utter.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.synth.speak(utter);
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }
}

const voiceEngine = new SpeechVoiceEngine();

// --- מנוע צלילים נעימים ---
class MusicSoundManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playChime() {
    try {
      this.init();
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = this.ctx.currentTime + idx * 0.07;
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {}
  }

  playVictory() {
    try {
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const start = this.ctx.currentTime + idx * 0.12;
        gain.gain.setValueAtTime(0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    } catch (e) {}
  }
}

const sounds = new MusicSoundManager();

// --- מנוע קונפטי רציף ---
class MusicConfetti {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 80) {
    const colors = ['#f43f5e', '#7c3aed', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#f97316'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 280,
        y: this.canvas.height / 3 + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 1) * 16 - 3,
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 9,
        life: 1
      });
    }
    if (!this.animId) {
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.44;
      p.rotation += p.rotSpeed;
      p.life -= 0.009;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();

      if (p.life <= 0 || p.y > this.canvas.height + 40) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
    }
  }
}

// --- ניהול מצב המשחק (State) ---
const STORAGE_KEY = 'israeli_music_quiz_state_v1';

let gameState = {
  shellyScore: 0,
  momScore: 0,
  activeDecade: 'all',
  currentDeck: [],
  currentIndex: 0,
  gameLimit: 15
};

let confetti = null;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed.shellyScore === 'number' && typeof parsed.momScore === 'number') {
        gameState.shellyScore = parsed.shellyScore;
        gameState.momScore = parsed.momScore;
        if (parsed.activeDecade) gameState.activeDecade = parsed.activeDecade;
      }
    } catch (e) {}
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    shellyScore: gameState.shellyScore,
    momScore: gameState.momScore,
    activeDecade: gameState.activeDecade
  }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initMusicDeck() {
  let list = ISRAELI_SONGS;
  if (gameState.activeDecade !== 'all') {
    list = ISRAELI_SONGS.filter(s => s.decade === gameState.activeDecade);
  }
  gameState.currentDeck = shuffle(list);
  gameState.currentIndex = 0;
}

// --- אתחול היישום ---
window.addEventListener('DOMContentLoaded', () => {
  loadState();

  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    confetti = new MusicConfetti(canvas);
  }

  initMusicDeck();
  setupEventListeners();
  renderScores();
  renderSongCard();
  updateDecadeButtonsUI();
});

function setupEventListeners() {
  // כפתור השמעה קולית חיה
  const btnSpeech = document.getElementById('btnSpeechTrigger');
  btnSpeech.addEventListener('click', () => {
    const currentSong = gameState.currentDeck[gameState.currentIndex];
    if (!currentSong) return;

    btnSpeech.classList.add('speaking');
    btnSpeech.innerHTML = '🔊 מקריא עכשיו... האזינו!';

    voiceEngine.speak(
      currentSong.line,
      null,
      () => {
        btnSpeech.classList.remove('speaking');
        btnSpeech.innerHTML = '🔊 השמע משפט מהשיר שוב';
      }
    );
  });

  // כפתור חשיפת התשובה
  document.getElementById('btnRevealSong').addEventListener('click', () => {
    sounds.playPop();
    voiceEngine.stop();
    document.getElementById('revealedSongBox').style.display = 'block';
    document.getElementById('btnRevealSong').style.display = 'none';
    document.getElementById('scoringGridWrapper').style.display = 'flex';
  });

  // חלוקת נקודות
  document.getElementById('btnScoreShelly').addEventListener('click', () => handleScore('shelly'));
  document.getElementById('btnScoreMom').addEventListener('click', () => handleScore('mom'));
  document.getElementById('btnScoreBoth').addEventListener('click', () => handleScore('both'));
  document.getElementById('btnScoreNone').addEventListener('click', () => handleScore('none'));

  // כפתור סיום והכתרת מנצחת
  document.getElementById('btnFinishShow').addEventListener('click', () => {
    voiceEngine.stop();
    showVictoryScreen();
  });

  // כפתור משחק חוזר
  document.getElementById('btnRematch').addEventListener('click', () => {
    document.getElementById('victoryOverlay').style.display = 'none';
    gameState.shellyScore = 0;
    gameState.momScore = 0;
    saveState();
    renderScores();
    initMusicDeck();
    renderSongCard();
    sounds.playPop();
  });

  // סינון עשורים
  document.querySelectorAll('.decade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      voiceEngine.stop();
      gameState.activeDecade = btn.dataset.decade;
      saveState();
      updateDecadeButtonsUI();
      initMusicDeck();
      renderSongCard();
      sounds.playPop();
    });
  });
}

function updateDecadeButtonsUI() {
  document.querySelectorAll('.decade-btn').forEach(btn => {
    if (btn.dataset.decade === gameState.activeDecade) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function renderScores() {
  document.getElementById('scoreShelly').textContent = gameState.shellyScore;
  document.getElementById('scoreMom').textContent = gameState.momScore;
}

function renderSongCard() {
  const totalInGame = Math.min(gameState.gameLimit, gameState.currentDeck.length);

  if (gameState.currentIndex >= totalInGame) {
    showVictoryScreen();
    return;
  }

  const s = gameState.currentDeck[gameState.currentIndex];
  if (!s) {
    showVictoryScreen();
    return;
  }

  document.getElementById('decadeTagChip').textContent = s.decadeName;
  document.getElementById('lyricsQuoteText').textContent = `"${s.line}"`;

  if (s.clue) {
    document.getElementById('hintPill').textContent = `💡 רמז: ${s.clue}`;
    document.getElementById('hintPill').style.display = 'inline-block';
  } else {
    document.getElementById('hintPill').style.display = 'none';
  }

  document.getElementById('revealedSongTitle').textContent = `שם השיר: ${s.songName}`;
  document.getElementById('revealedArtistName').textContent = `ביצוע מקורי: ${s.artist}`;

  // איפוס לחצנים
  const btnSpeech = document.getElementById('btnSpeechTrigger');
  btnSpeech.classList.remove('speaking');
  btnSpeech.innerHTML = '🔊 השמע את המשפט בקול רם!';

  document.getElementById('revealedSongBox').style.display = 'none';
  document.getElementById('btnRevealSong').style.display = 'inline-flex';
  document.getElementById('scoringGridWrapper').style.display = 'none';

  // מונה שירים
  document.getElementById('roundCounter').textContent = `שיר ${gameState.currentIndex + 1} מתוך ${totalInGame}`;
}

function handleScore(who) {
  voiceEngine.stop();

  if (who === 'shelly') {
    gameState.shellyScore++;
    sounds.playChime();
    if (confetti) confetti.burst(40);
  } else if (who === 'mom') {
    gameState.momScore++;
    sounds.playChime();
    if (confetti) confetti.burst(40);
  } else if (who === 'both') {
    gameState.shellyScore++;
    gameState.momScore++;
    sounds.playChime();
    if (confetti) confetti.burst(60);
  } else {
    sounds.playPop();
  }

  saveState();
  renderScores();

  gameState.currentIndex++;
  renderSongCard();
}

// --- מסך סיום חגיגי ---
function showVictoryScreen() {
  sounds.playVictory();
  if (confetti) confetti.burst(150);

  const overlay = document.getElementById('victoryOverlay');
  overlay.style.display = 'flex';

  const s = gameState.shellyScore;
  const m = gameState.momScore;

  document.getElementById('vicShellyScore').textContent = `${s} נק׳`;
  document.getElementById('vicMomScore').textContent = `${m} נק׳`;

  const heading = document.getElementById('vicWinnerHeading');
  const task = document.getElementById('vicTaskBanner');

  const tasks = [
    '🎤 משימת המפסידה: לשיר פזמון שלם של שלמה ארצי או חנן בן ארי בקול רם!',
    '☕ משימת המפסידה: להכין למנצחת שתייה מפנקת בליווי שיר ברקע!',
    '💃 משימת המפסידה: לרקוד את הדאנס-ברייק של יוניקורן (נועה קירל)!',
    '👑 משימת המפסידה: להכריז בקול 3 פעמים: "היא מלכת הפלייליסט הישראלי!"'
  ];
  const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

  if (s > m) {
    heading.textContent = '👑 שלי היא מלכת המוזיקה הישראלית!';
    task.textContent = randomTask;
  } else if (m > s) {
    heading.textContent = '👑 אמא הוכיחה מי שולטת בפסקול של המדינה!';
    task.textContent = randomTask;
  } else {
    heading.textContent = '👯‍♀️ תיקו מוזיקלי מושלם! שתיכן שולטות בפלייליסט!';
    task.textContent = '🎶 חגיגת שוויון: שתיכן בוחרות יחד שיר ישראלי אהוב ושרות אותו ביחד בסלון!';
  }
}
