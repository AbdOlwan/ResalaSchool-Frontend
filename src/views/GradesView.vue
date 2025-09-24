<template>
  <v-container fluid class="pa-0 grades-adventure-page">
    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 4" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape heart" v-for="n in 2" :key="'heart-' + n">
        💖
      </div>
      <div class="floating-shape rocket" v-for="n in 1" :key="'rocket-' + n">
        🚀
      </div>
    </div>

    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      height="500"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="8">
          <div class="mascot-container mb-6">
            <div class="mascot" @click="playWelcomeSound">🐻</div>
            <div class="mascot-speech-bubble">
              <span class="speech-text">Choose Your Learning Adventure!</span>
              <div class="bubble-sparkles">✨</div>
            </div>
          </div>

          <h1 class="hero-title gradient-text mb-4">
            🌟 Select Your Grade Level 🌟
          </h1>

          <p class="hero-subtitle animate-fade-in mb-6">
            🎯 Every grade is a new adventure waiting for you!
            <br />🚀 Pick your level and start your amazing learning journey!
          </p>

          <div class="journey-progress mb-4">
            <div class="progress-step active">🏠 Home</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step current">📚 Choose Grade</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step">🎓 Start Learning</div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <v-container class="grades-container">
      <v-row v-if="isLoading" justify="center" class="my-8">
        <v-col cols="12" class="text-center">
          <div class="loading-mascot">
            <div class="loading-character spin-animation">🎨</div>
            <h3 class="loading-text gradient-text">
              Preparing Your Classroom...
            </h3>
            <div class="loading-dots">
              <span class="dot" v-for="n in 3" :key="n"></span>
            </div>
          </div>
        </v-col>
        <v-col v-for="n in 3" :key="n" cols="12" sm="6" md="4">
          <div class="loading-card">
            <v-skeleton-loader
              type="card, article"
              class="skeleton-animated"
            ></v-skeleton-loader>
            <div class="loading-sparkle">✨</div>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="apiError" justify="center" class="my-8">
        <v-col cols="12" md="8">
          <div class="error-container">
            <div class="error-character shake-animation">😔</div>
            <div class="error-card">
              <h3 class="error-title">Oops! Something went wrong</h3>
              <p class="error-message">{{ apiError }}</p>
              <v-btn
                @click="fetchGrades"
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

      <v-row
        v-if="!isLoading && !apiError"
        justify="center"
        align="stretch"
        class="grades-grid"
      >
        <v-col
          v-for="(grade, index) in grades"
          :key="grade.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="grade-col"
        >
          <div
            class="grade-card-wrapper"
            :style="{ '--animation-delay': `${index * 150}ms` }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 24 : 8"
                class="grade-card"
                :class="[
                  `grade-theme-${index % cardThemes.length}`,
                  { 'grade-card--hover': isHovering },
                ]"
                @click="navigateToGrade(grade.id, grade.name)"
              >
                <div
                  class="card-glow"
                  :class="`glow-${index % cardThemes.length}`"
                ></div>

                <div
                  class="grade-header"
                  :class="`header-${index % cardThemes.length}`"
                >
                  <div class="grade-icon-container">
                    <div class="grade-icon">
                      {{ getIconForGrade(index) }}
                    </div>
                    <div class="icon-ring"></div>
                  </div>

                  <div class="achievement-badge">
                    <div class="badge-icon">🏆</div>
                    <span class="badge-text">Level {{ index + 1 }}</span>
                  </div>
                </div>

                <v-card-title class="grade-title">
                  {{ grade.name }}
                </v-card-title>

                <v-card-text class="grade-description">
                  <div class="description-text">
                    🎨 Amazing lessons designed just for you!
                    <br />🎯 Interactive games and fun challenges await!
                  </div>

                  <div class="features-list mt-3">
                    <div class="feature-item">
                      <span class="feature-icon">📖</span>
                      <span class="feature-text">Interactive Lessons</span>
                    </div>
                    <div class="feature-item">
                      <span class="feature-icon">🎮</span>
                      <span class="feature-text">Fun Games</span>
                    </div>
                    <div class="feature-item">
                      <span class="feature-icon">🏆</span>
                      <span class="feature-text">Achievements</span>
                    </div>
                  </div>
                </v-card-text>

                <div class="grade-progress">
                  <div class="progress-label">Ready to explore!</div>
                  <div class="progress-bar-container">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: getProgressWidth(index) }"
                      >
                        <div class="progress-shine"></div>
                      </div>
                    </div>
                    <div class="progress-percentage">
                      {{ getProgressPercentage(index) }}%
                    </div>
                  </div>
                </div>

                <v-card-actions class="justify-center pa-4">
                  <v-btn
                    variant="elevated"
                    :color="getColorForGrade(index)"
                    class="enter-btn"
                    size="large"
                    @mouseover="playHoverSound"
                  >
                    <span class="btn-text">Let's Go!</span>
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
            <div class="motivation-character">
              <div class="character-main">🌟</div>
              <div class="character-friends">
                <span class="friend friend-1">🚀</span>
                <span class="friend friend-2">📚</span>
                <span class="friend friend-3">🎨</span>
              </div>
            </div>

            <h3 class="motivation-title gradient-text">
              You're Going to Be Amazing! 🌟
            </h3>

            <p class="motivation-text">
              Every great learner starts with choosing their adventure. Click on
              your grade above and begin your incredible journey of discovery
              and fun!
            </p>

            <div class="motivation-badges">
              <div
                class="badge-item"
                v-for="(badge, idx) in motivationBadges"
                :key="idx"
              >
                <div class="badge-emoji">{{ badge.emoji }}</div>
                <div class="badge-label">{{ badge.label }}</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div class="success-messages">
      <div
        v-for="message in successMessages"
        :key="message.id"
        class="success-message"
        :style="message.style"
      >
        {{ message.text }}
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiClient from "@/services/api.js";

