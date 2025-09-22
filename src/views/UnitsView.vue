<template>
  <v-container fluid class="pa-0 units-adventure-page">
    <!-- Floating Background Elements -->
    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 20" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape heart" v-for="n in 12" :key="'heart-' + n">
        💖
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
      <div class="floating-shape magic" v-for="n in 8" :key="'magic-' + n">
        ✨
      </div>
    </div>

    <!-- Hero Section with Interactive Characters -->
    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      height="500"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="8">
          <!-- Interactive Learning Mascots -->
          <div class="mascots-container mb-6">
            <div class="main-mascot bounce-animation" @click="playWelcomeSound">
              🦉
            </div>
            <div class="mascot-friends">
              <div
                class="friend friend-1 orbit-animation"
                @click="playSound('click')"
              >
                🦄
              </div>
              <div
                class="friend friend-2 orbit-animation"
                @click="playSound('click')"
              >
                🐸
              </div>
              <div
                class="friend friend-3 orbit-animation"
                @click="playSound('click')"
              >
                🦋
              </div>
            </div>
            <div class="mascot-speech-bubble pulse-animation">
              <span class="speech-text">Ready for Your Learning Units?</span>
              <div class="bubble-sparkles">✨💫✨</div>
            </div>
          </div>

          <!-- Animated Title -->
          <h1 class="hero-title rainbow-text mb-4 title-bounce">
            🌟 Course Learning Units! 🌟
          </h1>

          <!-- Motivational Subtitle -->
          <p class="hero-subtitle animate-fade-in mb-6">
            🎯 Each unit is a new adventure filled with exciting lessons!
            <br />🌈 Choose your unit and discover amazing learning experiences!
          </p>

          <!-- Progress Journey Indicator -->
          <div class="journey-progress mb-4">
            <div class="progress-step completed">🏠 Home</div>
            <div class="progress-arrow bounce-arrow">➜</div>
            <div class="progress-step completed">📚 Course</div>
            <div class="progress-arrow bounce-arrow">➜</div>
            <div class="progress-step current glow-effect">📖 Units</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step">🎓 Lessons</div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Main Content Container -->
    <v-container class="units-container">
      <!-- Back Button -->
      <v-row justify="start" class="mb-4">
        <v-col cols="12">
          <v-btn
            @click="$router.go(-1)"
            color="deep-purple-accent-3"
            size="large"
            class="back-btn magic-btn"
            prepend-icon="mdi-arrow-left"
          >
            <span class="btn-text">Back to Course</span>
            <div class="btn-sparkles">🌟</div>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Loading State with Fun Characters -->
      <v-row v-if="isLoading" justify="center" class="my-8">
        <v-col cols="12" class="text-center mb-6">
          <div class="loading-mascot">
            <div class="loading-character spin-animation">🎪</div>
            <h3 class="loading-text rainbow-text">
              Preparing Your Learning Units...
            </h3>
            <div class="loading-dots">
              <span class="dot dot-1"></span>
              <span class="dot dot-2"></span>
              <span class="dot dot-3"></span>
            </div>
            <p class="loading-message">
              Setting up amazing adventures for you!
            </p>
          </div>
        </v-col>
        <v-col v-for="n in 3" :key="n" cols="12" sm="6" md="4">
          <div class="loading-card shimmer-effect">
            <v-skeleton-loader
              type="card, article"
              class="skeleton-animated"
            ></v-skeleton-loader>
            <div class="loading-sparkle pulse-animation">✨</div>
          </div>
        </v-col>
      </v-row>

      <!-- Units Grid with Enhanced Cards -->
      <v-row
        v-if="!isLoading && units.length > 0"
        justify="center"
        align="stretch"
        class="units-grid"
      >
        <v-col
          v-for="(unit, index) in units"
          :key="unit.id"
          cols="12"
          sm="6"
          md="4"
          class="unit-col"
        >
          <div
            class="unit-card-wrapper"
            :style="{ '--animation-delay': `${index * 200}ms` }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 24 : 8"
                class="unit-card magic-card"
                :class="[
                  `unit-theme-${index % cardThemes.length}`,
                  { 'unit-card--hover': isHovering },
                ]"
                @click="selectUnit(unit.id)"
                @mouseenter="playHoverSound"
              >
                <!-- Card Glow Effect -->
                <div
                  class="card-glow"
                  :class="`glow-${index % cardThemes.length}`"
                ></div>

                <!-- Floating Elements on Card -->
                <div class="card-floaters">
                  <div class="floater star rotate-animation">⭐</div>
                  <div class="floater heart pulse-animation">💖</div>
                  <div class="floater magic float-animation">✨</div>
                </div>

                <!-- Unit Icon Section -->
                <div class="unit-icon-container">
                  <div
                    class="unit-icon-background"
                    :class="`bg-${index % cardThemes.length}`"
                  >
                    <div class="unit-icon bounce-hover">
                      {{ getUnitIcon(index) }}
                    </div>
                    <div class="icon-ring"></div>
                    <div class="icon-sparkles">
                      <span class="sparkle" v-for="n in 6" :key="n">✨</span>
                    </div>
                  </div>

                  <!-- Unit Number Badge -->
                  <div class="unit-number-badge">
                    <div class="badge-icon">📚</div>
                    <span class="badge-text">Unit {{ index + 1 }}</span>
                  </div>
                </div>

                <!-- Card Content -->
                <div class="card-content">
                  <!-- Unit Title -->
                  <v-card-title class="unit-title text-center">
                    <span class="title-icon">{{ getSubjectIcon(index) }}</span>
                    {{ unit.title }}
                  </v-card-title>

                  <!-- Unit Description -->
                  <v-card-text class="unit-description text-center">
                    <div class="description-text">
                      {{ unit.description || getDefaultDescription(index) }}
                    </div>

                    <!-- Learning Features -->
                    <div class="learning-features mt-3">
                      <div class="feature-item">
                        <span class="feature-icon">🎯</span>
                        <span class="feature-text">Interactive Lessons</span>
                      </div>
                      <div class="feature-item">
                        <span class="feature-icon">🎮</span>
                        <span class="feature-text">Fun Exercises</span>
                      </div>
                      <div class="feature-item">
                        <span class="feature-icon">🏆</span>
                        <span class="feature-text">Achievements</span>
                      </div>
                    </div>
                  </v-card-text>

                  <!-- Progress Section -->
                  <div class="unit-progress mb-4">
                    <div class="progress-label">🌟 Ready to Explore!</div>
                    <div class="progress-bar-container">
                      <div class="progress-bar rainbow-progress">
                        <div
                          class="progress-fill"
                          :style="{ width: getProgressWidth(index) }"
                        >
                          <div class="progress-shine"></div>
                        </div>
                      </div>
                      <div class="progress-percentage">
                        {{ getProgressPercentage(index) }}% Ready!
                      </div>
                    </div>
                  </div>

                  <!-- Action Button -->
                  <v-card-actions class="justify-center pa-4">
                    <v-btn
                      variant="elevated"
                      :color="getColorForUnit(index)"
                      class="explore-btn magic-btn"
                      size="large"
                      @click.stop="selectUnit(unit.id)"
                    >
                      <span class="btn-text">Explore Unit!</span>
                      <v-icon end class="btn-icon">mdi-compass</v-icon>
                      <div class="btn-sparkles">🌟✨🌟</div>
                    </v-btn>
                  </v-card-actions>
                </div>

                <!-- Hover Magic Effects -->
                <div v-if="isHovering" class="hover-effects">
                  <div
                    class="magic-particle"
                    v-for="n in 12"
                    :key="n"
                    :style="getParticleStyle(n)"
                  ></div>
                </div>
              </v-card>
            </v-hover>
          </div>
        </v-col>
      </v-row>

      <!-- Motivational Section -->
      <v-row justify="center" class="mt-16 mb-8">
        <v-col cols="12" md="10" lg="8" class="text-center">
          <div class="motivation-section">
            <div class="motivation-characters">
              <div class="main-character pulse-animation">🌟</div>
              <div class="supporting-characters">
                <span class="support-char char-1 float-animation">🎯</span>
                <span class="support-char char-2 bounce-animation">📚</span>
                <span class="support-char char-3 rotate-animation">🎨</span>
                <span class="support-char char-4 pulse-animation">🚀</span>
              </div>
            </div>

            <h3 class="motivation-title rainbow-text">
              You're Going to Learn Amazing Things!
            </h3>

            <p class="motivation-text">
              Each unit is carefully designed with exciting lessons, fun
              activities, and interactive exercises. Click on any unit above and
              start your incredible learning adventure!
            </p>

            <div class="motivation-badges">
              <div
                class="motivation-badge"
                v-for="(badge, idx) in motivationMessages"
                :key="idx"
              >
                <div class="badge-emoji bounce-on-hover">{{ badge.emoji }}</div>
                <div class="badge-message">{{ badge.message }}</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Success Celebration Overlay -->
    <div v-if="showCelebration" class="celebration-overlay">
      <div class="celebration-content">
        <div class="celebration-character bounce-in-scale">🎉</div>
        <h2 class="celebration-title rainbow-text">Great Choice!</h2>
        <p class="celebration-message">
          🚀 Get ready for an incredible learning journey filled with exciting
          lessons and fun activities!
        </p>
        <div class="celebration-stars">
          <span class="celebration-star" v-for="n in 5" :key="n">⭐</span>
        </div>
      </div>
      <!-- Confetti Animation -->
      <div class="confetti-container">
        <div
          class="confetti"
          v-for="n in 100"
          :key="n"
          :style="getConfettiStyle(n)"
        ></div>
      </div>
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
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/services/api.js";

