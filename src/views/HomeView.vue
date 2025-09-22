<template>
  <v-container fluid class="pa-0 home-page">
    <!-- Floating Background Elements -->
    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 8" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape heart" v-for="n in 6" :key="'heart-' + n">
        💖
      </div>
      <div class="floating-shape rainbow" v-for="n in 4" :key="'rainbow-' + n">
        🌈
      </div>
      <div class="floating-shape rocket" v-for="n in 3" :key="'rocket-' + n">
        🚀
      </div>
    </div>

    <!-- Hero Section -->
    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      height="600"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="8">
          <!-- Mascot Character -->
          <div class="mascot-container">
            <div class="mascot bounce-animation" @click="playWelcomeSound">
              🐻
            </div>
            <div class="mascot-speech-bubble">
              <span class="speech-text">Let's Learn Together!</span>
            </div>
          </div>

          <!-- Main Title -->
          <h1 class="hero-title gradient-text mb-4">
            Welcome to Your Amazing Learning Adventure!
          </h1>

          <!-- Subtitle with Animation -->
          <p class="hero-subtitle animate-fade-in mb-6">
            🎯 Explore, learn, and have fun with Egyptian curriculum at Resala
            Schools!
            <br />🌟 Every lesson is a new adventure waiting for you!
          </p>

          <!-- CTA Button with Animation -->
          <v-btn
            color="amber-lighten-2"
            size="x-large"
            class="adventure-btn mt-6"
            elevation="12"
            @click="scrollToPhases"
            prepend-icon="mdi-rocket-launch"
          >
            <span class="btn-text">Start My Adventure!</span>
            <div class="btn-sparkles">✨</div>
          </v-btn>

          <!-- Achievement Badge -->
          <div class="achievement-preview mt-6">
            <div class="badge-container">
              <div class="rotating-badge">🏆</div>
              <span class="badge-text">Future Learning Champion!</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Phases Section -->
    <v-container id="phases-section" class="phases-container">
      <!-- Section Header -->
      <v-row justify="center" class="mb-8">
        <v-col cols="12" class="text-center">
          <div class="section-header">
            <h2 class="section-title bounce-in">
              🎭 Choose Your Learning Stage
            </h2>
            <div class="title-underline"></div>
            <p class="section-subtitle mt-4">
              Pick your grade and start your educational journey with fun and
              excitement!
            </p>
          </div>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-row v-if="isLoading" justify="center">
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

      <!-- Error State -->
      <v-row v-if="apiError" justify="center">
        <v-col cols="12" md="8">
          <div class="error-container">
            <div class="error-character">😢</div>
            <v-alert
              type="error"
              title="Oops! Something went wrong"
              :text="apiError"
              variant="tonal"
              border="start"
              class="custom-alert"
            >
              <template v-slot:append>
                <v-btn @click="fetchPhases" color="primary" size="small">
                  Try Again 🔄
                </v-btn>
              </template>
            </v-alert>
          </div>
        </v-col>
      </v-row>

      <!-- Phase Cards -->
      <v-row v-if="!isLoading && !apiError" justify="center" align="stretch">
        <v-col
          v-for="(phase, index) in phases"
          :key="phase.id"
          cols="12"
          sm="6"
          md="4"
          class="phase-col"
        >
          <div
            class="phase-card-wrapper"
            :style="{ '--animation-delay': `${index * 150}ms` }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 24 : 8"
                class="phase-card"
                :class="{ 'phase-card--hover': isHovering }"
                @click="navigateToPhase(phase.id, phase.name)"
              >
                <!-- Card Glow Effect -->
                <div class="card-glow" :class="`glow-${index % 3}`"></div>

                <!-- Card Content -->
                <div class="card-content">
                  <!-- Icon Section -->
                  <div class="card-icon-section">
                    <div class="icon-background" :class="`bg-${index % 3}`">
                      <div class="phase-icon">{{ getIconForPhase(index) }}</div>
                    </div>
                    <div class="icon-sparkles">
                      <span class="sparkle" v-for="n in 4" :key="n">✨</span>
                    </div>
                  </div>

                  <!-- Title -->
                  <v-card-title class="phase-title text-center">
                    {{ phase.name }}
                  </v-card-title>

                  <!-- Description -->
                  <v-card-text class="phase-description text-center">
                    🎨 Discover amazing lessons designed just for you!
                    <br />🎯 Interactive activities and fun challenges await!
                  </v-card-text>

                  <!-- Progress Indicator -->
                  <div class="progress-section">
                    <div class="mini-progress">
                      <div class="progress-bar">
                        <div
                          class="progress-fill"
                          :style="{ width: getProgressWidth(index) }"
                        ></div>
                      </div>
                      <span class="progress-text">Ready to explore!</span>
                    </div>
                  </div>

                  <!-- Action Button -->
                  <v-card-actions class="justify-center pa-6">
                    <v-btn
                      variant="elevated"
                      :color="getColorForPhase(index)"
                      class="explore-btn"
                      size="large"
                    >
                      <span>Let's Go!</span>
                      <v-icon end>mdi-arrow-right-circle</v-icon>
                      <div class="btn-trail"></div>
                    </v-btn>
                  </v-card-actions>
                </div>

                <!-- Floating Elements on Card -->
                <div class="card-floaters">
                  <div class="floater star">⭐</div>
                  <div class="floater heart">💝</div>
                </div>
              </v-card>
            </v-hover>
          </div>
        </v-col>
      </v-row>

      <!-- Encouragement Section -->
      <v-row justify="center" class="mt-12">
        <v-col cols="12" md="8" class="text-center">
          <div class="encouragement-section">
            <h3 class="encouragement-title">
              🌟 You're Going to Be Amazing! 🌟
            </h3>
            <p class="encouragement-text">
              Every great learner starts with a single step. Click on your grade
              above and begin your incredible journey of discovery!
            </p>
            <div class="encouragement-icons">
              <span
                class="encourage-icon"
                v-for="icon in ['🎉', '🚀', '💫', '🏆', '🎯']"
                :key="icon"
              >
                {{ icon }}
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Success Celebration Overlay -->
    <div v-if="showCelebration" class="celebration-overlay">
      <div class="celebration-content">
        <div class="celebration-character">🎉</div>
        <h2 class="celebration-title">Great Choice!</h2>
        <p class="celebration-message">
          Get ready for an amazing learning adventure!
        </p>
      </div>
      <div class="confetti" v-for="n in 50" :key="n"></div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// --- State Management ---
