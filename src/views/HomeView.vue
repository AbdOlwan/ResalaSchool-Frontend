<template>
  <v-container fluid class="pa-0 home-page">
    <v-btn
      icon
      variant="flat"
      class="mute-button"
      @click="toggleMute"
      :color="isMuted ? 'red' : 'primary'"
      aria-label="Toggle Sound"
    >
      <v-icon>{{ isMuted ? "mdi-volume-off" : "mdi-volume-high" }}</v-icon>
    </v-btn>

    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 5" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape rocket" v-for="n in 3" :key="'rocket-' + n">
        🚀
      </div>
    </div>

    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      height="600"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="8">
          <div class="mascot-container">
            <div class="mascot" @click="playWelcomeSound" tabindex="0">🐻</div>
            <div class="mascot-speech-bubble">
              <span class="speech-text">Let's Learn Together!</span>
            </div>
          </div>

          <h1 class="hero-title static-gradient-text mb-4">
            Welcome to Your Amazing Learning Adventure!
          </h1>

          <p class="hero-subtitle animate-fade-in mb-6">
            🎯 Explore, learn, and have fun with Egyptian curriculum at Resala
            Schools!
            <br />🌟 Every lesson is a new adventure waiting for you!
          </p>

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

          <div class="achievement-preview mt-6">
            <div class="badge-container">
              <div class="badge-spin-on-hover">🏆</div>
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
            <h2 class="section-title bounce-in">
              🎭 Choose Your Learning Stage
            </h2>
            <div class="title-underline"></div>
            <p class="section-subtitle mt-4">
              Pick your stage and start your educational journey with fun and
              excitement!
            </p>
          </div>
        </v-col>
      </v-row>

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
                <div class="card-glow" :class="`glow-${index % 3}`"></div>
                <div class="card-content">
                  <div class="card-icon-section">
                    <div class="icon-background" :class="`bg-${index % 3}`">
                      <div class="phase-icon">{{ getIconForPhase(index) }}</div>
                    </div>
                    <div class="icon-sparkles">
                      <span class="sparkle" v-for="n in 4" :key="n">✨</span>
                    </div>
                  </div>
                  <v-card-title class="phase-title text-center">{{
                    phase.name
                  }}</v-card-title>
                  <v-card-text class="phase-description text-center">
                    🎨 Discover amazing lessons designed just for you!
                    <br />🎯 Interactive activities and fun challenges await!
                  </v-card-text>
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
                <div class="card-floaters">
                  <div class="floater star">⭐</div>
                  <div class="floater heart">💝</div>
                </div>
              </v-card>
            </v-hover>
          </div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-12">
        <v-col cols="12" md="8" class="text-center">
          <div class="encouragement-section">
            <h3 class="encouragement-title">
              🌟 You're Going to Be Amazing! 🌟
            </h3>
            <p class="encouragement-text">
              Every great learner starts with a single step. Click on your stage
              above and begin your incredible journey of discovery!
            </p>
            <div class="encouragement-icons">
              <span
                class="encourage-icon"
                v-for="icon in ['🎉', '🚀', '💫', '🏆', '🎯']"
                :key="icon"
                >{{ icon }}</span
              >
            </div>
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

// REFACTOR: Added mute state. In a real app, this would come from a global store like Pinia.
// e.g., import { useSettingsStore } from '@/stores/settings';
// const settings = useSettingsStore(); const { isMuted } = storeToRefs(settings);
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
// REFACTOR: CRITICAL CHANGE - Removed artificial setTimeout delay and celebration overlay for instant navigation.
// This creates a faster, more responsive user experience, adhering to the core principles.
const navigateToPhase = (phaseId, phaseName) => {
  playClickSound();
  console.log(`Navigating instantly to phase: ${phaseName} (ID: ${phaseId})`);
  router.push({ name: "Grades", params: { phaseId } });
};

// --- UI Helpers ---
const getIconForPhase = (index) => ["🌟", "📚", "🎨"][index % 3];
const getColorForPhase = (index) =>
  ["teal-darken-1", "deep-purple-accent-2", "amber-darken-3"][index % 3];