// Props
const props = defineProps({
  courseId: [String, Number],
});

const router = useRouter();
const route = useRoute();

// State Management
const isLoading = ref(true);
const units = ref([]);
const showCelebration = ref(false);
const successMessages = ref([]);

// UI Data
const cardThemes = [
  { color: "teal-darken-2", gradient: "teal-ocean", icon: "🌊" },
  { color: "deep-purple-accent-3", gradient: "purple-magic", icon: "🔮" },
  { color: "amber-darken-3", gradient: "golden-sun", icon: "☀️" },
  { color: "pink-accent-2", gradient: "pink-flower", icon: "🌸" },
  { color: "blue-darken-2", gradient: "space-blue", icon: "🌌" },
  { color: "green-darken-2", gradient: "nature-green", icon: "🌳" },
];

const motivationMessages = [
  { emoji: "🎯", message: "Focus Master" },
  { emoji: "🧠", message: "Smart Learner" },
  { emoji: "💪", message: "Never Give Up" },
  { emoji: "🌟", message: "Future Star" },
  { emoji: "🎓", message: "Knowledge Seeker" },
];

// API Functions
const fetchUnits = async () => {
  isLoading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const response = await apiClient.get(
      `/api/EducationalContent/courses/${props.courseId}/units`
    );

    if (response.data && response.data.success) {
      units.value = response.data.data;
      playSuccessSound();
    } else {
      throw new Error(response.data.message || "Failed to retrieve units.");
    }
  } catch (error) {
    console.error("Error fetching units:", error);
    showError(
      "Our learning wizards are having a little trouble. Let's try again!"
    );
  } finally {
    isLoading.value = false;
  }
};

