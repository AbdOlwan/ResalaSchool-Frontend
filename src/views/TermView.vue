<template>
  <v-container fluid class="pa-0 terms-adventure-page">
    <!-- Floating Background Elements -->
    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 15" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape rocket" v-for="n in 8" :key="'rocket-' + n">
        🚀
      </div>
      <div class="floating-shape book" v-for="n in 6" :key="'book-' + n">
        📚
      </div>
      <div class="floating-shape trophy" v-for="n in 5" :key="'trophy-' + n">
        🏆
      </div>
      <div class="floating-shape magic" v-for="n in 4" :key="'magic-' + n">
        ✨
      </div>
    </div>

    <!-- Hero Section with Animated Mascot -->
    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      height="480"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="8">
          <!-- Animated Learning Characters -->
          <div class="characters-container mb-6">
            <div class="character-group">
              <div
                class="main-character bounce-animation"
                @click="playWelcomeSound"
              >
                🎓
              </div>
              <div class="sidekick-left float-animation">🌟</div>
              <div class="sidekick-right pulse-animation">📖</div>
            </div>
            <div class="character-speech-bubble">
              <span class="speech-text">Choose Your Learning Term!</span>
              <div class="bubble-sparkles">✨🌈✨</div>
            </div>
          </div>

          <!-- Main Title with Dynamic Animation -->
          <h1 class="hero-title gradient-text mb-4">
            🌟 Select Your Term Adventure 🌟
          </h1>

          <!-- Engaging Subtitle -->
          <p class="hero-subtitle animate-fade-in mb-6">
            🎯 Each term brings new exciting challenges and knowledge!
            <br />🚀 Choose your term and unlock amazing learning experiences!
          </p>

          <!-- Learning Journey Progress -->
          <div class="journey-progress mb-4">
            <div class="progress-step completed">🏠 Home</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step completed">📚 Grade</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step current">📅 Term</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step">🎓 Learn</div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Main Content Container -->
    <v-container class="terms-container">
      <!-- Loading State with Fun Animation -->
      <v-row v-if="isLoading" justify="center" class="my-8">
        <v-col cols="12" class="text-center">
          <div class="loading-mascot">
            <div class="loading-character spin-animation">🎨</div>
            <h3 class="loading-text gradient-text">Preparing Your Terms...</h3>
            <div class="loading-dots">
              <span class="dot" v-for="n in 3" :key="n"></span>
            </div>
          </div>
        </v-col>
        <v-col v-for="n in 2" :key="n" cols="12" sm="6">
          <div class="loading-card">
            <v-skeleton-loader
              type="card, article"
              class="skeleton-animated"
            ></v-skeleton-loader>
            <div class="loading-sparkle">✨</div>
          </div>
        </v-col>
      </v-row>

      <!-- Error State with Friendly Character -->
      <v-row v-if="apiError" justify="center" class="my-8">
        <v-col cols="12" md="8">
          <div class="error-container">
            <div class="error-character shake-animation">😔</div>
            <div class="error-card">
              <h3 class="error-title">Oops! Something went wrong</h3>
              <p class="error-message">{{ apiError }}</p>
              <v-btn
                @click="fetchTerms"
                color="primary"
                size="large"
                class="retry-btn"
                prepend-icon="mdi-refresh"
              >
                Try Again! 🔄
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Terms Grid -->
      <v-row
        v-if="!isLoading && !apiError"
        justify="center"
        align="stretch"
        class="terms-grid"
      >
        <v-col
          v-for="(term, index) in terms"
          :key="term.id"
          cols="12"
          sm="6"
          md="6"
          lg="6"
          class="term-col"
        >
          <div
            class="term-card-wrapper"
            :style="{ '--animation-delay': `${index * 300}ms` }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 24 : 12"
                class="term-card"
                :class="[
                  `term-theme-${index % termThemes.length}`,
                  { 'term-card--hover': isHovering },
                ]"
                @click="navigateToTerm(term.id, term.name)"
              >
                <!-- Card Magical Glow Effect -->
                <div
                  class="card-magical-glow"
                  :class="`glow-${index % termThemes.length}`"
                ></div>

                <!-- Floating Magic Elements on Card -->
                <div class="card-magic-elements">
                  <div class="magic-element star1">⭐</div>
                  <div class="magic-element star2">🌟</div>
                  <div class="magic-element sparkle">✨</div>
                  <div class="magic-element gem">💎</div>
                </div>

                <!-- Card Header with Seasonal Theme -->
                <div
                  class="term-header"
                  :class="`header-${index % termThemes.length}`"
                >
                  <div class="term-icon-container">
                    <div class="term-main-icon bounce-hover">
                      {{ getIconForTerm(index) }}
                    </div>
                    <div class="icon-magical-ring"></div>
                    <div class="icon-particles">
                      <span class="particle" v-for="n in 8" :key="n">✨</span>
                    </div>
                  </div>

                  <!-- Season Badge -->
                  <div class="season-badge">
                    <div class="badge-icon">{{ getSeasonEmoji(index) }}</div>
                    <span class="badge-text">{{ getSeasonName(index) }}</span>
                  </div>
                </div>

                <!-- Card Content -->
                <v-card-title class="term-title">
                  {{ term.name }}
                </v-card-title>

                <v-card-text class="term-description">
                  <div class="description-text">
                    🎨 Discover amazing subjects and topics!
                    <br />🎯 Interactive lessons and fun activities await!
                  </div>

                  <!-- Term Features -->
                  <div class="features-showcase mt-3">
                    <div class="feature-highlight">
                      <span class="feature-icon">📖</span>
                      <span class="feature-label">Engaging Lessons</span>
                    </div>
                    <div class="feature-highlight">
                      <span class="feature-icon">🎮</span>
                      <span class="feature-label">Interactive Games</span>
                    </div>
                    <div class="feature-highlight">
                      <span class="feature-icon">🏆</span>
                      <span class="feature-label">Achievements</span>
                    </div>
                    <div class="feature-highlight">
                      <span class="feature-icon">🌟</span>
                      <span class="feature-label">Rewards</span>
                    </div>
                  </div>
                </v-card-text>

                <!-- Progress Visualization -->
                <div class="term-progress-section">
                  <div class="progress-label">
                    Ready to explore amazing content!
                  </div>
                  <div class="progress-visualization">
                    <div class="progress-orbs">
                      <div
                        class="progress-orb"
                        v-for="n in 5"
                        :key="n"
                        :class="{ active: n <= getProgressOrbs(index) }"
                      >
                        <span class="orb-icon">💫</span>
                      </div>
                    </div>
                    <div class="readiness-meter">
                      <div
                        class="meter-fill"
                        :style="{ width: getReadinessLevel(index) }"
                      >
                        <div class="meter-sparkle"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Button with Magic Effect -->
                <v-card-actions class="justify-center pa-4">
                  <v-btn
                    variant="elevated"
                    :color="getColorForTerm(index)"
                    class="adventure-btn"
                    size="large"
                    @mouseover="playHoverSound"
                    @click="addMagicEffect"
                  >
                    <span class="btn-text">Start Adventure!</span>
                    <v-icon end class="btn-icon">mdi-rocket-launch</v-icon>
                    <div class="btn-magic-trail"></div>
                  </v-btn>
                </v-card-actions>

                <!-- Hover Magic Effects -->
                <div v-if="isHovering" class="hover-magic-effects">
                  <div class="magic-particle" v-for="n in 12" :key="n"></div>
                </div>
              </v-card>
            </v-hover>
          </div>
        </v-col>
      </v-row>

      <!-- Motivation & Encouragement Section -->
      <v-row justify="center" class="mt-12 mb-8">
        <v-col cols="12" md="10" lg="8" class="text-center">
          <div class="motivation-section">
            <div class="motivation-characters">
              <div class="main-motivator pulse-animation">🌟</div>
              <div class="cheerleader-group">
                <span class="cheerleader cheerleader-1">🎉</span>
                <span class="cheerleader cheerleader-2">🎊</span>
                <span class="cheerleader cheerleader-3">🎁</span>
                <span class="cheerleader cheerleader-4">🎈</span>
              </div>
            </div>

            <h3 class="motivation-title gradient-text">
              You're Going to Shine Bright! ⭐
            </h3>

            <p class="motivation-text">
              Every learning adventure starts with choosing the right path. Pick
              your term above and embark on an incredible journey filled with
              knowledge, fun, and amazing discoveries!
            </p>

            <div class="encouragement-badges">
              <div
                class="encouragement-badge"
                v-for="(badge, idx) in encouragementBadges"
                :key="idx"
                :style="{ '--delay': `${idx * 0.2}s` }"
              >
                <div class="badge-emoji">{{ badge.emoji }}</div>
                <div class="badge-text">{{ badge.text }}</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Success Celebration Overlay -->
    <div v-if="showCelebration" class="celebration-overlay">
      <div class="celebration-content">
        <div class="celebration-character bounce-in">🎉</div>
        <h2 class="celebration-title">Amazing Choice!</h2>
        <p class="celebration-message">
          Get ready for an incredible learning journey filled with excitement,
          knowledge, and wonderful discoveries!
        </p>
        <div class="celebration-decorations">
          <span class="decoration" v-for="n in 6" :key="n">🌟</span>
        </div>
      </div>
      <div class="magical-confetti" v-for="n in 60" :key="n"></div>
    </div>

    <!-- Floating Success Messages -->
    <div class="success-messages">
      <div
        v-for="message in successMessages"
        :key="message.id"
        class="success-message"
        :style="message.style"
      >
        {{ message.text }} ✨
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiClient from "@/services/api.js";

