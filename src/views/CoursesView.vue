<template>
  <v-container fluid class="pa-0 courses-adventure-page">
    <div class="floating-elements">
      <div
        v-for="shape in floatingShapes"
        :key="shape.id"
        class="floating-shape"
        :style="shape.style"
      >
        {{ shape.emoji }}
      </div>
    </div>

    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      min-height="550px"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="8">
          <div class="mascot-container mb-6">
            <div class="mascot-main" @click="playMascotSound">🦉</div>
            <div class="mascot-friends">
              <div class="friend friend-1 orbit-animation">🦄</div>
              <div class="friend friend-2 orbit-animation">🐸</div>
              <div class="friend friend-3 orbit-animation">🦋</div>
            </div>
            <div class="mascot-speech-bubble">
              <span class="speech-text">Choose Your Learning Adventure!</span>
              <div class="bubble-sparkles">✨💫✨</div>
            </div>
          </div>

          <h1 class="hero-title static-gradient-text mb-4 title-bounce">
            🌟 Explore Amazing Courses! 🌟
          </h1>

          <p class="hero-subtitle animate-fade-in mb-6">
            🎯 Every subject is a magical journey waiting for you!
            <br />🌈 Pick your favorite and start exploring wonderful lessons!
          </p>

          <div class="journey-progress mb-6">
            <div class="progress-step completed">🏠 Home</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step completed">📚 Grade Selected</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step current glow-effect">
              📖 Choose Course
            </div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step">🎓 Start Learning</div>
          </div>

          <div class="achievement-badges">
            <div
              class="badge-item"
              v-for="badge in achievementBadges"
              :key="badge.id"
            >
              <div class="badge-icon spin-on-hover">{{ badge.icon }}</div>
              <span class="badge-label">{{ badge.label }}</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <v-container class="courses-container">
      <v-row justify="center" class="mb-8">
        <v-col cols="12" class="text-center">
          <div class="section-header">
            <div class="encouragement-character bounce-in">🎨</div>
            <h2 class="section-title gradient-text">
              Ready to Become a Learning Superhero?
            </h2>
            <div class="title-underline static-underline"></div>
            <p class="section-subtitle mt-4">
              Each course is packed with fun activities, exciting games, and
              amazing discoveries!
            </p>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="isLoading" justify="center" class="my-8">
        <v-col cols="12" class="text-center mb-6">
          <div class="loading-mascot">
            <div class="loading-character spin-animation">🎪</div>
            <h3 class="loading-text static-gradient-text">
              Preparing Your Magical Classroom...
            </h3>
            <div class="loading-dots">
              <span class="dot dot-1"></span>
              <span class="dot dot-2"></span>
              <span class="dot dot-3"></span>
            </div>
            <p class="loading-message">
              Getting everything ready for your amazing adventure!
            </p>
          </div>
        </v-col>
        <v-col v-for="n in 4" :key="n" cols="12" sm="6" md="4" lg="3">
          <div class="loading-card shimmer-effect">
            <v-skeleton-loader
              type="card, article"
              class="skeleton-animated"
            ></v-skeleton-loader>
            <div class="loading-sparkle pulse-animation">✨</div>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="apiError" justify="center" class="my-8">
        <v-col cols="12" md="8">
          <div class="error-container">
            <div class="error-character shake-animation">😅</div>
            <div class="error-card">
              <h3 class="error-title">
                Oops! Our Learning Wizard Needs a Moment!
              </h3>
              <p class="error-message">{{ apiError }}</p>
              <p class="error-sub">
                Don't worry, we'll fix this faster than you can say "Adventure!"
              </p>
              <v-btn
                @click="fetchCourses"
                color="primary"
                size="large"
                class="retry-btn magic-btn"
                prepend-icon="mdi-refresh"
              >
                <span class="btn-text">Try the Magic Again!</span>
                <div class="btn-sparkles">✨</div>
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row
        v-if="!isLoading && !apiError && courses.length > 0"
        justify="center"
        align="stretch"
        class="courses-grid"
      >
        <v-col
          v-for="(course, index) in courses"
          :key="course.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="course-col d-flex"
        >
          <div
            class="course-card-wrapper"
            :style="{ '--animation-delay': `${index * 150}ms` }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 24 : 8"
                class="course-card magic-card d-flex flex-column"
                :class="[
                  `course-theme-${index % cardThemes.length}`,
                  { 'course-card--hover': isHovering },
                ]"
                @click="selectCourse(course.id)"
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

                <div class="course-image-container">
                  <v-img
                    class="course-image"
                    :src="course.imageUrl || generateCourseImage(index)"
                    :alt="`${course.title} Adventure`"
                    height="180px"
                    cover
                  >
                    <template v-slot:placeholder>
                      <v-skeleton-loader
                        type="image"
                        class="h-100"
                      ></v-skeleton-loader>
                    </template>
                    <div class="image-overlay">
                      <div class="course-level-badge">
                        <span class="level-icon">{{
                          getLevelIcon(index)
                        }}</span>
                        <span class="level-text">Level {{ index + 1 }}</span>
                      </div>
                    </div>
                  </v-img>

                  <div class="achievement-stars">
                    <span
                      class="star filled"
                      v-for="n in getStarCount(index)"
                      :key="`filled-${n}`"
                      >⭐</span
                    >
                    <span
                      class="star empty"
                      v-for="n in 5 - getStarCount(index)"
                      :key="`empty-${n}`"
                      >☆</span
                    >
                  </div>
                </div>

                <div class="card-content d-flex flex-column flex-grow-1">
                  <v-card-title class="course-title text-center">
                    <span class="title-icon">{{ getCourseIcon(index) }}</span>
                    {{ course.title }}
                  </v-card-title>

                  <v-card-text
                    class="course-description text-center flex-grow-1"
                  >
                    <div class="description-text">
                      {{ course.description || getDefaultDescription(index) }}
                    </div>

                    <div class="fun-facts mt-3">
                      <div class="fact-item">
                        <span class="fact-icon">🎮</span>
                        <span class="fact-text"
                          >{{ getRandomFacts().games }} Fun Games</span
                        >
                      </div>
                      <div class="fact-item">
                        <span class="fact-icon">🏆</span>
                        <span class="fact-text"
                          >{{ getRandomFacts().rewards }} Rewards</span
                        >
                      </div>
                    </div>
                  </v-card-text>

                  <div class="course-progress mt-auto mb-4">
                    <div class="progress-label">🌟 Ready for Adventure!</div>
                    <div class="progress-bar-container">
                      <div class="progress-bar static-progress">
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
                      :color="getColorForCourse(index)"
                      class="adventure-btn magic-btn"
                      size="large"
                      @click.stop="selectCourse(course.id)"
                    >
                      <span class="btn-text">Start Adventure!</span>
                      <v-icon end class="btn-icon">mdi-rocket-launch</v-icon>
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

      <v-row
        v-if="!isLoading && !apiError && courses.length === 0"
        justify="center"
      >
        <v-col cols="12" md="8" class="text-center">
          <div class="no-courses-container">
            <div class="no-courses-character">🔍</div>
            <h3 class="no-courses-title">No Adventures Found Yet!</h3>
            <p class="no-courses-message">
              Don't worry! New exciting courses are being prepared for you.
              <br />Come back soon for amazing learning adventures!
            </p>
            <v-btn
              @click="fetchCourses"
              color="primary"
              size="large"
              class="refresh-btn magic-btn"
            >
              <span>Check Again</span>
              <v-icon end>mdi-refresh</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-16 mb-8">
        <v-col cols="12" md="10" lg="8" class="text-center">
          <div class="motivation-section">
            <div class="motivation-characters">
              <div class="main-character">🌟</div>
              <div class="supporting-characters">
                <span class="support-char char-1">🦸</span>
                <span class="support-char char-2">🧙</span>
                <span class="support-char char-3">🎪</span>
                <span class="support-char char-4">🎨</span>
              </div>
            </div>

            <h3 class="motivation-title static-gradient-text">
              You're Going to Be AMAZING!
            </h3>

            <p class="motivation-text">
              Every great adventure starts with choosing your path. Each course
              is designed to make learning fun, exciting, and rewarding. Click
              on any course above and let's start your incredible journey
              together!
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
/* eslint-disable no-unused-vars */