// VUE-REFACTOR-NOTE: This is a placeholder for a global mute state.
// It should be replaced with a real state management solution (e.g., Pinia, Vuex).
// Example with Pinia:
// import { useSettingsStore } from '@/stores/settings';
// const settings = useSettingsStore();
// const isMuted = computed(() => settings.isMuted);
const isMuted = ref(false);

// --- State Management ---
const grades = ref([]);
const isLoading = ref(true);
const apiError = ref(null);
const successMessages = ref([]);
const router = useRouter();
const route = useRoute();

// --- Theming Data ---
const cardThemes = [
  { color: "teal-darken-2", icon: "🌊", glowColor: "#00897b" },
  { color: "deep-purple-accent-3", icon: "🔮", glowColor: "#673ab7" },
  { color: "amber-darken-3", icon: "☀️", glowColor: "#ff8f00" },
  { color: "pink-accent-2", icon: "🌸", glowColor: "#e91e63" },
  { color: "blue-darken-2", icon: "🌌", glowColor: "#1976d2" },
  { color: "green-darken-2", icon: "🌳", glowColor: "#388e3c" },
];

const motivationBadges = [
  { emoji: "🎨", label: "Creative" },
  { emoji: "🚀", label: "Explorer" },
  { emoji: "💫", label: "Star Student" },
  { emoji: "🏆", label: "Champion" },
  { emoji: "🌟", label: "Brilliant" },
];

// --- API Call ---
const fetchGrades = async () => {
  const phaseId = route.params.phaseId;
  if (!phaseId) {
    apiError.value =
      "Could not identify the educational stage. Please go back and try again.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    apiError.value = null;
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Keep delay for better UX on loading skeleton

    const response = await apiClient.get(
      `/api/EducationalContent/phases/${phaseId}/grades`
    );

    if (response.data && response.data.success) {
      if (response.data.data.length > 0) {
        grades.value = response.data.data;
        playSuccessSound();
      } else {
        apiError.value = "No grades found for this stage yet. Check back soon!";
      }
    } else {
      throw new Error(response.data.message || "Failed to retrieve data.");
    }
  } catch (error) {
    console.error("API Error fetching grades:", error);
    apiError.value =
      "We couldn't reach the classrooms! Please check your connection and try again.";
    playErrorSound();
  } finally {
    isLoading.value = false;
  }
};

