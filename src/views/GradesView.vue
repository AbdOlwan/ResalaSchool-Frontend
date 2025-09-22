<template>
  <v-container fluid class="pa-0 grades-adventure-page">
    <!-- Floating Background Elements -->
    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 12" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape heart" v-for="n in 8" :key="'heart-' + n">
        💖
      </div>
      <div class="floating-shape rocket" v-for="n in 6" :key="'rocket-' + n">
        🚀
      </div>
      <div class="floating-shape book" v-for="n in 4" :key="'book-' + n">
        📚
      </div>
      <div class="floating-shape trophy" v-for="n in 3" :key="'trophy-' + n">
        🏆
      </div>
    </div>

    <!-- Header Section with Mascot -->
    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      height="500"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="8">
          <!-- Interactive Mascot -->
          <div class="mascot-container mb-6">
            <div class="mascot bounce-animation" @click="playWelcomeSound">
              🐻
            </div>
            <div class="mascot-speech-bubble">
              <span class="speech-text">Choose Your Learning Adventure!</span>
              <div class="bubble-sparkles">✨</div>
            </div>
          </div>

          <!-- Main Title with Animation -->
          <h1 class="hero-title gradient-text mb-4">
            🌟 Select Your Grade Level 🌟
          </h1>

          <!-- Subtitle -->
          <p class="hero-subtitle animate-fade-in mb-6">
            🎯 Every grade is a new adventure waiting for you!
            <br />🚀 Pick your level and start your amazing learning journey!
          </p>

          <!-- Progress Indicator -->
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

    <!-- Main Content Container -->
    <v-container class="grades-container">
      <!-- Loading State with Fun Animation -->
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

      <!-- Error State with Friendly Character -->
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

      <!-- Grades Grid -->
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
            :style="{ '--animation-delay': `${index * 200}ms` }"
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
                <!-- Card Glow Effect -->
                <div
                  class="card-glow"
                  :class="`glow-${index % cardThemes.length}`"
                ></div>

                <!-- Floating Elements on Card -->
                <div class="card-floaters">
                  <div class="floater star">⭐</div>
                  <div class="floater heart">💖</div>
                  <div class="floater medal">🏅</div>
                </div>

                <!-- Card Header with Icon -->
                <div
                  class="grade-header"
                  :class="`header-${index % cardThemes.length}`"
                >
                  <div class="grade-icon-container">
                    <div class="grade-icon bounce-hover">
                      {{ getIconForGrade(index) }}
                    </div>
                    <div class="icon-ring"></div>
                    <div class="icon-sparkles">
                      <span class="sparkle" v-for="n in 6" :key="n">✨</span>
                    </div>
                  </div>

                  <!-- Achievement Badge -->
                  <div class="achievement-badge">
                    <div class="badge-icon">🏆</div>
                    <span class="badge-text">Level {{ index + 1 }}</span>
                  </div>
                </div>

                <!-- Card Content -->
                <v-card-title class="grade-title">
                  {{ grade.name }}
                </v-card-title>

                <v-card-text class="grade-description">
                  <div class="description-text">
                    🎨 Amazing lessons designed just for you!
                    <br />🎯 Interactive games and fun challenges await!
                  </div>

                  <!-- Features List -->
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

                <!-- Progress Section -->
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

                <!-- Action Button -->
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
                    <div class="btn-sparkles">✨</div>
                  </v-btn>
                </v-card-actions>

                <!-- Hover Effects -->
                <div v-if="isHovering" class="hover-effects">
                  <div class="hover-particle" v-for="n in 8" :key="n"></div>
                </div>
              </v-card>
            </v-hover>
          </div>
        </v-col>
      </v-row>

      <!-- Motivation Section -->
      <v-row justify="center" class="mt-12 mb-8">
        <v-col cols="12" md="10" lg="8" class="text-center">
          <div class="motivation-section">
            <div class="motivation-character">
              <div class="character-main pulse-animation">🌟</div>
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

    <!-- Success Celebration Overlay -->
    <div v-if="showCelebration" class="celebration-overlay">
      <div class="celebration-content">
        <div class="celebration-character bounce-in">🎉</div>
        <h2 class="celebration-title">Fantastic Choice!</h2>
        <p class="celebration-message">
          Get ready for an amazing learning adventure full of fun and discovery!
        </p>
        <div class="celebration-stars">
          <span class="star" v-for="n in 5" :key="n">⭐</span>
        </div>
      </div>
      <div class="confetti" v-for="n in 50" :key="n"></div>
    </div>

    <!-- Floating Success Messages -->
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