import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/services/api.js";

// --- State Management for Mute Functionality ---
// This assumes you have a Pinia store setup like `stores/app.js`
// with a state property `isMuted: boolean`. This provides global mute control.
// Example: `export const useAppStore = defineStore('app', { state: () => ({ isMuted: false }) })`
// import { useAppStore } from "@/stores/app";
// const appStore = useAppStore();
// For demonstration purposes, a local ref is used here.
const isMuted = ref(false); // Replace with `appStore.isMuted`

const props = defineProps({
  phaseId: [Number, String],
  gradeId: [Number, String],
  termId: [Number, String],
});

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const apiError = ref(null);
const courses = ref([]);
const successMessages = ref([]);
const floatingShapes = ref([]);

const cardThemes = [
  { color: "teal-darken-2", gradient: "teal-ocean", icon: "🌊" },
  { color: "deep-purple-accent-3", gradient: "purple-magic", icon: "🔮" },
  { color: "amber-darken-3", gradient: "golden-sun", icon: "☀️" },
  { color: "pink-accent-2", gradient: "pink-flower", icon: "🌸" },
  { color: "blue-darken-2", gradient: "space-blue", icon: "🌌" },
  { color: "green-darken-2", gradient: "nature-green", icon: "🌳" },
];

const achievementBadges = [
  { id: 1, icon: "🏆", label: "Champion" },
  { id: 2, icon: "⭐", label: "Star Student" },
  { id: 3, icon: "🎯", label: "Goal Crusher" },
  { id: 4, icon: "🚀", label: "Explorer" },
];

