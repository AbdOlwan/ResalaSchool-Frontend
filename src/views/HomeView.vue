<template>
  <v-container fluid class="pa-0 home-page">
    <v-btn
      icon
      variant="flat"
      class="mute-button"
      @click="toggleMute"
      :color="isMuted ? 'grey' : 'white'"
      aria-label="Toggle Sound"
    >
      <v-icon color="primary">{{
        isMuted ? "mdi-volume-off" : "mdi-volume-high"
      }}</v-icon>
    </v-btn>

    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 3" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape rocket" v-for="n in 2" :key="'rocket-' + n">
        🚀
      </div>
    </div>

    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      min-height="600px"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="8">
          <div class="mascot-container">
            <div class="mascot" @click="playWelcomeSound" tabindex="0">🐻</div>
            <div class="mascot-speech-bubble">
              <span class="speech-text">Let's Learn Together!</span>
            </div>
          </div>

          <h1 class="hero-title static-text-color mb-4">
            Welcome to Your Learning Adventure!
          </h1>

          <p class="hero-subtitle animate-fade-in mb-8">
            Explore the Egyptian curriculum with fun lessons and activities at
            Resala Schools.
          </p>

          <v-btn
            color="amber"
            size="x-large"
            class="adventure-btn"
            elevation="12"
            @click="scrollToPhases"
            prepend-icon="mdi-rocket-launch"
          >
            <span class="btn-text">Start My Adventure!</span>
          </v-btn>

          <div class="achievement-preview mt-8">
            <div class="badge-container">
              <div class="badge-icon">🏆</div>
              <span class="badge-text">Future Learning Champion!</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <v-container id="phases-section" class="phases-container">
      <v-row justify="center" class="mb-8">
        <v-col cols="12" class="text-center">
          <div class="section-header">
            <h2 class="section-title bounce-in">Choose Your Learning Stage</h2>
            <div class="title-underline"></div>
            <p class="section-subtitle mt-4">
              Pick your stage to begin an exciting educational journey!
            </p>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="isLoading" justify="center">
        <v-col v-for="n in 3" :key="n" cols="12" sm="6" md="4">
          <v-skeleton-loader
            type="image, heading, paragraph, actions"
            class="skeleton-animated"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

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
                <v-btn @click="fetchPhases" color="primary" size="small"
                  >Try Again 🔄</v-btn
                >
              </template>
            </v-alert>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="!isLoading && !apiError" justify="center" align="stretch">
        <v-col
          v-for="(phase, index) in phases"
          :key="phase.id"
          cols="12"
          sm="6"
          md="4"
          class="d-flex"
        >
          <div
            class="phase-card-wrapper"
            :style="{ '--animation-delay': `${index * 150}ms` }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 16 : 6"
                class="phase-card"
                :class="{ 'phase-card--hover': isHovering }"
                @click="navigateToPhase(phase.id, phase.name)"
              >
                <div class="card-header" :class="`bg-${index % 3}`">
                  <div class="phase-icon">{{ getIconForPhase(index) }}</div>
                </div>
                <div class="card-content">
                  <v-card-title class="phase-title">{{
                    phase.name
                  }}</v-card-title>
                  <v-card-text class="phase-description">
                    Discover interactive lessons and fun challenges designed
                    just for you!
                  </v-card-text>
                  <v-card-actions class="card-actions">
                    <v-btn
                      variant="flat"
                      :color="getColorForPhase(index)"
                      class="explore-btn"
                      size="large"
                      block
                    >
                      <span>Let's Go</span>
                      <v-icon end>mdi-arrow-right-circle-outline</v-icon>
                    </v-btn>
                  </v-card-actions>
                </div>
              </v-card>
            </v-hover>
          </div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-12">
        <v-col cols="12" md="8" class="text-center">
          <div class="encouragement-section">
            <h3 class="encouragement-title">🌟 You're Going to Be Amazing!</h3>
            <p class="encouragement-text">
              Every great learner starts with a single step. Click on your stage
              and begin your incredible journey!
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
/* eslint-disable no-unused-vars */

import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/services/api.js";