const phases = ref([]);
const isLoading = ref(true);
const apiError = ref(null);
const showCelebration = ref(false);
const router = useRouter();

// --- API Call ---
const fetchPhases = async () => {
  try {
    isLoading.value = true;
    apiError.value = null;
    const response = await axios.get("/api/EducationalContent/phases");

    if (response.data && response.data.success) {
      phases.value = response.data.data;
    } else {
      throw new Error(
        response.data.message || "The data format from the API is incorrect."
      );
    }
  } catch (error) {
    console.error("API Error fetching phases:", error);
    apiError.value =
      "We couldn't connect to our servers to get the educational stages. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};

// --- Lifecycle Hook ---
onMounted(async () => {
  await fetchPhases();
  // Add stagger animation to phase cards
  await nextTick();
  animatePhaseCards();
});

// --- Animation Functions ---
const animatePhaseCards = () => {
  const cards = document.querySelectorAll(".phase-card-wrapper");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("animate-in");
    }, index * 150);
  });
};

// --- Navigation ---
const navigateToPhase = async (phaseId, phaseName) => {
  // Show celebration
  showCelebration.value = true;
  playSuccessSound();

  // Hide celebration and navigate after animation
  setTimeout(() => {
    showCelebration.value = false;
    console.log(`Navigating to phase: ${phaseName} (ID: ${phaseId})`);
    router.push({ name: "Grades", params: { phaseId } });
  }, 2000);
};

// --- UI Helpers ---
const getIconForPhase = (index) => {
  const icons = ["🌟", "📚", "🎨"];
  return icons[index % icons.length];
};

const getColorForPhase = (index) => {
  const colors = ["teal-darken-1", "deep-purple-accent-2", "amber-darken-3"];
  return colors[index % colors.length];
};

const getProgressWidth = (index) => {
  const widths = ["85%", "92%", "78%"];
  return widths[index % widths.length];
};