const motivationMessages = [
  { emoji: "🎨", message: "Creative Genius" },
  { emoji: "🧠", message: "Smart Thinker" },
  { emoji: "💪", message: "Never Give Up" },
  { emoji: "🌟", message: "Born to Shine" },
  { emoji: "🎯", message: "Goal Achiever" },
];

const fetchCourses = async () => {
  isLoading.value = true;
  apiError.value = null;

  if (!props.gradeId || !props.termId) {
    apiError.value =
      "Oops! We need to know your grade and term to find the perfect courses for you!";
    isLoading.value = false;
    return;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const gradeId = props.gradeId;
    const termId = props.termId;

    const response = await apiClient.get(
      `/api/EducationalContent/courses?gradeId=${gradeId}&termId=${termId}`
    );

    if (response.data && response.data.success) {
      courses.value = response.data.data;
      playSuccessSound();
    } else {
      throw new Error(response.data.message || "Failed to retrieve courses.");
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    apiError.value =
      "Our learning wizards are having a little trouble connecting. Let's try again!";
    playErrorSound();
  } finally {
    isLoading.value = false;
  }
};

// --- Navigation Refactor ---
// CRITICAL: Removed artificial setTimeout delay. Navigation is now instantaneous.
// The celebration overlay was removed as it created a fake waiting period.
// The ideal UX is for the *next* page ('Units') to show a loading/celebration
// screen while it fetches its own data, not to add a delay here.
const selectCourse = (courseId) => {
  playClickSound();
  showSuccessMessage("Amazing Choice! 🌟");

  router.push({
    name: "Units",
    params: {
      phaseId: props.phaseId,
      gradeId: props.gradeId,
      termId: props.termId,
      courseId: courseId,
    },
  });
};

const getCourseIcon = (index) => {
  const icons = ["📚", "🔬", "🎨", "🌍", "🎵", "💻", "🏃", "🎭"];
  return icons[index % icons.length];
};

const getLevelIcon = (index) => {
  const icons = ["🏅", "💎", "👑", "🌟", "🚀", "⚡"];
  return icons[index % icons.length];
};

const getColorForCourse = (index) =>
  cardThemes[index % cardThemes.length].color;

const getProgressWidth = (index) => {
  const widths = ["85%", "92%", "78%", "88%", "95%", "82%", "90%", "87%"];
  return widths[index % widths.length];
};

const getProgressPercentage = (index) => {
  const percentages = [85, 92, 78, 88, 95, 82, 90, 87];
  return percentages[index % percentages.length];
};

const getStarCount = (index) => {
  const stars = [4, 5, 3, 4, 5, 4, 5, 3];
  return stars[index % stars.length];
};

const generateCourseImage = (index) => {
  const colors = ["4CAF50", "2196F3", "FF9800", "E91E63", "9C27B0", "00BCD4"];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/400x250/${color}/ffffff?text=Course+${
    index + 1
  }`;
};

const getDefaultDescription = (index) => {
  const descriptions = [
    "Embark on an exciting journey of discovery and fun!",
    "Unlock amazing adventures with interactive lessons!",
    "Explore, learn, and play in this magical course!",
    "Get ready for mind-blowing activities and games!",
    "Adventure awaits with surprises at every turn!",
    "Discover incredible secrets and master new skills!",
  ];
  return descriptions[index % descriptions.length];
};

const getRandomFacts = () => {
  return {
    games: Math.floor(Math.random() * 10) + 15,
    rewards: Math.floor(Math.random() * 5) + 8,
  };
};

const getParticleStyle = (index) => {
  return {
    left: Math.random() * 100 + "%",
    top: Math.random() * 100 + "%",
    animationDelay: index * 100 + "ms",
  };
};

// --- Sound Effects with Mute Check ---
// Refactored: Added a check for the global `isMuted` state at the start of the function.
const playSound = (type) => {
  // Logic Change: Check if sound is muted before playing anything.
  if (isMuted.value) return;

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

const playMascotSound = () => playSound("welcome");
const playHoverSound = () => playSound("hover");
const playClickSound = () => playSound("click");
const playSuccessSound = () => playSound("success");
const playErrorSound = () => playSound("error");

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

onMounted(async () => {
  generateFloatingShapes();
  await fetchCourses();
  await nextTick();
  animateCourseCards();
});

const animateCourseCards = () => {
  const cards = document.querySelectorAll(".course-card-wrapper");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("animate-in");
    }, index * 150);
  });
};

// --- Animation Refactor ---
// Reduced shape count from 30 to 8 and increased animation duration
// for a calmer, less visually cluttered background.
const generateFloatingShapes = () => {
  const emojis = ["⭐", "💖", "🚀", "📚", "🏆", "✨"];
  const shapes = [];
  for (let i = 0; i < 8; i++) {
    shapes.push({
      id: `shape-${i}`,
      emoji: emojis[i % emojis.length],
      style: {
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        fontSize: `${Math.random() * 1.5 + 0.5}rem`,
        animationDuration: `${Math.random() * 25 + 20}s`, // Slower: 20s to 45s
        animationDelay: `${Math.random() * 20}s`,
      },
    });
  }
  floatingShapes.value = shapes;
};
</script>

<style scoped>
/* General Page Setup & Font Change */
.courses-adventure-page {
  position: relative;
  overflow-x: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  /* Refactored: Main font is now Cairo for readability */
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
  z-index: 0;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  opacity: 0;
  animation: float-up linear infinite;
}

@keyframes float-up {
  0% {
    transform: translateY(10vh);
    opacity: 0;
  }
  10%,
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-20vh) rotate(360deg);
    opacity: 0;
  }
}

/* --- Hero Section --- */
.hero-section {
  position: relative;
  z-index: 2;
  padding: 50px 0;
}

.mascot-container {
  position: relative;
  display: inline-block;
}
.mascot-main {
  font-size: 7rem;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}
/* Refactored: Looping bounce animation replaced with hover effect */
.mascot-main:hover {
  transform: translateY(-10px) rotate(5deg);
}

.mascot-friends .friend {
  position: absolute;
  font-size: 2rem;
}
.friend-1 {
  top: 0;
  left: -40px;
  animation-duration: 12s; /* Slower */
}
.friend-2 {
  top: 50%;
  left: -60px;
  animation-duration: 18s; /* Slower */
}
.friend-3 {
  bottom: 0;
  left: -30px;
  animation-duration: 15s; /* Slower */
}

/* Refactored: Slowed down orbit animation */
@keyframes orbit-animation {
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
  transform: translateX(-50%);
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
  50% {
    text-shadow: 0 0 10px #fff, 0 0 20px #f093fb, 0 0 30px #f093fb;
  }
}

.hero-title {
  /* Refactored: Bungee font is reserved for H1/major titles */
  font-family: "Bungee", cursive;
  font-size: clamp(2rem, 6vw, 4.5rem);
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

/* Refactored: Removed animated rainbow text, replaced with static gradient */
.static-gradient-text {
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  /* Font changed to Cairo */
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

/* Journey Progress */
.journey-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.progress-step {
  padding: 8px 16px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  font-weight: bold;
  font-size: clamp(0.8rem, 2vw, 1rem);
}
.progress-step.completed {
  background-color: #1dd1a1;
  transform: scale(1.05);
}
.progress-step.current {
  background-color: #feca57;
  color: #333;
}
.glow-effect {
  animation: glow 1.5s ease-in-out infinite alternate;
}
@keyframes glow {
  from {
    box-shadow: 0 0 5px #feca57;
  }
  to {
    box-shadow: 0 0 20px #feca57;
  }
}
.progress-arrow {
  color: #fff;
  font-size: 1.5rem;
}

/* Achievement Badges */
.achievement-badges {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}

.badge-icon {
  font-size: clamp(2rem, 5vw, 3.5rem);
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

/* Refactored: Spin animation only on hover */
.spin-on-hover:hover {
  animation: spin 0.8s ease-in-out;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.badge-label {
  margin-top: 5px;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  font-weight: bold;
}

/* --- Main Content --- */
.courses-container {
  position: relative;
  z-index: 2;
  background-color: #f4f6fc;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
}

.section-header {
  margin-top: -80px;
  position: relative;
  background-color: #fff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  z-index: 5;
  border: 4px solid #feca57;
}

.section-title {
  font-family: "Bungee", cursive;
  font-size: clamp(1.8rem, 5vw, 3rem);
  margin-bottom: 10px;
}

.gradient-text {
  background: linear-gradient(90deg, #ff6b6b, #48dbfb, #1dd1a1, #feca57);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-underline {
  width: 100px;
  height: 6px;
  margin: 0 auto;
  border-radius: 3px;
}

/* Refactored: Replaced animated underline with static gradient */
.static-underline {
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1);
}

.section-subtitle {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: #555;
}

.encouragement-character {
  font-size: 3rem;
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%) scale(1);
  background: #fff;
  padding: 5px 15px;
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  animation: bounce-in 1s ease-in-out;
}

@keyframes bounce-in {
  0% {
    transform: translateX(-50%) scale(0);
  }
  60% {
    transform: translateX(-50%) scale(1.2);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}

/* --- Loading & Error States --- */
.loading-character {
  font-size: 4rem;
  animation: spin-and-pulse 2s linear infinite;
}
@keyframes spin-and-pulse {
  50% {
    transform: rotate(180deg) scale(1.1);
  }
}
.loading-text {
  font-size: 2rem;
  font-weight: bold;
}
.dot {
  width: 10px;
  height: 10px;
  background-color: #764ba2;
  border-radius: 50%;
  animation: dot-pulse 1.5s ease-in-out infinite;
}
.dot-2 {
  animation-delay: 0.2s;
}
.dot-3 {
  animation-delay: 0.4s;
}
@keyframes dot-pulse {
  50% {
    transform: scale(1.5);
  }
}
.loading-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}
.shimmer-effect::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  to {
    left: 100%;
  }
}
.error-character {
  font-size: 5rem;
  animation: shake 0.5s infinite alternate;
}
@keyframes shake {
  to {
    transform: rotate(5deg);
  }
}
.error-card {
  background-color: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-top: -30px;
  border: 4px solid #ff6b6b;
}
.error-title {
  font-family: "Bungee", cursive;
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #ff6b6b;
}
.magic-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* --- Courses Grid --- */
.course-card-wrapper {
  transform: translateY(20px);
  opacity: 0;
  animation: slide-up 0.6s ease-out forwards var(--animation-delay);
  width: 100%;
}
@keyframes slide-up {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.course-card {
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  border: 3px solid transparent;
  width: 100%;
  height: 100%;
}
.course-card--hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2) !important;
}
.card-floaters {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}
.floater {
  position: absolute;
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.floater.star {
  top: 20%;
  left: -10px;
}
.floater.heart {
  bottom: 60%;
  right: -15px;
}
.floater.magic {
  bottom: 20%;
  left: 0;
}
/* Refactored: Card floater animations now only trigger on parent hover */
.course-card--hover .floater {
  opacity: 1;
}
.course-card--hover .floater.star {
  transform: translateY(-10px) rotate(-15deg);
}
.course-card--hover .floater.heart {
  transform: translateY(-5px) scale(1.2);
}
.course-card--hover .floater.magic {
  transform: translateY(10px);
}
.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  filter: blur(40px);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.course-card:hover .card-glow {
  opacity: 0.5;
}
.glow-0 {
  background: #4ecdc4;
}
.glow-1 {
  background: #96ceb4;
}
.glow-2 {
  background: #ffeaa7;
}
.glow-3 {
  background: #f093fb;
}
.glow-4 {
  background: #667eea;
}
.glow-5 {
  background: #a4e698;
}

.course-image {
  transition: transform 0.5s ease;
}
.course-card--hover .course-image {
  transform: scale(1.1);
}
.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;
}
.course-card:hover .image-overlay {
  background: rgba(0, 0, 0, 0.4);
}
.course-level-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: bold;
  color: #333;
}
.achievement-stars {
  position: absolute;
  top: 10px;
  right: 10px;
}
.star.filled {
  color: #ffd700;
  text-shadow: 0 0 5px #ffcc00;
}
.star.empty {
  color: rgba(255, 255, 255, 0.6);
}
.course-title {
  font-family: "Bungee", cursive;
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  line-height: 1.2;
  white-space: normal;
  word-break: break-word;
  padding: 0;
  color: #333;
}
/* Refactored: Font changed to Cairo */
.course-description {
  color: #555;
  font-size: 0.9rem;
  margin-top: 10px;
}
.progress-bar {
  flex-grow: 1;
  height: 12px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}
/* Refactored: Replaced animated progress with static gradient */
.static-progress {
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1);
}
.adventure-btn {
  font-family: "Bungee", cursive;
  letter-spacing: 1px;
}

/* --- No Courses & Motivational --- */
.no-courses-container {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 20px;
  border: 4px dashed #feca57;
}
.no-courses-character {
  font-size: 4rem;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: default;
}
/* Refactored: Added hover effect instead of looping animation */
.no-courses-container:hover .no-courses-character {
  transform: translateY(-10px) rotate(-10deg);
}

.motivation-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 4px solid #1dd1a1;
  margin-top: 50px;
}

/* Refactored: Character animations now trigger on parent section hover */
.motivation-characters .main-character,
.motivation-characters .support-char {
  display: inline-block;
  transition: transform 0.3s ease-out;
}
.motivation-section:hover .main-character {
  transform: scale(1.2);
}
.motivation-section:hover .char-1 {
  transform: translateY(-10px);
}
.motivation-section:hover .char-2 {
  transform: rotate(15deg);
}
.motivation-section:hover .char-3 {
  transform: rotate(-15deg);
}
.motivation-section:hover .char-4 {
  transform: scale(1.1) translateY(5px);
}

.motivation-title {
  font-family: "Bungee", cursive;
  font-size: clamp(2rem, 5vw, 3rem);
}
.motivation-text {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #555;
}
.motivation-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}
.motivation-badge {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 15px;
  transition: transform 0.3s ease;
}
.motivation-badge:hover {
  transform: translateY(-5px);
}
/* Refactored: Added hover effect to emoji */
.motivation-badge .badge-emoji {
  transition: transform 0.3s ease;
}
.motivation-badge:hover .badge-emoji {
  transform: scale(1.3) rotate(10deg);
}

.badge-message {
  font-weight: bold;
  color: #764ba2;
}

.success-message {
  position: fixed; /* Changed from absolute to fixed */
  z-index: 1000; /* Ensure it's on top */
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  color: #1dd1a1;
  animation: fly-up-fade 3s forwards;
  pointer-events: none;
}
@keyframes fly-up-fade {
  to {
    transform: translateY(-100px);
    opacity: 0;
  }
}
</style>