// --- State Management ---
const grades = ref([]);
const isLoading = ref(true);
const apiError = ref(null);
const showCelebration = ref(false);
const successMessages = ref([]);
const router = useRouter();
const route = useRoute();

// --- Theming Data ---
const cardThemes = [
  {
    color: "teal-darken-2",
    icon: "🌊",
    headerClass: "ocean-theme",
    glowColor: "#00897b",
  },
  {
    color: "deep-purple-accent-3",
    icon: "🔮",
    headerClass: "magic-theme",
    glowColor: "#673ab7",
  },
  {
    color: "amber-darken-3",
    icon: "☀️",
    headerClass: "sunshine-theme",
    glowColor: "#ff8f00",
  },
  {
    color: "pink-accent-2",
    icon: "🌸",
    headerClass: "flower-theme",
    glowColor: "#e91e63",
  },
  {
    color: "blue-darken-2",
    icon: "🌌",
    headerClass: "space-theme",
    glowColor: "#1976d2",
  },
  {
    color: "green-darken-2",
    icon: "🌳",
    headerClass: "nature-theme",
    glowColor: "#388e3c",
  },
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

    // Add some loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
    setTimeout(() => {
      card.classList.add("animate-in");
    }, index * 200);
  });
};

// --- Navigation ---
const navigateToGrade = async (gradeId, gradeName) => {
  playClickSound();
  showSuccessMessage("Great Choice! 🌟");

  // Show celebration
  showCelebration.value = true;

  // Navigate after celebration
  setTimeout(() => {
    showCelebration.value = false;
    console.log(`Navigating to Grade ID: ${gradeId} (${gradeName})`);
    router.push({ name: "Terms", params: { gradeId } });
  }, 2500);
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
.grades-adventure-page {
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
  animation: float-around 20s ease-in-out infinite;
  opacity: 0.6;
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
  animation-delay: -2s;
}
.floating-shape.star:nth-child(3) {
  top: 60%;
  left: 10%;
  animation-delay: -4s;
}
.floating-shape.star:nth-child(4) {
  bottom: 30%;
  right: 15%;
  animation-delay: -6s;
}
.floating-shape.star:nth-child(5) {
  top: 80%;
  left: 75%;
  animation-delay: -8s;
}
.floating-shape.star:nth-child(6) {
  top: 40%;
  left: 50%;
  animation-delay: -10s;
}

.floating-shape.heart:nth-child(1) {
  top: 15%;
  right: 20%;
  animation-delay: -1s;
}
.floating-shape.heart:nth-child(2) {
  bottom: 20%;
  left: 30%;
  animation-delay: -5s;
}
.floating-shape.heart:nth-child(3) {
  top: 70%;
  right: 40%;
  animation-delay: -9s;
}

.floating-shape.rocket:nth-child(1) {
  top: 30%;
  left: 20%;
  animation-delay: -3s;
}
.floating-shape.rocket:nth-child(2) {
  bottom: 40%;
  right: 25%;
  animation-delay: -7s;
}

@keyframes float-around {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(15vw, -10vh) rotate(90deg) scale(1.2);
  }
  50% {
    transform: translate(10vw, -20vh) rotate(180deg) scale(0.8);
  }
  75% {
    transform: translate(-10vw, -15vh) rotate(270deg) scale(1.1);
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
  transition: transform 0.3s ease;
}

.mascot:hover {
  transform: scale(1.15);
}

.bounce-animation {
  animation: mascot-bounce 2s ease-in-out infinite;
}

@keyframes mascot-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
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
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 0.9;
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
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
  line-height: 1.2;
  position: relative;
  z-index: 2;
}

.gradient-text {
  background: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 4s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
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
  animation: card-float 6s ease-in-out infinite;
}

.grade-card--hover {
  transform: scale(1.05) rotateX(5deg) rotateY(5deg) !important;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3) !important;
}