// --- State Management ---
const terms = ref([]);
const isLoading = ref(true);
const apiError = ref(null);
const showCelebration = ref(false);
const successMessages = ref([]);
const router = useRouter();
const route = useRoute();

// --- Theme Data ---
const termThemes = [
  {
    color: "deep-orange-darken-2",
    icon: "🍂",
    season: "Autumn",
    seasonEmoji: "🍁",
    headerClass: "autumn-theme",
    glowColor: "#ff5722",
  },
  {
    color: "light-blue-darken-3",
    icon: "❄️",
    season: "Winter",
    seasonEmoji: "⛄",
    headerClass: "winter-theme",
    glowColor: "#0277bd",
  },
  {
    color: "green-darken-2",
    icon: "🌱",
    season: "Spring",
    seasonEmoji: "🌸",
    headerClass: "spring-theme",
    glowColor: "#388e3c",
  },
  {
    color: "amber-darken-2",
    icon: "☀️",
    season: "Summer",
    seasonEmoji: "🌞",
    headerClass: "summer-theme",
    glowColor: "#ffa000",
  },
];

const encouragementBadges = [
  { emoji: "🎨", text: "Creative Explorer" },
  { emoji: "🚀", text: "Knowledge Seeker" },
  { emoji: "⭐", text: "Bright Student" },
  { emoji: "🏆", text: "Learning Champion" },
  { emoji: "💎", text: "Brilliant Mind" },
  { emoji: "🌈", text: "Dream Achiever" },
];