// Navigation
const selectUnit = async (unitId) => {
  playClickSound();
  showSuccessMessage("Excellent Choice! 🌟");

  // Show celebration
  showCelebration.value = true;

  // Navigate after celebration
  setTimeout(() => {
    showCelebration.value = false;
    router.push({
      name: "Lessons",
      params: {
        ...route.params,
        unitId: unitId,
      },
    });
  }, 3000);
};

// UI Helper Functions
const getUnitIcon = (index) => {
  const icons = ["📖", "🔬", "🎨", "🌍", "🎵", "💻", "⚽", "🎭"];
  return icons[index % icons.length];
};

const getSubjectIcon = (index) => {
  const icons = ["📚", "🧮", "🔬", "🌍", "🎨", "🎵", "💻", "🏃"];
  return icons[index % icons.length];
};

const getColorForUnit = (index) => cardThemes[index % cardThemes.length].color;

const getProgressWidth = (index) => {
  const widths = ["85%", "92%", "78%", "88%", "95%", "82%", "90%", "87%"];
  return widths[index % widths.length];
};

const getProgressPercentage = (index) => {
  const percentages = [85, 92, 78, 88, 95, 82, 90, 87];
  return percentages[index % percentages.length];
};

const getDefaultDescription = (index) => {
  const descriptions = [
    "Discover fascinating topics with interactive lessons!",
    "Explore exciting concepts through fun activities!",
    "Learn amazing new skills with engaging exercises!",
    "Unlock incredible knowledge with creative challenges!",
    "Master important concepts through playful learning!",
    "Build strong foundations with enjoyable lessons!",
  ];
  return descriptions[index % descriptions.length];
};