const getProgressWidth = (index) => ["85%", "92%", "78%"][index % 3];
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
  // REFACTOR: Added a check for the global 'isMuted' state before playing any sound.
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
/* --- Base Styles --- */
.home-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  /* REFACTOR: Implemented 'Cairo' as the primary font for readability. */
  font-family: "Cairo", sans-serif;
}

.mute-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  border-radius: 50%;
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
  /* REFACTOR: Slowed down animation significantly to reduce distraction. */
  animation: float-around 45s ease-in-out infinite;
  opacity: 0.5;
}

.floating-shape.star:nth-child(1) {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}
.floating-shape.star:nth-child(2) {
  top: 50%;
  right: 15%;
  animation-delay: -6s;
}
.floating-shape.star:nth-child(3) {
  bottom: 10%;
  right: 5%;
  animation-delay: -8s;
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
    rgba(102, 126, 234, 0.9) 0%,
    rgba(118, 75, 162, 0.9) 100%
  );
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
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mascot:hover {
  transform: scale(1.15) translateY(-10px);
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
  /* REFACTOR: Changed infinite bounce animation to an interaction-based one on hover for less distraction. */
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mascot:hover .mascot-speech-bubble {
  transform: translateX(-50%) translateY(-5px);
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

/* --- Typography --- */
.hero-title {
  /* REFACTOR: Applied 'Bungee' font for main page titles, as per requirements. */
  font-family: "Bungee", cursive;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: normal; /* Bungee has its own weight */
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  position: relative;
  z-index: 2;
}

/* REFACTOR: Replaced animated rainbow text with a static, high-contrast gradient for readability and performance. */
.static-gradient-text {
  background: linear-gradient(45deg, #ffd700, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

/* --- Achievement Preview --- */
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

.badge-spin-on-hover {
  font-size: 2rem;
  transition: transform 0.4s ease-in-out;
}
.badge-spin-on-hover:hover {
  transform: rotate(15deg) scale(1.2);
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
.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}
.title-underline {
  width: 120px;
  height: 6px;
  background: linear-gradient(90deg, #ffd700, #ff6b6b);
  border-radius: 3px;
  margin: 16px auto;
}
.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
}

/* --- Loading & Error Cards --- */
.loading-card,
.error-container {
  text-align: center;
}
.skeleton-animated {
  border-radius: 20px;
}
.error-character {
  font-size: 4rem;
  margin-bottom: 20px;
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
  transform: translateY(50px);
  transition: opacity 0.6s ease-out,
    transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.phase-card-wrapper.animate-in {
  opacity: 1;
  transform: translateY(0);
  animation-delay: var(--animation-delay);
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
}
.phase-card--hover {
  transform: translateY(-15px) scale(1.03);
  border-color: #ffd700;
}
.card-content {
  position: relative;
  z-index: 2;
  padding: 30px 20px;
}
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
.phase-title {
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  color: #2c3e50 !important;
}
.phase-description {
  font-size: 1.1rem !important;
  color: #546e7a !important;
  line-height: 1.5 !important;
}

/* --- Encouragement Section --- */
.encouragement-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  padding: 40px 30px;
  border: 2px solid rgba(255, 215, 0, 0.3);
}
.encouragement-title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  color: white;
  font-weight: 700;
}
.encouragement-text {
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: rgba(255, 255, 255, 0.9);
}
.encouragement-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.encourage-icon {
  font-size: 2.5rem;
  transition: transform 0.3s ease;
}
.encourage-icon:hover {
  transform: scale(1.3);
}

/* REFACTOR: Removed all styles for celebration overlay and confetti. */

/* --- Focus States for Accessibility --- */
.adventure-btn:focus-visible,
.explore-btn:focus-visible,
.phase-card:focus-visible,
.mascot:focus-visible {
  outline: 4px solid #4ecdc4;
  outline-offset: 4px;
}
</style>