const scrollToPhases = () => {
  const element = document.getElementById("phases-section");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
    playClickSound();
  }
};

// --- Sound Effects ---
const playWelcomeSound = () => {
  playSound("welcome");
};

const playSuccessSound = () => {
  playSound("success");
};

const playClickSound = () => {
  playSound("click");
};

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
      case "success":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(
          1046.5,
          audioContext.currentTime + 0.3
        );
        break;
      case "click":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case "welcome":
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(
          880,
          audioContext.currentTime + 0.2
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
</script>

<style scoped>
/* --- Base Styles --- */
.home-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
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
  font-size: 2rem;
  animation: float-around 15s ease-in-out infinite;
  opacity: 0.6;
}

/* Random initial positions for the floating shapes */
.floating-shape.star:nth-child(1) {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}
.floating-shape.star:nth-child(2) {
  top: 30%;
  left: 25%;
  animation-delay: -2s;
}
.floating-shape.star:nth-child(3) {
  bottom: 20%;
  left: 40%;
  animation-delay: -4s;
}
.floating-shape.star:nth-child(4) {
  top: 50%;
  right: 15%;
  animation-delay: -6s;
}
.floating-shape.star:nth-child(5) {
  bottom: 10%;
  right: 5%;
  animation-delay: -8s;
}
.floating-shape.star:nth-child(6) {
  top: 20%;
  left: 60%;
  animation-delay: -10s;
}
.floating-shape.star:nth-child(7) {
  bottom: 50%;
  left: 75%;
  animation-delay: -12s;
}
.floating-shape.star:nth-child(8) {
  top: 80%;
  right: 30%;
  animation-delay: -14s;
}

.floating-shape.heart:nth-child(1) {
  top: 5%;
  left: 80%;
  animation-delay: -1s;
}
.floating-shape.heart:nth-child(2) {
  top: 40%;
  left: 50%;
  animation-delay: -5s;
}
.floating-shape.heart:nth-child(3) {
  bottom: 30%;
  left: 10%;
  animation-delay: -9s;
}
.floating-shape.heart:nth-child(4) {
  top: 70%;
  right: 20%;
  animation-delay: -13s;
}
.floating-shape.heart:nth-child(5) {
  top: 15%;
  left: 40%;
  animation-delay: -3s;
}
.floating-shape.heart:nth-child(6) {
  bottom: 5%;
  right: 50%;
  animation-delay: -7s;
}

.floating-shape.rainbow:nth-child(1) {
  top: 25%;
  left: 15%;
  animation-delay: -4s;
}
.floating-shape.rainbow:nth-child(2) {
  top: 60%;
  right: 10%;
  animation-delay: -8s;
}
.floating-shape.rainbow:nth-child(3) {
  bottom: 15%;
  left: 80%;
  animation-delay: -12s;
}
.floating-shape.rainbow:nth-child(4) {
  top: 5%;
  right: 5%;
  animation-delay: -15s;
}

.floating-shape.rocket:nth-child(1) {
  top: 80%;
  left: 20%;
  animation-delay: -6s;
}
.floating-shape.rocket:nth-child(2) {
  bottom: 25%;
  right: 30%;
  animation-delay: -10s;
}
.floating-shape.rocket:nth-child(3) {
  top: 35%;
  left: 70%;
  animation-delay: -14s;
}

@keyframes float-around {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(10vw, -10vh) rotate(90deg) scale(1.2);
  }
  50% {
    transform: translate(5vw, -20vh) rotate(180deg) scale(0.8);
  }
  75% {
    transform: translate(-10vw, -10vh) rotate(270deg) scale(1.1);
  }
}

/* --- Hero Section --- */
.hero-section {
  position: relative;
  background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.9) 0%,
      rgba(118, 75, 162, 0.9) 50%,
      rgba(240, 147, 251, 0.9) 100%
    ),
    radial-gradient(
      circle at 30% 40%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 193, 7, 0.1) 0%,
      transparent 50%
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
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    repeat;
}

/* --- Mascot --- */
.mascot-container {
  position: relative;
  margin-bottom: 2rem;
  z-index: 2;
}