const getParticleStyle = (index) => {
  return {
    left: Math.random() * 100 + "%",
    top: Math.random() * 100 + "%",
    animationDelay: index * 100 + "ms",
  };
};

const getConfettiStyle = (index) => {
  const colors = [
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
  ];
  return {
    left: Math.random() * 100 + "%",
    backgroundColor: colors[index % colors.length],
    animationDelay: Math.random() * 3 + "s",
    animationDuration: Math.random() * 2 + 3 + "s",
  };
};

// Sound Effects
const playWelcomeSound = () => playSound("welcome");
const playHoverSound = () => playSound("hover");
const playClickSound = () => playSound("click");
const playSuccessSound = () => playSound("success");

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

// Success Messages
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

const showError = (message) => {
  // You can implement error display here
  console.error(message);
};

// Lifecycle
onMounted(async () => {
  await fetchUnits();
  await nextTick();
  animateUnitCards();
});

const animateUnitCards = () => {
  const cards = document.querySelectorAll(".unit-card-wrapper");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("animate-in");
    }, index * 200);
  });
};
</script>

<style scoped>
/* Base Styles */
.units-adventure-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: "Comic Neue", cursive;
}

/* Floating Background Elements */
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
.floating-shape.heart:nth-child(1) {
  top: 5%;
  left: 50%;
  animation-delay: -1s;
}
.floating-shape.heart:nth-child(2) {
  top: 70%;
  right: 20%;
  animation-delay: -3s;
}
.floating-shape.rocket:nth-child(1) {
  top: 30%;
  right: 5%;
  animation-delay: -5s;
}
.floating-shape.book:nth-child(1) {
  bottom: 10%;
  left: 30%;
  animation-delay: -7s;
}
.floating-shape.trophy:nth-child(1) {
  top: 40%;
  left: 40%;
  animation-delay: -9s;
}
.floating-shape.magic:nth-child(1) {
  top: 90%;
  left: 50%;
  animation-delay: -10s;
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

/* Hero Section */
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

/* Mascots */
.mascots-container {
  position: relative;
  z-index: 2;
  margin-bottom: 2rem;
}

.main-mascot {
  font-size: 6rem;
  cursor: pointer;
  display: inline-block;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.main-mascot:hover {
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

.mascot-friends {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.friend {
  position: absolute;
  font-size: 3rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.friend-1 {
  top: -80px;
  left: -100px;
}
.friend-2 {
  top: -60px;
  right: -80px;
}
.friend-3 {
  bottom: -70px;
  left: -90px;
}

.orbit-animation {
  animation: orbit 8s linear infinite;
}

@keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(60px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(60px) rotate(-360deg);
  }
}

.mascot-speech-bubble {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 20px;
  padding: 10px 20px;
  min-width: 250px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  color: #764ba2;
  font-weight: bold;
  font-size: 1.2rem;
  opacity: 0;
  animation: pulse-in 1s ease-in-out forwards 1.5s;
}

.mascot-speech-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 20px solid #fff;
}

@keyframes pulse-in {
  0% {
    transform: translateX(-50%) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

.bubble-sparkles {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  animation: sparkle-glow 1.5s ease-in-out infinite;
}

@keyframes sparkle-glow {
  0%,
  100% {
    text-shadow: 0 0 5px #fff, 0 0 10px #f093fb, 0 0 15px #f093fb;
  }
  50% {
    text-shadow: 0 0 10px #fff, 0 0 20px #f093fb, 0 0 30px #f093fb;
  }
}

/* Typography */
.hero-title {
  font-family: "Bungee", cursive;
  font-size: clamp(2rem, 6vw, 4.5rem);
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

.rainbow-text {
  background: linear-gradient(
    90deg,
    #ff6b6b,
    #feca57,
    #48dbfb,
    #1dd1a1,
    #ff6b6b
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: rainbow-anim 4s linear infinite;
}

@keyframes rainbow-anim {
  to {
    background-position: 200% center;
  }
}

.title-bounce {
  animation: title-bounce 1s ease-in-out forwards;
}

@keyframes title-bounce {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.hero-subtitle {
  font-family: "Poppins", sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: #fff;
  opacity: 0;
  animation: fade-in 1s ease-in-out forwards 1s;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-in-out forwards 1s;
}

/* Journey Progress */
.journey-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-family: "Bungee", cursive;
  color: #fff;
}

.progress-step {
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid #fff;
  background-color: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.progress-step.completed {
  background-color: #1dd1a1;
  border-color: #1dd1a1;
  color: #fff;
}

.progress-step.current {
  background-color: #feca57;
  border-color: #feca57;
  color: #fff;
  position: relative;
  z-index: 3;
}

.progress-arrow {
  font-size: 2rem;
  margin: 0 10px;
  color: #fff;
  opacity: 0.8;
}

.glow-effect {
  box-shadow: 0 0 10px #feca57, 0 0 20px #feca57, 0 0 30px #feca57;
}

.bounce-arrow {
  animation: bounce-arrow 1.5s ease-in-out infinite;
}

@keyframes bounce-arrow {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

/* Back Button */
.back-btn {
  font-family: "Bungee", cursive;
  letter-spacing: 1px;
}

.magic-btn {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.magic-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.btn-sparkles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.magic-btn:hover .btn-sparkles {
  animation: sparkle-in 0.5s ease-out forwards;
}

@keyframes sparkle-in {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Loading State */
.loading-mascot {
  position: relative;
  padding: 2rem;
}

.loading-character {
  font-size: 5rem;
  animation: spin-animation 2s linear infinite;
  display: inline-block;
}

@keyframes spin-animation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-family: "Bungee", cursive;
  margin-top: 1rem;
}

.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.dot {
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
  margin: 0 5px;
  animation: bounce-dots 1.2s infinite ease-in-out;
}

.dot-1 {
  animation-delay: 0s;
}
.dot-2 {
  animation-delay: 0.2s;
}
.dot-3 {
  animation-delay: 0.4s;
}

@keyframes bounce-dots {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.loading-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.shimmer-effect {
  background: #f0f0f0;
  background: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%);
  background-size: 200% 100%;
  animation: shimmer-anim 1.5s infinite;
}

@keyframes shimmer-anim {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.loading-sparkle {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  animation: pulse-animation 1.5s infinite;
}

@keyframes pulse-animation {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Units Grid and Cards */
.units-container {
  position: relative;
  z-index: 2;
}

.units-grid {
  margin-top: 2rem;
}

.unit-card-wrapper {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  animation: fade-in-up 0.6s ease-out forwards;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.unit-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.unit-card--hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.25);
}

.unit-theme-0 {
  background: #e0f7fa;
  color: #00796b;
}
.unit-theme-1 {
  background: #f3e5f5;
  color: #6a1b9a;
}
.unit-theme-2 {
  background: #fffde7;
  color: #ff8f00;
}
.unit-theme-3 {
  background: #fce4ec;
  color: #ad1457;
}
.unit-theme-4 {
  background: #e3f2fd;
  color: #1565c0;
}
.unit-theme-5 {
  background: #e8f5e9;
  color: #2e7d32;
}

.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.unit-card--hover .card-glow {
  opacity: 1;
  animation: card-glow-pulse 2s infinite ease-in-out;
}

.glow-0 {
  box-shadow: 0 0 30px 10px #4db6ac, 0 0 60px 20px #26a69a;
}
.glow-1 {
  box-shadow: 0 0 30px 10px #ba68c8, 0 0 60px 20px #8e24aa;
}
.glow-2 {
  box-shadow: 0 0 30px 10px #ffb300, 0 0 60px 20px #ff8f00;
}
.glow-3 {
  box-shadow: 0 0 30px 10px #f06292, 0 0 60px 20px #e91e63;
}
.glow-4 {
  box-shadow: 0 0 30px 10px #42a5f5, 0 0 60px 20px #1e88e5;
}
.glow-5 {
  box-shadow: 0 0 30px 10px #66bb6a, 0 0 60px 20px #43a047;
}

@keyframes card-glow-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 1;
  }
}

.card-floaters {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.floater {
  position: absolute;
  font-size: 2rem;
  opacity: 0.7;
}

.floater.star {
  top: 10%;
  right: 5%;
  animation: rotate-animation 8s linear infinite;
}
.floater.heart {
  bottom: 15%;
  left: 8%;
  animation: pulse-animation 2s infinite ease-in-out;
}
.floater.magic {
  top: 20%;
  left: 15%;
  animation: float-animation 5s ease-in-out infinite;
}

@keyframes rotate-animation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float-animation {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Unit Icon Section */
.unit-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 2rem;
  padding-bottom: 1rem;
}

.unit-icon-background {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.bg-0 {
  background-color: #4db6ac;
}
.bg-1 {
  background-color: #ba68c8;
}
.bg-2 {
  background-color: #ffb300;
}
.bg-3 {
  background-color: #f06292;
}
.bg-4 {
  background-color: #42a5f5;
}
.bg-5 {
  background-color: #66bb6a;
}

.unit-icon {
  font-size: 3.5rem;
  transition: transform 0.3s ease;
}

.unit-card:hover .unit-icon {
  transform: scale(1.1);
  animation: bounce-hover 0.8s infinite ease-in-out;
}

@keyframes bounce-hover {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.icon-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.5);
  animation: ring-pulse 2s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes ring-pulse {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

.icon-sparkles .sparkle {
  position: absolute;
  font-size: 1rem;
  animation: sparkle-float 1.5s infinite ease-in-out;
}

.icon-sparkles .sparkle:nth-child(1) {
  top: 5%;
  left: 20%;
  animation-delay: 0s;
}
.icon-sparkles .sparkle:nth-child(2) {
  top: 15%;
  right: 25%;
  animation-delay: 0.2s;
}
.icon-sparkles .sparkle:nth-child(3) {
  bottom: 10%;
  left: 30%;
  animation-delay: 0.4s;
}

@keyframes sparkle-float {
  0%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-5px);
    opacity: 0.8;
  }
}

.unit-number-badge {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  padding: 5px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  color: #764ba2;
}

.badge-icon {
  font-size: 1.2rem;
  margin-right: 5px;
}

/* Card Content */
.card-content {
  padding: 1.5rem 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.unit-title {
  font-family: "Bungee", cursive;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  line-height: 1.2;
}

.title-icon {
  margin-right: 10px;
  font-size: 1.5rem;
}

.unit-description {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.8;
  margin-top: 1rem;
  flex-grow: 1;
}

.learning-features {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: #555;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 5px 10px;
  border-radius: 15px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  margin-right: 5px;
}

/* Progress Section */
.unit-progress {
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  margin-top: 1rem;
}

.progress-label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #764ba2;
}

.progress-bar-container {
  position: relative;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 0 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48dbfb, #1dd1a1, #feca57, #ff6b6b);
  background-size: 200% auto;
  animation: rainbow-anim 4s linear infinite;
  transition: width 1s ease-in-out;
  position: relative;
}

.progress-shine {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 20%;
  background: rgba(255, 255, 255, 0.5);
  filter: blur(5px);
  animation: shine-effect 2s infinite linear;
}

@keyframes shine-effect {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(500%);
  }
}

.progress-percentage {
  font-size: 0.8rem;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  margin-top: 5px;
}

/* Action Button */
.explore-btn {
  font-family: "Bungee", cursive;
  letter-spacing: 1px;
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-icon {
  position: relative;
  z-index: 1;
}

/* Hover Magic Effects */
.hover-effects {
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
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 5px #fff, 0 0 10px #fff;
  animation: magic-float 1.5s ease-out forwards;
}

@keyframes magic-float {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.5) translate(var(--dx), var(--dy));
  }
}

/* Motivational Section */
.motivation-section {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.motivation-characters {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 1rem;
}

.main-character {
  font-size: 3rem;
  animation: pulse-animation 1.5s infinite;
}

.supporting-characters span {
  font-size: 1.5rem;
  display: inline-block;
  margin: 0 5px;
}

.motivation-title {
  font-family: "Bungee", cursive;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.motivation-text {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  color: #fff;
  opacity: 0.9;
  margin-top: 1rem;
}

.motivation-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 2rem;
}

.motivation-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.motivation-badge:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.4);
}

.badge-emoji {
  font-size: 1.5rem;
  margin-right: 8px;
}

.badge-message {
  font-weight: bold;
  color: #fff;
}

/* Celebration Overlay */
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: overlay-fade-in 0.5s ease;
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
  background: #fff;
  padding: 2rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 1;
}

.celebration-character {
  font-size: 5rem;
  animation: bounce-in-scale 1s ease-out;
}

@keyframes bounce-in-scale {
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
  font-family: "Bungee", cursive;
  font-size: clamp(2rem, 5vw, 3rem);
  margin-top: 1rem;
}

.celebration-message {
  font-family: "Poppins", sans-serif;
  font-size: 1.2rem;
  color: #555;
  margin-top: 1rem;
}

.celebration-stars {
  margin-top: 1rem;
  font-size: 1.5rem;
}

.celebration-star {
  display: inline-block;
  animation: star-spin 1s infinite ease-in-out;
}

.celebration-star:nth-child(2) {
  animation-delay: 0.2s;
}
.celebration-star:nth-child(3) {
  animation-delay: 0.4s;
}
.celebration-star:nth-child(4) {
  animation-delay: 0.6s;
}
.celebration-star:nth-child(5) {
  animation-delay: 0.8s;
}

@keyframes star-spin {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  transform: rotate(var(--rotation, 0deg));
  animation: confetti-fall 5s linear infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(120vh) rotate(360deg);
    opacity: 0.5;
  }
}

/* Success Messages */
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
  padding: 10px 20px;
  background-color: #ffeb3b;
  color: #333;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  animation: floating-message 3s ease-in-out forwards;
}

@keyframes floating-message {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  30% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -150%) scale(0.8);
    opacity: 0;
  }
}
</style>