// --- Lifecycle Hook ---
onMounted(async () => {
  await fetchGrades();
  await nextTick();
  animateGradeCards();
});

// --- Animation Functions ---
const animateGradeCards = () => {
  const cards = document.querySelectorAll(".grade-card-wrapper");
  cards.forEach((card, index) => {
    // Staggered animation for cards appearing
    setTimeout(() => {
      card.classList.add("animate-in");
    }, index * 150);
  });
};

// --- Navigation ---
const navigateToGrade = (gradeId, gradeName) => {
  playClickSound();
  showSuccessMessage("Let's Go! 🚀");

  // VUE-REFACTOR-NOTE: CRITICAL CHANGE - Removed celebration overlay and setTimeout.
  // Navigation is now instantaneous upon user click, eliminating artificial delays.
  console.log(`Navigating to Grade ID: ${gradeId} (${gradeName})`);
  router.push({ name: "Terms", params: { gradeId } });
};

// --- UI Helper Functions ---
const getIconForGrade = (index) => cardThemes[index % cardThemes.length].icon;
const getColorForGrade = (index) => cardThemes[index % cardThemes.length].color;
const getProgressWidth = (index) => {
  const widths = ["85%", "92%", "78%", "88%", "95%", "82%"];
  return widths[index % widths.length];
};
const getProgressPercentage = (index) => {
  const percentages = [85, 92, 78, 88, 95, 82];
  return percentages[index % percentages.length];
};

// --- Sound Effects ---
const playWelcomeSound = () => playSound("welcome");
const playHoverSound = () => playSound("hover");
const playClickSound = () => playSound("click");
const playSuccessSound = () => playSound("success");
const playErrorSound = () => playSound("error");

const playSound = (type) => {
  // VUE-REFACTOR-NOTE: Added a check for the global mute state before playing any sound.
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
    console.warn("Web Audio API is not supported in this browser.");
  }
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
/* VUE-REFACTOR-NOTE:
   It's recommended to import these fonts in your main CSS file or index.html.
   @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&family=Bungee&display=swap');
*/

/* --- Base Styles --- */
.grades-adventure-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  /* VUE-REFACTOR-NOTE: Primary font changed to Cairo for better readability. */
  font-family: "Cairo", sans-serif;
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
  /* VUE-REFACTOR-NOTE: Animation is now slower and less distracting. */
  animation: float-around 45s ease-in-out infinite;
  opacity: 0.4;
}

/* Randomize floating element positions */
.floating-shape.star:nth-child(1) {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}
.floating-shape.star:nth-child(2) {
  top: 20%;
  left: 85%;
  animation-delay: -8s;
}
.floating-shape.star:nth-child(3) {
  top: 60%;
  left: 10%;
  animation-delay: -15s;
}
.floating-shape.star:nth-child(4) {
  bottom: 30%;
  right: 15%;
  animation-delay: -22s;
}

.floating-shape.heart:nth-child(1) {
  top: 15%;
  right: 20%;
  animation-delay: -5s;
}
.floating-shape.heart:nth-child(2) {
  bottom: 20%;
  left: 30%;
  animation-delay: -25s;
}

.floating-shape.rocket:nth-child(1) {
  bottom: 40%;
  right: 25%;
  animation-delay: -30s;
}

/* VUE-REFACTOR-NOTE: Animation movement is less drastic for a calmer background. */
@keyframes float-around {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(10vw, -8vh) rotate(60deg) scale(1.1);
  }
  50% {
    transform: translate(5vw, -15vh) rotate(120deg) scale(0.9);
  }
  75% {
    transform: translate(-8vw, -10vh) rotate(180deg) scale(1);
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
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    repeat;
}

/* --- Mascot Styles --- */
.mascot-container {
  position: relative;
  z-index: 2;
}