// --- API Call ---
const fetchTerms = async () => {
  const gradeId = route.params.gradeId;
  if (!gradeId) {
    apiError.value =
      "Could not identify the grade. Please go back and try again.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    apiError.value = null;

    // Add some loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await apiClient.get(
      `/api/EducationalContent/grades/${gradeId}/terms`
    );

    if (response.data && response.data.success) {
      if (response.data.data.length > 0) {
        terms.value = response.data.data;
        playSuccessSound();
      } else {
        apiError.value =
          "No terms available for this grade yet. Check back soon!";
      }
    } else {
      throw new Error(response.data.message || "Failed to retrieve terms.");
    }
  } catch (error) {
    console.error("API Error fetching terms:", error);
    apiError.value =
      "We couldn't load the terms! Please check your connection and try again.";
    playErrorSound();
  } finally {
    isLoading.value = false;
  }
};

// --- Lifecycle Hook ---
onMounted(async () => {
  await fetchTerms();
  await nextTick();
  animateTermCards();
});

// --- Animation Functions ---
const animateTermCards = () => {
  const cards = document.querySelectorAll(".term-card-wrapper");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("animate-in");
    }, index * 300);
  });
};

// --- Navigation ---
const navigateToTerm = async (termId, termName) => {
  playClickSound();
  showSuccessMessage("Perfect Choice! 🌟");

  // Show celebration
  showCelebration.value = true;

  // Navigate after celebration
  setTimeout(() => {
    showCelebration.value = false;
    console.log(`Navigating to Term ID: ${termId} (${termName})`);
    router.push({
      name: "Courses",
      params: { gradeId: route.params.gradeId, termId },
    });
  }, 2800);
};