.mascot {
  font-size: 8rem;
  cursor: pointer;
  display: inline-block;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.mascot:hover {
  transform: scale(1.1);
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
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 20px;
  border: 3px solid #ffd700;
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  animation: bubble-bounce 3s ease-in-out infinite;
}

.mascot-speech-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 10px solid transparent;
  border-top-color: #ffd700;
}

@keyframes bubble-bounce {
  0%,
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 0.8;
    transform: translateX(-50%) translateY(-5px);
  }
}

/* --- Typography --- */
.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
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
  font-weight: 500;
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

/* --- Adventure Button --- */
.adventure-btn {
  position: relative;
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%) !important;
  color: #333 !important;
  font-size: 1.4rem !important;
  font-weight: bold !important;
  padding: 20px 40px !important;
  border-radius: 50px !important;
  text-transform: none !important;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4) !important;
  transition: all 0.3s ease !important;
  overflow: hidden;
  z-index: 2;
}

.adventure-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 35px rgba(255, 215, 0, 0.6) !important;
}

.adventure-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: left 0.5s ease;
}

.adventure-btn:hover::before {
  left: 100%;
}

.btn-sparkles {
  position: absolute;
  top: -5px;
  right: -5px;
  animation: sparkle-rotate 2s linear infinite;
}

@keyframes sparkle-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* --- Achievement Preview --- */
.achievement-preview {
  z-index: 2;
  position: relative;
}

.badge-container {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px 24px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.rotating-badge {
  font-size: 2rem;
  animation: trophy-spin 3s ease-in-out infinite;
}

@keyframes trophy-spin {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(10deg) scale(1.1);
  }
}

.badge-text {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 1rem;
}

/* --- Phases Container --- */
.phases-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 40px 40px 0 0;
  padding: 60px 30px;
  margin-top: -40px;
  position: relative;
  z-index: 3;
}

/* --- Section Header --- */
.section-header {
  position: relative;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
}

.bounce-in {
  animation: bounce-in 1s ease-out;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(-50px) scale(0.8);
  }
  60% {
    opacity: 1;
    transform: translateY(10px) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.title-underline {
  width: 120px;
  height: 6px;
  background: linear-gradient(90deg, #ffd700, #ff6b6b, #4ecdc4);
  border-radius: 3px;
  margin: 16px auto;
  animation: underline-grow 1.5s ease-out;
}

@keyframes underline-grow {
  from {
    width: 0;
  }
  to {
    width: 120px;
  }
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
}

/* --- Loading Cards --- */
.loading-card {
  position: relative;
}

.skeleton-animated {
  border-radius: 20px;
  overflow: hidden;
}

.loading-sparkle {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  animation: sparkle-pulse 1.5s ease-in-out infinite;
}

@keyframes sparkle-pulse {
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

/* --- Error Container --- */
.error-container {
  text-align: center;
}

.error-character {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: sad-bounce 2s ease-in-out infinite;
}

@keyframes sad-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.custom-alert {
  border-radius: 20px;
  font-size: 1.1rem;
}

/* --- Phase Cards --- */
.phase-col {
  display: flex;
}

.phase-card-wrapper {
  width: 100%;
  opacity: 0;
  transform: translateY(50px) scale(0.8);
  transition: all 0.6s ease;
  animation-delay: var(--animation-delay);
}

.phase-card-wrapper.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.phase-card {
  height: 100%;
  border-radius: 25px !important;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 100%
  ) !important;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.phase-card--hover {
  transform: translateY(-15px) scale(1.03);
  border-color: #ffd700;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  opacity: 0;
  border-radius: 50%;
  transition: opacity 0.4s ease;
}

.glow-0 {
  background: radial-gradient(
    circle,
    rgba(0, 188, 148, 0.2) 0%,
    transparent 70%
  );
}
.glow-1 {
  background: radial-gradient(
    circle,
    rgba(103, 58, 183, 0.2) 0%,
    transparent 70%
  );
}
.glow-2 {
  background: radial-gradient(
    circle,
    rgba(255, 152, 0, 0.2) 0%,
    transparent 70%
  );
}

.phase-card--hover .card-glow {
  opacity: 1;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 30px 20px;
}

/* --- Card Icon Section --- */
.card-icon-section {
  position: relative;
  margin-bottom: 20px;
}

.icon-background {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  transition: transform 0.3s ease;
}

.bg-0 {
  background: linear-gradient(135deg, #00bfa5, #26a69a);
}
.bg-1 {
  background: linear-gradient(135deg, #673ab7, #9c27b0);
}
.bg-2 {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.phase-card--hover .icon-background {
  transform: scale(1.1) rotate(5deg);
}

.phase-icon {
  font-size: 3.5rem;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2));
}

.icon-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 1rem;
  animation: sparkle-float 3s ease-in-out infinite;
  opacity: 0;
}

.sparkle:nth-child(1) {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}
.sparkle:nth-child(2) {
  top: 20%;
  right: 10%;
  animation-delay: 0.5s;
}
.sparkle:nth-child(3) {
  bottom: 20%;
  left: 20%;
  animation-delay: 1s;
}
.sparkle:nth-child(4) {
  bottom: 10%;
  right: 15%;
  animation-delay: 1.5s;
}

@keyframes sparkle-float {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) rotate(180deg);
  }
}

/* --- Phase Card Content --- */
.phase-title {
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  color: #2c3e50 !important;
  margin-bottom: 16px !important;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.phase-description {
  font-size: 1.1rem !important;
  color: #546e7a !important;
  line-height: 1.5 !important;
  margin-bottom: 20px !important;
}

/* --- Progress Section --- */
.progress-section {
  margin: 20px 0;
}

.mini-progress {
  text-align: center;
}

.progress-bar {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease;
  position: relative;
}

.progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
  animation: progress-shimmer 2s linear infinite;
}

@keyframes progress-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* --- Explore Button --- */
.explore-btn {
  position: relative;
  font-size: 1.2rem !important;
  font-weight: 600 !important;
  padding: 16px 32px !important;
  border-radius: 25px !important;
  text-transform: none !important;
  transition: all 0.3s ease !important;
  overflow: hidden;
}

.explore-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
  transform: translate(-50%, -50%);
}