.mascot {
  font-size: 6rem;
  cursor: pointer;
  display: inline-block;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mascot:hover {
  /* VUE-REFACTOR-NOTE: Interaction-based bounce effect. */
  transform: scale(1.15) translateY(-10px);
}

.mascot-speech-bubble {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.98);
  padding: 12px 20px;
  border-radius: 25px;
  border: 3px solid #ffd700;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  animation: bubble-float 3s ease-in-out infinite;
  min-width: 200px;
}

.mascot-speech-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 12px solid transparent;
  border-top-color: #ffd700;
}

.bubble-sparkles {
  position: absolute;
  top: -5px;
  right: -5px;
  animation: sparkle-rotate 2s linear infinite;
}

@keyframes bubble-float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}

@keyframes sparkle-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* --- Typography --- */
.hero-title {
  /* VUE-REFACTOR-NOTE: Bungee font for headlines as per requirement. */
  font-family: "Bungee", cursive;
  font-size: clamp(2.5rem, 5vw, 4rem);
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
  line-height: 1.2;
  position: relative;
  z-index: 2;
}

.gradient-text {
  /* VUE-REFACTOR-NOTE: Removed distracting animated gradient shift. */
  background: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 200% 200%;
  background-position: 50% 50%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
  z-index: 2;
  position: relative;
}

.animate-fade-in {
  animation: fade-in-up 1s ease-out 0.5s both;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- Journey Progress --- */
.journey-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 15px 25px;
  border-radius: 50px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  position: relative;
  z-index: 2;
}

.progress-step {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.progress-step.active {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 2px solid #4caf50;
}

.progress-step.current {
  background: rgba(255, 215, 0, 0.3);
  color: #ffd700;
  border: 2px solid #ffd700;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
  }
}

.progress-arrow {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
}

/* --- Loading States --- */
.loading-mascot {
  text-align: center;
  margin-bottom: 2rem;
}
.loading-character {
  font-size: 4rem;
  margin-bottom: 1rem;
}
.spin-animation {
  animation: loading-spin 2s linear infinite;
}
@keyframes loading-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading-text {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffd700;
  animation: loading-bounce 1.5s ease-in-out infinite;
}
.dot:nth-child(1) {
  animation-delay: 0s;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes loading-bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
.loading-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
}
.skeleton-animated {
  border-radius: 20px;
}
.loading-sparkle {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  animation: sparkle-pulse 1s ease-in-out infinite alternate;
}
@keyframes sparkle-pulse {
  from {
    transform: scale(1);
    opacity: 0.8;
  }
  to {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* --- Error State --- */
.error-container {
  text-align: center;
  margin-top: 2rem;
}
.error-character {
  font-size: 6rem;
  animation: shake-animation 0.5s infinite;
}
@keyframes shake-animation {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}
.error-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid #ff4d4d;
}
.error-title {
  font-size: 2rem;
  color: #ff4d4d;
  font-weight: bold;
  margin-bottom: 1rem;
}
.error-message {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
}
.retry-btn {
  font-weight: bold;
  text-transform: none;
  border-radius: 50px;
  transition: all 0.3s ease;
}

/* --- Grades Grid --- */
.grades-container {
  position: relative;
  z-index: 5;
}

.grades-grid {
  margin-top: -80px;
  position: relative;
}

/* --- Grade Card --- */
.grade-card-wrapper {
  perspective: 1000px;
  transform: translateY(50px) scale(0.9);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.grade-card-wrapper.animate-in {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.grade-card {
  border-radius: 25px !important;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.2);
  transform-style: preserve-3d;
  /* VUE-REFACTOR-NOTE: Removed continuous floating animation for performance and reduced cognitive load. */
}

.grade-card--hover {
  transform: scale(1.05) translateY(-10px) !important;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3) !important;
}

/* Card Glow Effect */
.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  opacity: 0.5;
  filter: blur(25px);
  pointer-events: none;
  transition: all 0.4s ease;
  z-index: -1;
}

.grade-card--hover .card-glow {
  opacity: 0.8;
  transform: scale(1.1);
}