// --- UI Helper Functions ---
const getIconForTerm = (index) => termThemes[index % termThemes.length].icon;
const getColorForTerm = (index) => termThemes[index % termThemes.length].color;
const getSeasonEmoji = (index) =>
  termThemes[index % termThemes.length].seasonEmoji;
const getSeasonName = (index) => termThemes[index % termThemes.length].season;

const getProgressOrbs = (index) => {
  const orbCounts = [4, 5, 3, 4, 5];
  return orbCounts[index % orbCounts.length];
};

const getReadinessLevel = (index) => {
  const levels = ["88%", "95%", "82%", "90%", "96%"];
  return levels[index % levels.length];
};

// --- Sound Effects ---
const playWelcomeSound = () => playSound("welcome");
const playHoverSound = () => playSound("hover");
const playClickSound = () => playSound("click");
const playSuccessSound = () => playSound("success");
const playErrorSound = () => playSound("error");

const playSound = (type) => {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    switch (type) {
      case "welcome":
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(
          880,
          audioContext.currentTime + 0.3
        );
        break;
      case "hover":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        break;
      case "click":
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case "success":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(
          1046.5,
          audioContext.currentTime + 0.4
        );
        break;
      case "error":
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        break;
    }

    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioContext.currentTime + 0.5
    );
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log("Audio not supported");
  }
};

// --- Interactive Effects ---
const addMagicEffect = (event) => {
  const button = event.currentTarget;
  const magic = document.createElement("div");
  magic.className = "magic-burst";
  magic.innerHTML = "✨🌟✨";
  button.appendChild(magic);
  setTimeout(() => magic.remove(), 1000);
};

// --- Success Messages ---
const showSuccessMessage = (text) => {
  const message = {
    id: Date.now(),
    text,
    style: {
      left: Math.random() * 80 + 10 + "%",
      top: Math.random() * 60 + 20 + "%",
    },
  };

  successMessages.value.push(message);

  setTimeout(() => {
    const index = successMessages.value.findIndex((m) => m.id === message.id);
    if (index > -1) successMessages.value.splice(index, 1);
  }, 3000);
};
</script>

<style scoped>
/* --- Base Styles --- */
.terms-adventure-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: "Comic Neue", cursive;
}

/* --- Floating Background Elements --- */
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  font-size: clamp(1.5rem, 2.5vw, 2.5rem);
  animation: float-magic 25s ease-in-out infinite;
  opacity: 0.6;
}