.explore-btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-trail {
  position: absolute;
  top: 0;
  right: -50px;
  width: 50px;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: skewX(-20deg);
  transition: right 0.6s ease;
}

.explore-btn:hover .btn-trail {
  right: 100%;
}

/* --- Card Floaters --- */
.card-floaters {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.floater {
  position: absolute;
  font-size: 1.2rem;
  animation: card-float 4s ease-in-out infinite;
  opacity: 0.7;
}

.floater.star {
  top: 15%;
  right: 15%;
  animation-delay: 0s;
}

.floater.heart {
  bottom: 15%;
  left: 15%;
  animation-delay: 2s;
}

@keyframes card-float {
  0%,
  100% {
    opacity: 0.7;
    transform: translateY(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px) rotate(180deg);
  }
}

/* --- Encouragement Section --- */
.encouragement-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  padding: 40px 30px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  text-align: center;
}

.encouragement-title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  color: white;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
}

.encouragement-text {
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 24px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.encouragement-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.encourage-icon {
  font-size: 2.5rem;
  animation: encourage-bounce 2s ease-in-out infinite;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.encourage-icon:hover {
  transform: scale(1.3);
}

.encourage-icon:nth-child(1) {
  animation-delay: 0s;
}
.encourage-icon:nth-child(2) {
  animation-delay: 0.2s;
}
.encourage-icon:nth-child(3) {
  animation-delay: 0.4s;
}
.encourage-icon:nth-child(4) {
  animation-delay: 0.6s;
}
.encourage-icon:nth-child(5) {
  animation-delay: 0.8s;
}

@keyframes encourage-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0) scale(1);
  }
  40% {
    transform: translateY(-15px) scale(1.1);
  }
  60% {
    transform: translateY(-7px) scale(1.05);
  }
}

/* --- Celebration Overlay --- */
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: celebration-fade-in 0.5s ease;
}

@keyframes celebration-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.celebration-content {
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: celebration-bounce 0.6s ease;
  position: relative;
  z-index: 2;
}

