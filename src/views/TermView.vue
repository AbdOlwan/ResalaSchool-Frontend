<template>
  <v-container fluid class="pa-0 terms-adventure-page">
    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 8" :key="'star-' + n">
        ⭐
      </div>
    </div>

    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      height="400"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="8">
          <div class="characters-container mb-6">
            <div class="character-group">
              <div
                class="main-character interactive-bounce"
                @click="playWelcomeSound"
              >
                🎓
              </div>
            </div>
          </div>

          <h1 class="hero-title mb-4">Select Your Term Adventure</h1>

          <p class="hero-subtitle mb-6">
            Each term brings new exciting challenges and knowledge!
            <br />Choose your term and unlock amazing learning experiences!
          </p>

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

    <v-container class="terms-container">
      <v-row v-if="isLoading" justify="center" class="my-8">
        <v-col cols="12" class="text-center">
          <div class="loading-mascot">
            <div class="loading-character">🎨</div>
            <h3 class="loading-text">Preparing Your Terms...</h3>
          </div>
        </v-col>
        <v-col v-for="n in 2" :key="n" cols="12" sm="6">
          <v-skeleton-loader
            type="card, article"
            class="skeleton-loader"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <v-row v-if="apiError" justify="center" class="my-8">
        <v-col cols="12" md="8">
          <div class="error-container">
            <div class="error-character">😔</div>
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
                Try Again!
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

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
          class="term-col"
        >
          <div
            class="term-card-wrapper"
            :style="{ '--animation-delay': `${index * 150}ms` }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 16 : 8"
                class="term-card"
                :class="{ 'term-card--hover': isHovering }"
                @click="navigateToTerm(term.id, term.name)"
              >
                <div
                  class="term-header"
                  :class="`header-theme-${index % termThemes.length}`"
                >
                  <div class="term-icon-container">
                    <div class="term-main-icon">
                      {{ getIconForTerm(index) }}
                    </div>
                  </div>
                  <div class="season-badge">
                    <div class="badge-icon">{{ getSeasonEmoji(index) }}</div>
                    <span class="badge-text">{{ getSeasonName(index) }}</span>
                  </div>
                </div>

                <v-card-title class="term-title">
                  {{ term.name }}
                </v-card-title>

                <v-card-text class="term-description">
                  <div class="description-text">
                    Discover amazing subjects and topics! Interactive lessons
                    and fun activities await!
                  </div>
                  <div class="features-showcase mt-3">
                    <div class="feature-highlight">
                      <span class="feature-icon">📖</span>
                      <span class="feature-label">Lessons</span>
                    </div>
                    <div class="feature-highlight">
                      <span class="feature-icon">🎮</span>
                      <span class="feature-label">Games</span>
                    </div>
                    <div class="feature-highlight">
                      <span class="feature-icon">🏆</span>
                      <span class="feature-label">Achievements</span>
                    </div>
                  </div>
                </v-card-text>

                <v-card-actions class="justify-center pa-4 mt-auto">
                  <v-btn
                    variant="elevated"
                    :color="getColorForTerm(index)"
                    class="adventure-btn"
                    size="large"
                    @mouseover="playHoverSound"
                  >
                    <span class="btn-text">Start Adventure</span>
                    <v-icon end class="btn-icon">mdi-rocket-launch</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-hover>
          </div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-12 mb-8">
        <v-col cols="12" md="10" lg="8" class="text-center">
          <div class="motivation-section">
            <div class="motivation-character interactive-pulse">🌟</div>
            <h3 class="motivation-title">You're Going to Shine Bright!</h3>
            <p class="motivation-text">
              Every learning adventure starts with choosing the right path. Pick
              your term above and embark on an incredible journey!
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div v-if="showCelebration" class="celebration-overlay">
      <div class="celebration-content">
        <div class="celebration-character">🚀</div>
        <h2 class="celebration-title">Let's Go!</h2>
        <p class="celebration-message">Getting your next adventure ready...</p>
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
const showCelebration = ref(false); // Used only for loading next page, not for artificial delays
const router = useRouter();
const route = useRoute();

// --- Global Mute State (Assumed from Pinia/Vuex) ---
// In a real app, this would be imported from a store, e.g., `import { useAudioStore } from '@/stores/audio';`
// const audioStore = useAudioStore();
// const { isMuted } = storeToRefs(audioStore);
const isMuted = ref(false); // For demonstration purposes, assuming it's a reactive ref.

