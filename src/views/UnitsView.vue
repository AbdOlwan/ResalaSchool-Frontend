<template>
  <v-container fluid class="pa-0 units-adventure-page">
    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 7" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape heart" v-for="n in 4" :key="'heart-' + n">
        💖
      </div>
      <div class="floating-shape rocket" v-for="n in 3" :key="'rocket-' + n">
        🚀
      </div>
      <div class="floating-shape book" v-for="n in 2" :key="'book-' + n">
        📚
      </div>
      <div class="floating-shape trophy" v-for="n in 2" :key="'trophy-' + n">
        🏆
      </div>
    </div>

    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      height="500"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="8">
          <div class="mascots-container mb-6">
            <div class="main-mascot" @click="playWelcomeSound">🦉</div>
            <div class="mascot-friends">
              <div class="friend friend-1" @click="playSound('click')">🦄</div>
              <div class="friend friend-2" @click="playSound('click')">🐸</div>
              <div class="friend friend-3" @click="playSound('click')">🦋</div>
            </div>
            <div class="mascot-speech-bubble">
              <span class="speech-text">Ready for Your Learning Units?</span>
              <div class="bubble-sparkles">✨💫✨</div>
            </div>
          </div>

          <h1 class="hero-title static-gradient-text mb-4 title-bounce">
            🌟 Course Learning Units! 🌟
          </h1>

          <p class="hero-subtitle animate-fade-in mb-6">
            🎯 Each unit is a new adventure filled with exciting lessons!
            <br />🌈 Choose your unit and discover amazing learning experiences!
          </p>

          <div class="journey-progress mb-4">
            <div class="progress-step completed">🏠 Home</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step completed">📚 Course</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step current glow-effect">📖 Units</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step">🎓 Lessons</div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <v-container class="units-container">
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

      <v-row v-if="isLoading" justify="center" class="my-8">
        <v-col cols="12" class="text-center mb-6">
          <div class="loading-mascot">
            <div class="loading-character spin-animation">🎪</div>
            <h3 class="loading-text static-gradient-text">
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
            <div class="loading-sparkle">✨</div>
          </div>
        </v-col>
      </v-row>

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
            :style="{ '--animation-delay': `${index * 150}ms` }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 24 : 8"
                class="unit-card"
                :class="[
                  `unit-theme-${index % cardThemes.length}`,
                  { 'unit-card--hover': isHovering },
                ]"
                @click="selectUnit(unit.id)"
                @mouseenter="playHoverSound"
              >
                <div
                  class="card-glow"
                  :class="`glow-${index % cardThemes.length}`"
                ></div>

                <div class="card-floaters">
                  <div class="floater star">⭐</div>
                  <div class="floater heart">💖</div>
                  <div class="floater magic">✨</div>
                </div>

                <div class="unit-icon-container">
                  <div
                    class="unit-icon-background"
                    :class="`bg-${index % cardThemes.length}`"
                  >
                    <div class="unit-icon">
                      {{ getUnitIcon(index) }}
                    </div>
                    <div class="icon-ring"></div>
                    <div class="icon-sparkles">
                      <span class="sparkle" v-for="n in 6" :key="n">✨</span>
                    </div>
                  </div>

                  <div class="unit-number-badge">
                    <div class="badge-icon">📚</div>
                    <span class="badge-text">Unit {{ index + 1 }}</span>
                  </div>
                </div>

                <div class="card-content">
                  <v-card-title class="unit-title text-center">
                    <span class="title-icon">{{ getSubjectIcon(index) }}</span>
                    {{ unit.title }}
                  </v-card-title>

                  <v-card-text class="unit-description text-center">
                    <div class="description-text">
                      {{ unit.description || getDefaultDescription(index) }}
                    </div>

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

                  <div class="unit-progress mb-4">
                    <div class="progress-label">🌟 Ready to Explore!</div>
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
                        {{ getProgressPercentage(index) }}% Ready!
                      </div>
                    </div>
                  </div>

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

      <v-row justify="center" class="mt-16 mb-8">
        <v-col cols="12" md="10" lg="8" class="text-center">
          <div class="motivation-section">
            <div class="motivation-characters">
              <div class="main-character">🌟</div>
              <div class="supporting-characters">
                <span class="support-char char-1">🎯</span>
                <span class="support-char char-2">📚</span>
                <span class="support-char char-3">🎨</span>
                <span class="support-char char-4">🚀</span>
              </div>
            </div>

            <h3 class="motivation-title static-gradient-text">
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
                <div class="badge-emoji">{{ badge.emoji }}</div>
                <div class="badge-message">{{ badge.message }}</div>
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
import { ref, onMounted, nextTick, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/services/api.js";

// --- STATE MANAGEMENT ---

// Props
const props = defineProps({
  courseId: [String, Number],
});

const router = useRouter();
const route = useRoute();

// Local State
const isLoading = ref(true);
const units = ref([]);
const successMessages = ref([]);

// New: Mock global sound state. In a real app, this would come from a Pinia/Vuex store.
const soundStore = reactive({
  isMuted: false, // Set to true to test mute functionality
});

// --- UI DATA ---

const cardThemes = [
  { color: "teal-darken-2" },
  { color: "deep-purple-accent-3" },
  { color: "amber-darken-3" },
  { color: "pink-accent-2" },
  { color: "blue-darken-2" },
  { color: "green-darken-2" },
];

const motivationMessages = [
  { emoji: "🎯", message: "Focus Master" },
  { emoji: "🧠", message: "Smart Learner" },
  { emoji: "💪", message: "Never Give Up" },
  { emoji: "🌟", message: "Future Star" },
  { emoji: "🎓", message: "Knowledge Seeker" },
];

// --- API FUNCTIONS ---

const fetchUnits = async () => {
  isLoading.value = true;
  try {
    // Simulate network delay for a better loading experience
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

// --- NAVIGATION ---

const selectUnit = (unitId) => {
  // CRITICAL CHANGE: Removed setTimeout and celebration overlay for instant navigation.
  // This provides immediate feedback to the user and respects their intent to navigate.
  playClickSound();
  showSuccessMessage("Let's Go! 🚀");

  router.push({
    name: "Lessons",
    params: {
      ...route.params,
      unitId: unitId,
    },
  });
};

// --- UI HELPER FUNCTIONS ---

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

const getParticleStyle = () => {
  // Use CSS variables for a cleaner animation definition in CSS
  return {
    "--dx": (Math.random() - 0.5) * 150 + "px",
    "--dy": (Math.random() - 0.5) * 150 + "px",
    left: Math.random() * 100 + "%",
    top: Math.random() * 100 + "%",
    animationDelay: Math.random() * 0.2 + "s",
  };
};

// --- SOUND EFFECTS ---

const playWelcomeSound = () => playSound("welcome");
const playHoverSound = () => playSound("hover");
const playClickSound = () => playSound("click");
const playSuccessSound = () => playSound("success");

const playSound = (type) => {
  // New: Check for global mute state before playing any sound.
  if (soundStore.isMuted) return;

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
    console.warn("Web Audio API is not supported in this browser.");
  }
};

// --- NOTIFICATIONS & MESSAGES ---

const showSuccessMessage = (text) => {
  const id = Date.now();
  const message = {
    id,
    text,
    style: {
      left: Math.random() * 80 + 10 + "%",
      top: Math.random() * 60 + 20 + "%",
    },
  };
  successMessages.value.push(message);
  setTimeout(() => {
    successMessages.value = successMessages.value.filter((m) => m.id !== id);
  }, 3000);
};

const showError = (message) => {
  console.error(message);
  // In a real app, you would use a dedicated notification component.
  showSuccessMessage("Oops! Something went wrong. 😕");
};

// --- LIFECYCLE HOOKS ---

onMounted(async () => {
  await fetchUnits();
  // Animate cards in after they are rendered
  await nextTick();
  const cards = document.querySelectorAll(".unit-card-wrapper");
  cards.forEach((card) => {
    card.classList.add("animate-in");
  });
});
</script>

<style scoped>
/* --- FONT & BASE STYLES --- */
.units-adventure-page {
  /* Primary Font: Changed to Cairo for readability */
  font-family: "Cairo", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* --- BACKGROUND ELEMENTS (REDUCED & SLOWED) --- */
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
  /* Animation slowed down significantly */
  animation: float-around 60s ease-in-out infinite;
  opacity: 0.4;
}
/* Staggered animations for variety */
.floating-shape:nth-child(odd) {
  animation-delay: -15s;
}
.floating-shape:nth-child(3n) {
  animation-delay: -30s;
}
.floating-shape:nth-child(4n) {
  animation-delay: -45s;
}

@keyframes float-around {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(20vw, -15vh) rotate(60deg) scale(1.1);
  }
  50% {
    transform: translate(5vw, 10vh) rotate(180deg) scale(0.9);
  }
  75% {
    transform: translate(-15vw, 15vh) rotate(270deg) scale(1.2);
  }
}

/* --- HERO SECTION --- */
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
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* --- MASCOTS (INTERACTION-BASED ANIMATION) --- */
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
  transform: scale(1.1);
  /* Animation now triggers on hover */
  animation: mascot-bounce 2s ease-in-out infinite;
}
@keyframes mascot-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: scale(1.1) translateY(0);
  }
  40% {
    transform: scale(1.1) translateY(-20px);
  }
  60% {
    transform: scale(1.1) translateY(-10px);
  }
}