@keyframes celebration-bounce {
  0% {
    transform: scale(0.3) translateY(-100px);
    opacity: 0;
  }
  60% {
    transform: scale(1.1) translateY(10px);
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.celebration-character {
  font-size: 6rem;
  margin-bottom: 20px;
  animation: celebration-spin 1s ease-in-out;
}

@keyframes celebration-spin {
  from {
    transform: rotate(0deg) scale(0.5);
  }
  to {
    transform: rotate(360deg) scale(1);
  }
}

.celebration-title {
  font-size: 3rem;
  color: #2c3e50;
  font-weight: 800;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.celebration-message {
  font-size: 1.5rem;
  color: #546e7a;
  font-weight: 500;
  margin-bottom: 0;
}

/* --- Confetti Animation --- */
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #ffd700;
  animation: confetti-fall 3s linear infinite;
}

.confetti:nth-child(2n) {
  background: #ff6b6b;
}
.confetti:nth-child(3n) {
  background: #4ecdc4;
}
.confetti:nth-child(4n) {
  background: #45b7d1;
}
.confetti:nth-child(5n) {
  background: #96ceb4;
}

.confetti:nth-child(odd) {
  animation-duration: 3.5s;
  animation-delay: -0.5s;
}

.confetti:nth-child(even) {
  animation-duration: 2.5s;
  animation-delay: -1s;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Generate random positions for confetti */
.confetti:nth-child(1) {
  left: 5%;
}
.confetti:nth-child(2) {
  left: 15%;
  animation-delay: -1.2s;
}
.confetti:nth-child(3) {
  left: 25%;
  animation-delay: -2s;
}
.confetti:nth-child(4) {
  left: 35%;
  animation-delay: -0.8s;
}
.confetti:nth-child(5) {
  left: 45%;
  animation-delay: -2.5s;
}
.confetti:nth-child(6) {
  left: 55%;
  animation-delay: -1.5s;
}
.confetti:nth-child(7) {
  left: 65%;
  animation-delay: -0.5s;
}
.confetti:nth-child(8) {
  left: 75%;
  animation-delay: -2.2s;
}
.confetti:nth-child(9) {
  left: 85%;
  animation-delay: -1.8s;
}
.confetti:nth-child(10) {
  left: 95%;
  animation-delay: -2.8s;
}

/* --- Responsive Design --- */
@media (max-width: 960px) {
  .hero-section {
    height: 500px;
  }

  .mascot {
    font-size: 6rem;
  }

  .phases-container {
    padding: 40px 20px;
  }
}

@media (max-width: 600px) {
  .hero-section {
    height: 450px;
  }

  .mascot {
    font-size: 4rem;
  }

  .mascot-speech-bubble {
    font-size: 0.9rem;
    padding: 6px 12px;
  }

  .card-content {
    padding: 25px 15px;
  }

  .icon-background {
    width: 100px;
    height: 100px;
  }

  .phase-icon {
    font-size: 3rem;
  }

  .celebration-content {
    padding: 40px 30px;
    margin: 20px;
  }

  .celebration-character {
    font-size: 4rem;
  }

  .celebration-title {
    font-size: 2rem;
  }

  .celebration-message {
    font-size: 1.2rem;
  }

  .encouragement-icons {
    gap: 15px;
  }

  .encourage-icon {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .adventure-btn {
    padding: 16px 30px !important;
    font-size: 1.2rem !important;
  }

  .phases-container {
    padding: 30px 15px;
    border-radius: 25px 25px 0 0;
  }

  .encouragement-section {
    padding: 30px 20px;
    margin: 0 10px;
  }
}

/* --- Accessibility & Performance --- */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* --- Focus States for Accessibility --- */
.adventure-btn:focus,
.explore-btn:focus {
  outline: 3px solid #ffd700;
  outline-offset: 2px;
}

.phase-card:focus {
  outline: 3px solid #ffd700;
  outline-offset: 4px;
}

.mascot:focus {
  outline: 3px solid #ffd700;
  outline-offset: 4px;
  border-radius: 50%;
}

/* --- High Contrast Mode Support --- */
@media (prefers-contrast: high) {
  .hero-title {
    text-shadow: 3px 3px 0 #000;
  }

  .hero-subtitle {
    text-shadow: 2px 2px 0 #000;
  }

  .phase-card {
    border: 3px solid #000 !important;
  }
}
</style>