.glow-0 {
  background: #00897b;
}
.glow-1 {
  background: #673ab7;
}
.glow-2 {
  background: #ff8f00;
}
.glow-3 {
  background: #e91e63;
}
.glow-4 {
  background: #1976d2;
}
.glow-5 {
  background: #388e3c;
}

/* Card Headers */
.grade-header {
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  overflow: hidden;
}

.header-0 {
  background-color: #009688;
}
.header-1 {
  background-color: #673ab7;
}
.header-2 {
  background-color: #ff9800;
}
.header-3 {
  background-color: #e91e63;
}
.header-4 {
  background-color: #2196f3;
}
.header-5 {
  background-color: #4caf50;
}

.grade-icon-container {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.grade-icon {
  font-size: 4rem;
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.grade-card--hover .grade-icon {
  transform: scale(1.2) rotate(10deg);
}

.icon-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
  animation: ring-pulse 2s ease-in-out infinite;
  z-index: 1;
}

@keyframes ring-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.achievement-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 5px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.grade-card--hover .achievement-badge {
  transform: scale(1.1);
}

.badge-icon {
  font-size: 1.1rem;
}

/* Card Content */
.grade-title {
  text-align: center;
  font-size: 1.6rem;
  font-weight: 800;
  padding-bottom: 0 !important;
  color: #333;
}

.grade-description {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.features-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.feature-item {
  display: flex;
  align-items: center;
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #444;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 1.1rem;
  margin-right: 5px;
}

/* Progress Bar */
.grade-progress {
  padding: 0 16px;
  margin-top: 10px;
}

.progress-label {
  font-size: 0.8rem;
  font-weight: bold;
  color: #777;
  text-align: center;
  margin-bottom: 5px;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e0e0e0;
  border-radius: 10px;
  height: 16px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.progress-bar {
  flex-grow: 1;
  height: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  border-radius: 10px;
  transition: width 0.5s ease-in-out;
  position: relative;
}

.progress-shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  transform: skewX(-45deg);
  animation: shine-animation 2s linear infinite;
}

@keyframes shine-animation {
  from {
    transform: translateX(-150%) skewX(-45deg);
  }
  to {
    transform: translateX(250%) skewX(-45deg);
  }
}

.progress-percentage {
  font-size: 0.7rem;
  font-weight: bold;
  color: #555;
  margin-right: 8px;
}

/* Action Button */
.enter-btn {
  border-radius: 50px !important;
  font-weight: bold !important;
  text-transform: none !important;
  padding: 10px 25px !important;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.enter-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.enter-btn:hover .btn-icon {
  transform: translateX(5px) rotate(15deg);
}

/* --- Motivation Section --- */
.motivation-section {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 2rem;
  border-radius: 30px;
  border: 2px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-top: 2rem;
  position: relative;
  z-index: 2;
}

.motivation-character {
  position: relative;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.character-main {
  font-size: 5rem;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* VUE-REFACTOR-NOTE: Interaction-based animation. */
.motivation-character:hover .character-main {
  transform: scale(1.2);
}

.character-friends {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
}

.friend {
  position: absolute;
  font-size: 2rem;
  animation: friend-orbit 8s linear infinite;
}

.friend-1 {
  animation-delay: 0s;
}
.friend-2 {
  animation-delay: -2s;
}
.friend-3 {
  animation-delay: -4s;
}

@keyframes friend-orbit {
  from {
    transform: rotate(0deg) translateX(50px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(50px) rotate(-360deg);
  }
}

.motivation-title {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.motivation-text {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.motivation-badges {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.badge-item:hover {
  transform: scale(1.1);
}

.badge-emoji {
  font-size: 2.5rem;
  margin-bottom: 5px;
}

.badge-label {
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

/* Floating Success Messages */
.success-messages {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1001;
}

.success-message {
  position: absolute;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background-color: rgba(0, 0, 0, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  animation: float-up-fade 3s ease-out forwards;
}

@keyframes float-up-fade {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-60px) scale(0.8);
    opacity: 0;
  }
}
</style>