// --- State Management ---
const phases = ref([]);
const isLoading = ref(true);
const apiError = ref(null);
const router = useRouter();

const isMuted = ref(false);
const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

// --- API Call ---
const fetchPhases = async () => {
  try {
    isLoading.value = true;
    apiError.value = null;
    const response = await apiClient.get("/api/EducationalContent/phases");
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
  window.scrollTo(0, 0);
  await fetchPhases();
  await nextTick();
  animatePhaseCards();
});

// --- Animation Functions ---
const animatePhaseCards = () => {
  const cards = document.querySelectorAll(".phase-card-wrapper");
  cards.forEach((card) => {
    card.classList.add("animate-in");
  });
};

// --- Navigation ---
const navigateToPhase = (phaseId, phaseName) => {
  playClickSound();
  console.log(`Navigating instantly to phase: ${phaseName} (ID: ${phaseId})`);
  router.push({ name: "Grades", params: { phaseId } });
};

// --- UI Helpers ---
const getIconForPhase = (index) => ["🌟", "📚", "🎨"][index % 3];
const getColorForPhase = (index) =>
  ["teal-darken-1", "deep-purple-accent-2", "amber-darken-3"][index % 3];
const scrollToPhases = () => {
  const element = document.getElementById("phases-section");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
    playClickSound();
  }
};

// --- Sound Effects ---
const playWelcomeSound = () => playSound("welcome");
const playSuccessSound = () => playSound("success");
const playClickSound = () => playSound("click");

const playSound = (type) => {
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
    console.warn("Web Audio API is not supported in this browser.");
  }
};
</script>

<style scoped>
/* --- UX REFINEMENT: Base Styles --- */
.home-page {
  /* Softer, more elegant gradient that's less harsh on the eyes. */
  background: linear-gradient(135deg, #7f8ff4 0%, #7e57c2 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: "Cairo", sans-serif;
}

.mute-button {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  border-radius: 50%;
}

/* --- UX REFINEMENT: Floating Background Elements --- */
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
  font-size: 1.5rem; /* Smaller size */
  animation: float-around 50s ease-in-out infinite; /* Slower animation */
  opacity: 0.4; /* More subtle opacity */
}
/* Adjusted positions for a less cluttered feel */
.floating-shape.star:nth-child(1) {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}
.floating-shape.star:nth-child(2) {
  top: 60%;
  right: 15%;
  animation-delay: -8s;
}
.floating-shape.rocket:nth-child(1) {
  top: 80%;
  left: 20%;
  animation-delay: -5s;
}

@keyframes float-around {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(8vw, -10vh) rotate(45deg);
  }
  50% {
    transform: translate(4vw, -18vh) rotate(90deg);
  }
  75% {
    transform: translate(-10vw, -8vh) rotate(135deg);
  }
}

/* --- UX REFINEMENT: Hero Section --- */
.hero-section {
  position: relative;
  /* Removed the extra gradient layer for a cleaner look that uses the page background. */
  background-color: transparent;
  padding: 0 16px; /* Added padding for mobile */
}

/* --- Mascot --- */
.mascot-container {
  position: relative;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  z-index: 2;
}

.mascot {
  /* Scaled down slightly for better balance */
  font-size: clamp(5rem, 15vw, 7rem);
  cursor: pointer;
  display: inline-block;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mascot:hover {
  transform: scale(1.1) rotate(5deg);
}

.mascot-speech-bubble {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  white-space: nowrap; /* Prevents text from wrapping on small screens */
}

.mascot-speech-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: white;
}

.mascot:hover + .mascot-speech-bubble {
  transform: translateX(-50%) translateY(-5px);
}

/* --- UX REFINEMENT: Typography --- */
.hero-title {
  font-family: "Bungee", cursive;
  /* Adjusted clamp for better readability on mobile. It scales down more gracefully. */
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: normal;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
}

/* Replaced distracting gradient with a high-contrast solid color for maximum readability. */
.static-text-color {
  color: #ffffff;
}