// --- Theme Data ---
const termThemes = [
  {
    color: "deep-orange-darken-2",
    icon: "🍂",
    season: "Autumn",
    seasonEmoji: "🍁",
  },
  {
    color: "light-blue-darken-3",
    icon: "❄️",
    season: "Winter",
    seasonEmoji: "⛄",
  },
  {
    color: "green-darken-2",
    icon: "🌱",
    season: "Spring",
    seasonEmoji: "🌸",
  },
  {
    color: "amber-darken-2",
    icon: "☀️",
    season: "Summer",
    seasonEmoji: "🌞",
  },
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

    // Artificial delay removed for faster loading perception.
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
  // Animate cards after they are rendered
  await nextTick();
  animateTermCards();
});

// --- Animation Functions ---
const animateTermCards = () => {
  const cards = document.querySelectorAll(".term-card-wrapper");
  cards.forEach((card) => {
    card.classList.add("animate-in");
  });
};

// --- Navigation ---
const navigateToTerm = (termId, termName) => {
  playClickSound();

  // CRITICAL CHANGE: Immediate navigation. No more setTimeout delay.
  // The 'showCelebration' overlay is removed from this flow because navigation is instant.
  // It should only be used if there's a data-fetching step on the *next* page
  // that this overlay can mask. For this component's responsibility, navigation is direct.
  console.log(`Navigating instantly to Term ID: ${termId} (${termName})`);
  router.push({
    name: "Courses",
    params: { gradeId: route.params.gradeId, termId },
  });
};

// --- UI Helper Functions ---
const getIconForTerm = (index) => termThemes[index % termThemes.length].icon;
const getColorForTerm = (index) => termThemes[index % termThemes.length].color;
const getSeasonEmoji = (index) =>
  termThemes[index % termThemes.length].seasonEmoji;
const getSeasonName = (index) => termThemes[index % termThemes.length].season;

// --- Sound Effects ---
const playWelcomeSound = () => playSound("welcome");
const playHoverSound = () => playSound("hover");
const playClickSound = () => playSound("click");
const playSuccessSound = () => playSound("success");
const playErrorSound = () => playSound("error");

const playSound = (type) => {
  // NEW LOGIC: Check the global mute state before playing any sound.
  if (isMuted.value) {
    return;
  }

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
</script>

<style scoped>
/* --- Font Imports --- */
@import url("https://fonts.googleapis.com/css2?family=Bungee&family=Cairo:wght@400;600;800&display=swap");

/* --- Base Styles --- */
.terms-adventure-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  /* FONT CHANGE: Primary font is now Cairo */
  font-family: "Cairo", sans-serif;
}

/* --- Floating Background Elements (Simplified) --- */
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-shape {
  position: absolute;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  /* ANIMATION CHANGE: Slower, less obtrusive animation */
  animation: float-around 40s ease-in-out infinite;
  opacity: 0.15;
}

/* Distribute elements randomly */
.floating-shape:nth-child(1) {
  top: 10%;
  left: 15%;
  animation-delay: -5s;
}
.floating-shape:nth-child(2) {
  top: 20%;
  right: 10%;
  animation-delay: -10s;
}
.floating-shape:nth-child(3) {
  top: 75%;
  left: 20%;
  animation-delay: -15s;
}
.floating-shape:nth-child(4) {
  bottom: 10%;
  right: 15%;
  animation-delay: -20s;
}
.floating-shape:nth-child(5) {
  top: 40%;
  left: 50%;
  animation-delay: -25s;
}
.floating-shape:nth-child(6) {
  top: 80%;
  right: 40%;
  animation-delay: -30s;
}
.floating-shape:nth-child(7) {
  top: 5%;
  left: 70%;
  animation-delay: -35s;
}
.floating-shape:nth-child(8) {
  bottom: 5%;
  left: 5%;
  animation-delay: -40s;
}

@keyframes float-around {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(15vw, -20vh) rotate(60deg);
  }
  50% {
    transform: translate(0, 25vh) rotate(120deg);
  }
  75% {
    transform: translate(-15vw, -10vh) rotate(180deg);
  }
}

/* --- Hero Section --- */
.hero-section {
  position: relative;
  z-index: 1;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.9) 0%,
    rgba(118, 75, 162, 0.9) 100%
  );
}