.friend {
  position: absolute;
  font-size: 3rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.friend:hover {
  transform: scale(1.2) rotate(10deg);
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
  from {
    transform: translateX(-50%) scale(0.5);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

/* --- TYPOGRAPHY (NO RAINBOW, FONT RULES APPLIED) --- */
.hero-title {
  /* Headline Font: Bungee only for H1 */
  font-family: "Bungee", cursive;
  font-size: clamp(2rem, 6vw, 4.5rem);
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.15);
  letter-spacing: 2px;
}
/* New: Static gradient for readability, replaces animated .rainbow-text */
.static-gradient-text {
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
  background-position: 0% center; /* Static position */
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

/* --- JOURNEY PROGRESS --- */
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
}
.progress-step.completed {
  background-color: #1dd1a1;
  border-color: #1dd1a1;
}
.progress-step.current {
  background-color: #feca57;
  border-color: #feca57;
}
.progress-arrow {
  font-size: 2rem;
  margin: 0 10px;
  opacity: 0.8;
}
.glow-effect {
  box-shadow: 0 0 10px #feca57, 0 0 20px #feca57;
}

/* --- UI ELEMENTS --- */
.back-btn {
  font-weight: 700;
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

/* --- LOADING STATE --- */
.loading-text {
  /* No Bungee font here, use Cairo for readability */
  font-weight: 700;
  margin-top: 1rem;
}
.loading-dots .dot {
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
  margin: 0 5px;
  animation: bounce-dots 1.2s infinite ease-in-out;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
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
.shimmer-effect {
  background: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%);
  background-size: 200% 100%;
  animation: shimmer-anim 1.5s infinite;
}
@keyframes shimmer-anim {
  from {
    background-position: -200% 0;
  }
  to {
    background-position: 200% 0;
  }
}
.loading-sparkle {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  /* Looping animation is acceptable on loaders */
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

/* --- UNITS GRID & CARDS --- */
.units-container {
  position: relative;
  z-index: 2;
}
.unit-card-wrapper {
  opacity: 0;
  transform: translateY(20px);
  /* Use class for animation trigger */
}
.unit-card-wrapper.animate-in {
  animation: fade-in-up 0.6s ease-out forwards;
  animation-delay: var(--animation-delay);
}
@keyframes fade-in-up {
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
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.unit-card--hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.25);
}
/* Card Themes */
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

/* Card Effects */
.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
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
  box-shadow: 0 0 30px 10px #4db6ac;
}
.glow-1 {
  box-shadow: 0 0 30px 10px #ba68c8;
}
.glow-2 {
  box-shadow: 0 0 30px 10px #ffb300;
}
.glow-3 {
  box-shadow: 0 0 30px 10px #f06292;
}
.glow-4 {
  box-shadow: 0 0 30px 10px #42a5f5;
}
.glow-5 {
  box-shadow: 0 0 30px 10px #66bb6a;
}
@keyframes card-glow-pulse {
  50% {
    transform: scale(1.05);
  }
}

.floater {
  position: absolute;
  font-size: 2rem;
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.unit-card--hover .floater {
  opacity: 0.7;
}
.floater.star {
  top: 10%;
  right: 5%;
}
.unit-card--hover .floater.star {
  transform: rotate(45deg);
}
.floater.heart {
  bottom: 15%;
  left: 8%;
}
.unit-card--hover .floater.heart {
  transform: scale(1.2);
}
.floater.magic {
  top: 20%;
  left: 15%;
}
.unit-card--hover .floater.magic {
  transform: translateY(-10px);
}

/* Unit Icon */
.unit-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 2rem 0 1rem;
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
.unit-card--hover .unit-icon {
  animation: bounce-hover 0.8s infinite ease-in-out;
}
@keyframes bounce-hover {
  50% {
    transform: translateY(-5px);
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
  font-weight: bold;
  color: #764ba2;
}

/* Card Content */
.card-content {
  padding: 1.5rem 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.unit-title {
  /* No Bungee font, use Cairo for readability */
  font-weight: 700;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  line-height: 1.2;
}
.unit-description {
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.8;
  margin-top: 1rem;
  flex-grow: 1;
}
.feature-item {
  display: inline-flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 5px 10px;
  border-radius: 15px;
}
.feature-icon {
  margin-right: 5px;
}

/* Progress Section (Static Gradient) */
.unit-progress {
  text-align: center;
  font-weight: bold;
  margin-top: 1rem;
}
.progress-bar-container {
  height: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  overflow: hidden;
  margin: 0 1rem;
}
.progress-fill {
  height: 100%;
  /* No more animated rainbow, a static gradient is less distracting */
  background: linear-gradient(90deg, #48dbfb, #1dd1a1);
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
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(500%);
  }
}

/* Action Button */
.explore-btn {
  font-weight: 700; /* No Bungee font */
  letter-spacing: 1px;
}

/* Hover Magic Effects */
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

/* --- MOTIVATIONAL SECTION (INTERACTION-BASED ANIMATION) --- */
.motivation-section {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}
.main-character,
.support-char {
  transition: transform 0.3s ease;
  display: inline-block;
}
.main-character:hover {
  animation: pulse-animation 1s infinite;
}
.support-char:hover {
  transform: scale(1.4) rotate(15deg);
}
.motivation-title {
  /* No Bungee font */
  font-weight: 700;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}
.motivation-text {
  font-size: 1rem;
  color: #fff;
  opacity: 0.9;
  margin-top: 1rem;
}
.motivation-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 25px;
  transition: transform 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
}
.motivation-badge:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.4);
}

/* --- SUCCESS MESSAGES --- */
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