/* Magical floating patterns */
.floating-shape.star:nth-child(1) {
  top: 5%;
  left: 8%;
  animation-delay: 0s;
}
.floating-shape.star:nth-child(2) {
  top: 15%;
  right: 12%;
  animation-delay: -3s;
}
.floating-shape.star:nth-child(3) {
  top: 45%;
  left: 5%;
  animation-delay: -6s;
}
.floating-shape.rocket:nth-child(1) {
  top: 25%;
  left: 15%;
  animation-delay: -2s;
}
.floating-shape.rocket:nth-child(2) {
  bottom: 30%;
  right: 20%;
  animation-delay: -8s;
}
.floating-shape.book:nth-child(1) {
  top: 60%;
  right: 8%;
  animation-delay: -4s;
}
.floating-shape.trophy:nth-child(1) {
  bottom: 15%;
  left: 25%;
  animation-delay: -7s;
}
.floating-shape.magic:nth-child(1) {
  bottom: 5%;
  left: 5%;
  animation-delay: -10s;
}

@keyframes float-magic {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(20vw, -15vh) rotate(90deg) scale(1.2);
  }
  50% {
    transform: translate(15vw, -25vh) rotate(180deg) scale(0.8);
  }
  75% {
    transform: translate(-15vw, -20vh) rotate(270deg) scale(1.1);
  }
}

/* --- Hero Section --- */
.hero-section {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.95) 0%,
    rgba(118, 75, 162, 0.95) 50%,
    rgba(240, 147, 251, 0.95) 100%
  );
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    repeat;
}

/* --- Characters Section --- */
.characters-container {
  position: relative;
  z-index: 2;
}

.character-group {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.main-character {
  font-size: 6rem;
  cursor: pointer;
  display: inline-block;
  filter: drop-shadow(0 12px 25px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
  position: relative;
  z-index: 3;
}

.main-character:hover {
  transform: scale(1.15);
}

.sidekick-left,
.sidekick-right {
  position: absolute;
  font-size: 3rem;
  filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.2));
}

.sidekick-left {
  top: 20%;
  left: -60px;
  animation-delay: -1s;
}

.sidekick-right {
  top: 20%;
  right: -60px;
  animation-delay: -2s;
}

.bounce-animation {
  animation: character-bounce 3s ease-in-out infinite;
}

.float-animation {
  animation: character-float 4s ease-in-out infinite;
}

.pulse-animation {
  animation: character-pulse 2s ease-in-out infinite;
}

@keyframes character-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-25px);
  }
  60% {
    transform: translateY(-12px);
  }
}

@keyframes character-float {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

@keyframes character-pulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(10deg);
  }
}

.character-speech-bubble {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.98);
  padding: 15px 25px;
  border-radius: 30px;
  border: 4px solid #ffd700;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: bubble-dance 4s ease-in-out infinite;
  min-width: 220px;
  text-align: center;
}

.character-speech-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 15px solid transparent;
  border-top-color: #ffd700;
}

.bubble-sparkles {
  position: absolute;
  top: -8px;
  right: -8px;
  animation: sparkle-dance 2s linear infinite;
}

@keyframes bubble-dance {
  0%,
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  50% {
    opacity: 0.95;
    transform: translateX(-50%) translateY(-10px) scale(1.02);
  }
}

@keyframes sparkle-dance {
  from {
    transform: rotate(0deg) scale(1);
  }
  to {
    transform: rotate(360deg) scale(1.2);
  }
}

/* --- Typography --- */
.hero-title {
  font-size: clamp(2.5rem, 5vw, 4.2rem);
  font-weight: 800;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
  line-height: 1.2;
  position: relative;
  z-index: 2;
}

.gradient-text {
  background: linear-gradient(
    45deg,
    #ffd700,
    #ff6b6b,
    #4ecdc4,
    #45b7d1,
    #ff9ff3
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-magic 5s ease-in-out infinite;
}

@keyframes gradient-magic {
  0%,
  100% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 50% 100%;
  }
  75% {
    background-position: 50% 0%;
  }
}

.hero-subtitle {
  font-size: clamp(1.2rem, 2.5vw, 1.9rem);
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
  line-height: 1.5;
  z-index: 2;
  position: relative;
}

.animate-fade-in {
  animation: magical-fade-in 1.2s ease-out 0.5s both;
}