@keyframes card-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
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
  background: radial-gradient(circle, #00897b, transparent);
}
.glow-1 {
  background: radial-gradient(circle, #673ab7, transparent);
}
.glow-2 {
  background: radial-gradient(circle, #ff8f00, transparent);
}
.glow-3 {
  background: radial-gradient(circle, #e91e63, transparent);
}
.glow-4 {
  background: radial-gradient(circle, #1976d2, transparent);
}
.glow-5 {
  background: radial-gradient(circle, #388e3c, transparent);
}

/* Card Floaters */
.card-floaters {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
}

.floater {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.7;
  animation: floater-move 10s linear infinite;
}

.floater.star {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}
.floater.heart {
  bottom: 20%;
  right: 15%;
  animation-delay: -3s;
}
.floater.medal {
  top: 50%;
  right: 30%;
  animation-delay: -6s;
}

@keyframes floater-move {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(10px, -20px) rotate(180deg);
  }
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

.grade-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
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

.bounce-hover:hover {
  animation: bounce-icon 0.6s ease-in-out;
}

@keyframes bounce-icon {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
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

.icon-sparkles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.icon-sparkles .sparkle {
  position: absolute;
  font-size: 0.8rem;
  animation: sparkle-move 1.5s linear infinite;
  opacity: 0;
}

.icon-sparkles .sparkle:nth-child(1) {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}
.icon-sparkles .sparkle:nth-child(2) {
  top: 30%;
  right: 10%;
  animation-delay: 0.2s;
}
.icon-sparkles .sparkle:nth-child(3) {
  bottom: 20%;
  left: 40%;
  animation-delay: 0.4s;
}
.icon-sparkles .sparkle:nth-child(4) {
  bottom: 5%;
  right: 25%;
  animation-delay: 0.6s;
}

@keyframes sparkle-move {
  0% {
    transform: translate(0, 0) rotate(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(20px, -20px) rotate(180deg);
    opacity: 0;
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
  0% {
    transform: translateX(-150%) skewX(-45deg);
  }
  100% {
    transform: translateX(150%) skewX(-45deg);
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
  transform: translateX(5px);
}

.btn-sparkles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  font-size: 1.5rem;
  animation: button-sparkle 1s ease-out;
}

@keyframes button-sparkle {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Hover Effects */
.hover-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hover-particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: particle-fly 1.5s ease-out forwards;
  opacity: 0;
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
}

.character-main {
  font-size: 5rem;
  animation: pulse-animation 2s infinite;
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
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
  0%,
  100% {
    transform: rotate(0deg) translateX(50px) rotate(0deg);
  }
  100% {
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

/* --- Success Celebration Overlay --- */
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.celebration-content {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  transform: scale(0.8);
  opacity: 0;
  animation: pop-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
}

@keyframes pop-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.celebration-character {
  font-size: 5rem;
  animation: bounce-in 1s cubic-bezier(0.2, 0.8, 0.4, 1.2);
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.celebration-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 1rem;
}

.celebration-message {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.celebration-stars {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.celebration-stars .star {
  font-size: 1.5rem;
  animation: star-spin 1s ease-in-out infinite alternate;
}

@keyframes star-spin {
  from {
    transform: rotate(0deg) scale(1);
  }
  to {
    transform: rotate(360deg) scale(1.2);
  }
}

/* Confetti Effect */
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #f00;
  border-radius: 50%;
  animation: confetti-fall 3s linear infinite;
  opacity: 0;
}
.confetti:nth-child(1) {
  top: 0%;
  left: 10%;
  background: #ffeb3b;
  animation-delay: 0s;
}
.confetti:nth-child(2) {
  top: 0%;
  left: 20%;
  background: #4caf50;
  animation-delay: 0.5s;
}
.confetti:nth-child(3) {
  top: 0%;
  left: 30%;
  background: #2196f3;
  animation-delay: 1s;
}
.confetti:nth-child(4) {
  top: 0%;
  left: 40%;
  background: #ff5722;
  animation-delay: 1.5s;
}
.confetti:nth-child(5) {
  top: 0%;
  left: 50%;
  background: #9c27b0;
  animation-delay: 2s;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Floating Success Messages */
.success-messages {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

.success-message {
  position: absolute;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: float-up-fade 3s ease-out forwards;
}

@keyframes float-up-fade {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
}
</style>