.hero-subtitle {
  /* Adjusted clamp for better mobile readability. */
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  line-height: 1.5;
  max-width: 600px; /* Constrains line length for readability */
  margin: 0 auto; /* Center the subtitle */
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

/* --- UX REFINEMENT: Adventure Button --- */
.adventure-btn {
  /* Simplified button style for a cleaner, modern look. */
  font-size: 1.2rem !important;
  font-weight: bold !important;
  border-radius: 28px !important;
  text-transform: none !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
}

.adventure-btn:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25) !important;
}

/* --- UX REFINEMENT: Achievement Preview --- */
.badge-container {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.badge-icon {
  font-size: 1.5rem;
  transition: transform 0.4s ease-in-out;
}
.badge-container:hover .badge-icon {
  transform: rotate(10deg) scale(1.15);
}

.badge-text {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  font-size: 0.9rem;
}

/* --- UX REFINEMENT: Phases Container --- */
.phases-container {
  background: #f4f6fc; /* Changed to a soft, clean background color. */
  border-radius: 30px 30px 0 0;
  padding: 50px 20px;
  margin-top: 30px;
  position: relative;
  z-index: 3;
}

/* --- Section Header --- */
.section-title {
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  font-weight: 700;
  color: #2c3e50; /* High contrast color for readability on the new background */
}
.title-underline {
  width: 100px;
  height: 5px;
  background: linear-gradient(90deg, #7f8ff4, #7e57c2);
  border-radius: 3px;
  margin: 12px auto;
}
.section-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  color: #546e7a;
  font-weight: 400;
  max-width: 500px;
  margin: 0 auto;
}

/* --- Loading & Error Cards --- */
.skeleton-animated {
  border-radius: 20px;
  background-color: #e0e0e0;
}
.error-character {
  font-size: 3rem;
  margin-bottom: 16px;
}
.custom-alert {
  border-radius: 16px;
  font-size: 1rem;
}

/* --- UX REFINEMENT: Complete Phase Card Redesign --- */
/* This is the core of the redesign to address the "too large" card issue. */
.phase-card-wrapper {
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  animation-delay: var(--animation-delay);
}

.phase-card-wrapper.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.phase-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border-radius: 20px !important;
  background-color: #ffffff !important;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 2px solid transparent;
}

.phase-card--hover {
  transform: translateY(-10px);
  border-color: #7f8ff4;
}

.card-header {
  height: 120px; /* Defined height for the header */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}
.phase-card--hover .card-header {
  transform: scale(1.05);
}
.bg-0 {
  background: linear-gradient(135deg, #4dd0e1, #26a69a);
}
.bg-1 {
  background: linear-gradient(135deg, #9575cd, #7e57c2);
}
.bg-2 {
  background: linear-gradient(135deg, #ffb74d, #f57c00);
}

.phase-icon {
  font-size: 3rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.card-content {
  padding: 20px;
  text-align: center;
  flex-grow: 1; /* Allows content to fill space */
  display: flex;
  flex-direction: column;
}

.phase-title {
  font-size: 1.5rem !important; /* Adjusted font size */
  font-weight: 700 !important;
  color: #2c3e50 !important;
  line-height: 1.2;
}

.phase-description {
  font-size: 0.95rem !important; /* Compact description font */
  color: #546e7a !important;
  line-height: 1.5 !important;
  margin-top: 8px;
  flex-grow: 1; /* Pushes button to the bottom */
}

.card-actions {
  padding: 0;
  margin-top: 20px;
}

.explore-btn {
  font-weight: bold !important;
  text-transform: none !important;
  border-radius: 12px !important;
}

/* --- Encouragement Section --- */
.encouragement-section {
  background: #ffffff;
  border-radius: 20px;
  padding: 30px 20px;
  border: 1px solid #e0e0e0;
}
.encouragement-title {
  font-size: clamp(1.4rem, 4vw, 1.8rem);
  color: #2c3e50;
  font-weight: 700;
}
.encouragement-text {
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  color: #546e7a;
  max-width: 600px;
  margin: 8px auto 0;
}

/* --- Accessibility --- */
.adventure-btn:focus-visible,
.explore-btn:focus-visible,
.phase-card:focus-visible,
.mascot:focus-visible {
  outline: 3px solid #00bfa5;
  outline-offset: 3px;
  border-radius: 8px;
}
</style>