@keyframes magical-fade-in {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* --- Learning Journey Progress --- */
.journey-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(5px);
  padding: 12px 24px;
  border-radius: 50px;
  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.2),
    0 8px 30px rgba(0, 0, 0, 0.2);
}

.progress-step {
  font-weight: bold;
  color: #fff;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.progress-step.completed {
  color: #c8e6c9;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.progress-step.current {
  color: #ffd700;
  text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
  animation: pulse-glow 2s infinite;
}

.progress-arrow {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
}

@keyframes pulse-glow {
  0%,
  100% {
    text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
  }
  50% {
    text-shadow: 0 0 20px #ffd700, 0 0 40px #ffd700;
  }
}

/* --- Main Content Container --- */
.terms-container {
  position: relative;
  z-index: 5;
  margin-top: -60px;
  padding-bottom: 80px;
}

/* --- Loading State --- */
.loading-mascot {
  padding: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.loading-character {
  font-size: 5rem;
  animation: spin-animation 3s linear infinite;
}

.loading-text {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 10px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 50%;
  margin: 0 5px;
  animation: dot-flicker 1.5s infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}
.dot:nth-child(2) {
  animation-delay: 0.5s;
}
.dot:nth-child(3) {
  animation-delay: 1s;
}

@keyframes dot-flicker {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.loading-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.loading-sparkle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 4rem;
  transform: translate(-50%, -50%);
  animation: spin-animation 4s linear infinite;
  opacity: 0.2;
}

.v-skeleton-loader {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.v-skeleton-loader .v-skeleton-loader__bone {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

/* --- Error State --- */
.error-container {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.error-character {
  font-size: 5rem;
  animation: shake-animation 0.5s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes shake-animation {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

.error-card {
  margin-top: 20px;
}

.error-title {
  font-size: 2rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.error-message {
  font-size: 1.1rem;
  color: #fce4ec;
  margin-top: 10px;
  margin-bottom: 20px;
}

.retry-btn {
  font-weight: bold;
  letter-spacing: 1px;
}

/* --- Terms Grid & Cards --- */
.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.term-col {
  display: flex;
}

.term-card-wrapper {
  width: 100%;
  opacity: 0;
  transform: translateY(50px) scale(0.8);
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 0.8s ease-in-out;
}

.term-card-wrapper.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.term-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.term-card--hover {
  transform: translateY(-10px) scale(1.03) rotate(-2deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 30px var(--hover-color, #ffd700) !important;
}

.card-magical-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: 24px;
  background: var(--glow-color, #ffd700);
  filter: blur(30px);
  opacity: 0.5;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.term-card:not(.term-card--hover) .card-magical-glow {
  opacity: 0;
}

/* Card Magic Elements */
.card-magic-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.term-card--hover .card-magic-elements {
  opacity: 1;
}

.magic-element {
  position: absolute;
  font-size: 2rem;
  animation: card-float 5s linear infinite;
}

.magic-element.star1 {
  top: 10%;
  left: 15%;
  animation-delay: -1s;
}
.magic-element.star2 {
  top: 30%;
  right: 10%;
  animation-delay: -2s;
}
.magic-element.sparkle {
  bottom: 20%;
  left: 25%;
  animation-delay: -3s;
}
.magic-element.gem {
  bottom: 15%;
  right: 20%;
  animation-delay: -4s;
}

@keyframes card-float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(5px, 10px) rotate(15deg);
  }
}

/* Card Header & Themes */
.term-header {
  position: relative;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
}

.term-theme-0 .term-header {
  background: linear-gradient(135deg, #ff8a65, #ff5722);
}
.term-theme-1 .term-header {
  background: linear-gradient(135deg, #4fc3f7, #0277bd);
}
.term-theme-2 .term-header {
  background: linear-gradient(135deg, #81c784, #388e3c);
}
.term-theme-3 .term-header {
  background: linear-gradient(135deg, #ffca28, #ffa000);
}

.glow-0 {
  --glow-color: #ff5722;
}
.glow-1 {
  --glow-color: #0277bd;
}
.glow-2 {
  --glow-color: #388e3c;
}
.glow-3 {
  --glow-color: #ffa000;
}

.term-icon-container {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.term-main-icon {
  font-size: 4rem;
  transition: transform 0.3s ease;
  z-index: 2;
}

.bounce-hover:hover {
  animation: icon-bounce 0.8s ease-in-out infinite;
}

@keyframes icon-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.icon-magical-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.4);
  transform: translate(-50%, -50%) scale(0);
  animation: ring-pulse 2s infinite;
  z-index: 1;
}

@keyframes ring-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.icon-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.particle {
  position: absolute;
  font-size: 1rem;
  animation: particle-fly 3s linear infinite;
}

.particle:nth-child(1) {
  top: -20px;
  left: -20px;
  animation-delay: 0s;
}
.particle:nth-child(2) {
  top: -30px;
  left: 10px;
  animation-delay: -0.5s;
}
.particle:nth-child(3) {
  top: -10px;
  right: -30px;
  animation-delay: -1s;
}
.particle:nth-child(4) {
  top: 20px;
  right: -20px;
  animation-delay: -1.5s;
}

@keyframes particle-fly {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x, 50px), var(--y, 50px)) scale(0.5);
    opacity: 0;
  }
}

.season-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.badge-icon {
  font-size: 1.2rem;
}

/* Card Content */
.term-title {
  text-align: center;
  font-weight: 800;
  font-size: 1.8rem !important;
  color: #fff;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  padding-top: 20px !important;
  line-height: 1.2;
}

.term-description {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  padding: 16px;
  font-size: 1rem;
}

.description-text {
  margin-bottom: 12px;
}

.features-showcase {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.feature-highlight {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
}

.feature-icon {
  font-size: 1rem;
}

/* Progress Visualization */
.term-progress-section {
  padding: 16px;
  text-align: center;
}

.progress-label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  margin-bottom: 8px;
}

.progress-visualization {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.progress-orbs {
  display: flex;
  gap: 6px;
}

.progress-orb {
  width: 20px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.5s ease;
}

.progress-orb.active {
  background-color: #ffd700;
  animation: orb-glow 1s infinite alternate;
}

.progress-orb.active .orb-icon {
  animation: orb-spin 2s linear infinite;
}

@keyframes orb-glow {
  from {
    box-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700;
  }
  to {
    box-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
  }
}

@keyframes orb-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.orb-icon {
  font-size: 0.8rem;
  opacity: 0.8;
}

.readiness-meter {
  width: 80%;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.meter-fill {
  height: 100%;
  background-color: #ff9ff3;
  transition: width 1.5s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
}

.meter-sparkle {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
  animation: sparkle-shine 2s infinite;
}

@keyframes sparkle-shine {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

/* Action Button */
.adventure-btn {
  font-weight: bold !important;
  text-transform: uppercase !important;
  letter-spacing: 1.5px !important;
  font-size: 1rem !important;
  border-radius: 50px !important;
  position: relative;
  overflow: hidden;
  padding: 0 30px !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.adventure-btn:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-icon {
  z-index: 2;
  transition: transform 0.3s ease;
}

.adventure-btn:hover .btn-icon {
  transform: translateX(5px);
}

.btn-magic-trail {
  position: absolute;
  width: 10px;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  filter: blur(5px);
  animation: magic-trail-anim 1s ease-out;
  left: -20px;
  transform: scaleY(0);
}

@keyframes magic-trail-anim {
  0% {
    transform: scaleY(0);
  }
  50% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0);
  }
}

/* Hover Magic Effects */
.hover-magic-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.magic-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #fff, transparent);
  border-radius: 50%;
  animation: sparkle-float 1s ease-out forwards;
}

@keyframes sparkle-float {
  from {
    transform: translate(var(--x), var(--y));
    opacity: 1;
    filter: blur(0);
  }
  to {
    transform: translate(var(--x-end), var(--y-end));
    opacity: 0;
    filter: blur(5px);
  }
}

/* --- Motivation Section --- */
.motivation-section {
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
}

.motivation-characters {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

.main-motivator {
  font-size: 4rem;
  animation: pulse-animation 2s infinite;
}

.cheerleader-group {
  display: flex;
  gap: 5px;
  margin-left: 10px;
}

.cheerleader {
  font-size: 2rem;
  animation: cheerleader-jump 1s ease-in-out infinite;
  transform-origin: bottom;
}

.cheerleader-1 {
  animation-delay: 0s;
}
.cheerleader-2 {
  animation-delay: 0.2s;
}
.cheerleader-3 {
  animation-delay: 0.4s;
}
.cheerleader-4 {
  animation-delay: 0.6s;
}

@keyframes cheerleader-jump {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px) scale(1.1);
  }
}

.motivation-title {
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: 800;
  margin-top: 20px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
}

.motivation-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 15px;
  line-height: 1.6;
}

.encouragement-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.encouragement-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(20px) scale(0.8);
  opacity: 0;
  animation: badge-pop-in 0.6s ease-out forwards;
}

@keyframes badge-pop-in {
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.badge-emoji {
  font-size: 2.5rem;
}

.badge-text {
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* --- Success Celebration Overlay --- */
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(118, 75, 162, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  animation: overlay-fade-in 0.5s ease-out;
}

@keyframes overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.celebration-content {
  text-align: center;
  animation: content-scale-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes content-scale-in {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.celebration-character {
  font-size: 8rem;
  animation: bounce-in 1s cubic-bezier(0.2, 0.8, 0.4, 1.2) both;
}

.celebration-title {
  font-size: 3.5rem;
  font-weight: bold;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
  margin-top: 20px;
}

.celebration-message {
  font-size: 1.5rem;
  margin-top: 10px;
  max-width: 600px;
  line-height: 1.5;
}

.celebration-decorations {
  margin-top: 20px;
}

.decoration {
  font-size: 2rem;
  margin: 0 10px;
  animation: spin-and-fade 2s ease-out infinite;
}

.magical-confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #ffcc00;
  border-radius: 50%;
  top: 0;
  animation: confetti-fall 3s ease-in forwards;
  opacity: 0.8;
}

.magical-confetti:nth-child(2n) {
  background: #ff6b6b;
  width: 8px;
  height: 8px;
  border-radius: 0;
}
.magical-confetti:nth-child(3n) {
  background: #4ecdc4;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.magical-confetti:nth-child(4n) {
  background: #ff9ff3;
  width: 10px;
  height: 5px;
  transform: rotate(45deg);
}

@keyframes confetti-fall {
  0% {
    transform: translate(var(--x), -20vh) rotate(var(--deg));
    opacity: 1;
  }
  100% {
    transform: translate(var(--x-end), 120vh) rotate(var(--deg-end));
    opacity: 0;
  }
}

/* --- Floating Success Messages --- */
.success-messages {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 99;
}

.success-message {
  position: absolute;
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  animation: message-float 3s ease-out forwards;
}

@keyframes message-float {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  20% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
  80% {
    transform: translateY(-80px) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1.2);
    opacity: 0;
  }
}

/* --- Responsive Design --- */
@media (max-width: 600px) {
  .hero-section {
    height: auto;
    padding: 80px 20px;
  }

  .character-speech-bubble {
    top: -20px;
  }

  .journey-progress {
    gap: 10px;
    padding: 8px 16px;
  }

  .progress-step {
    font-size: 0.9rem;
  }

  .terms-grid {
    grid-template-columns: 1fr;
  }

  .motivation-section {
    padding: 30px 15px;
  }

  .motivation-characters {
    top: -20px;
  }

  .main-motivator {
    font-size: 3rem;
  }
}
</style>