/* Mascot Character - Interaction based animation */
.main-character {
  font-size: 5rem;
  cursor: pointer;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.interactive-bounce:hover {
  animation: character-bounce 0.8s ease;
}

@keyframes character-bounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.1);
  }
}

/* --- Typography --- */
.hero-title {
  /* FONT CHANGE: Bungee for H1 titles only */
  font-family: "Bungee", cursive;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 400; /* Bungee is bold by default */
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.15);
  line-height: 1.2;
  color: #ffffff;
  /* RAINBOW TEXT REMOVED: Replaced with a solid, high-contrast color */
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  line-height: 1.5;
}

/* --- Learning Journey Progress --- */
.journey-progress {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.15);
  padding: 10px 20px;
  border-radius: 50px;
}

.progress-step {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.progress-step.completed {
  color: #ffffff;
}

.progress-step.current {
  color: #ffd700;
  text-shadow: 0 0 8px #ffd700;
}

.progress-arrow {
  color: rgba(255, 255, 255, 0.5);
}

/* --- Main Content Container --- */
.terms-container {
  position: relative;
  z-index: 2;
  margin-top: -50px;
  padding-bottom: 60px;
}

/* --- Loading & Error States --- */
.loading-mascot,
.error-container {
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: #fff;
}

.loading-character,
.error-character {
  font-size: 4rem;
  animation: spin-subtle 4s linear infinite;
}

@keyframes spin-subtle {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text,
.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 10px;
}

.error-message {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8px;
  margin-bottom: 20px;
}

.skeleton-loader {
  background-color: rgba(255, 255, 255, 0.05);
}

/* --- Terms Grid & Cards --- */
.term-card-wrapper {
  width: 100%;
  opacity: 0;
  transform: translateY(40px);
  /* Simplified animation */
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  transition-delay: var(--animation-delay, 0ms);
}

.term-card-wrapper.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.term-card {
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.term-card--hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2) !important;
}

/* Card Header Themes */
.term-header {
  position: relative;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
}

.header-theme-0 {
  background: linear-gradient(135deg, #ff8a65, #ff5722);
}
.header-theme-1 {
  background: linear-gradient(135deg, #4fc3f7, #0277bd);
}
.header-theme-2 {
  background: linear-gradient(135deg, #81c784, #388e3c);
}
.header-theme-3 {
  background: linear-gradient(135deg, #ffca28, #ffa000);
}

.term-main-icon {
  font-size: 3.5rem;
  transition: transform 0.3s ease;
}

.term-card--hover .term-main-icon {
  transform: scale(1.1);
}

.season-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
}

/* Card Content */
.term-title {
  text-align: center;
  font-weight: 800;
  font-size: 1.6rem !important;
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  padding: 20px 16px 8px !important;
  line-height: 1.3;
}

.term-description {
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  padding: 0 16px 16px !important;
  font-size: 0.95rem;
  flex-grow: 1;
}

.features-showcase {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.feature-highlight {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(0, 0, 0, 0.15);
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
}

/* Action Button */
.adventure-btn {
  font-weight: 800 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-size: 1rem !important;
  border-radius: 50px !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.adventure-btn:hover {
  transform: scale(1.05);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.adventure-btn:hover .btn-icon {
  transform: rotate(-15deg) translateX(3px);
}

/* --- Motivation Section --- */
.motivation-section {
  padding: 30px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  color: #fff;
}

.motivation-character {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  transition: transform 0.3s ease;
}

.interactive-pulse:hover {
  animation: pulse-subtle 1.5s ease-in-out infinite;
}

@keyframes pulse-subtle {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.motivation-title {
  /* RAINBOW TEXT REMOVED: Replaced with static gradient */
  background: linear-gradient(45deg, #ffd700, #ffc107);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
}

.motivation-text {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 10px;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* --- Celebration Overlay (Simplified) --- */
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(90, 48, 127, 0.9);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  animation: overlay-fade-in 0.3s ease-out;
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
  animation: content-scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes content-scale-in {
  from {
    transform: scale(0.7);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.celebration-character {
  font-size: 6rem;
  animation: rocket-launch 1.5s ease-in-out infinite;
}

@keyframes rocket-launch {
  0% {
    transform: translateY(10px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(10px);
  }
}

.celebration-title {
  font-family: "Bungee", cursive;
  font-size: 2.5rem;
  font-weight: 400;
  margin-top: 20px;
}

.celebration-message {
  font-size: 1.2rem;
  margin-top: 5px;
  opacity: 0.9;
}
</style>
