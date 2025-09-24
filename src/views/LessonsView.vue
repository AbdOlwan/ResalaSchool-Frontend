<template>
  <v-container fluid class="pa-0 lessons-adventure-page">
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
      min-height="500px"
    >
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="8">
          <div class="mascots-container mb-6">
            <div class="main-mascot bounce-on-hover" @click="playWelcomeSound">
              📚
            </div>
            <div class="mascot-friends">
              <div
                class="friend friend-1 orbit-animation"
                @click="playSound('click')"
              >
                🎯
              </div>
              <div
                class="friend friend-2 orbit-animation"
                @click="playSound('click')"
              >
                ⭐
              </div>
              <div
                class="friend friend-3 orbit-animation"
                @click="playSound('click')"
              >
                🏆
              </div>
            </div>
            <div class="mascot-speech-bubble pulse-on-hover">
              <span class="speech-text">Let's Master These Lessons!</span>
              <div class="bubble-sparkles">✨💫✨</div>
            </div>
          </div>

          <h1 class="hero-title static-gradient-text mb-4 title-bounce">
            🌟 Your Learning Adventures Await! 🌟
          </h1>

          <p class="hero-subtitle animate-fade-in mb-6">
            🎯 Each lesson is a step closer to becoming a learning champion!
            <br />🚀 Complete lessons to unlock amazing achievements and
            rewards!
          </p>

          <div class="journey-progress mb-4">
            <div class="progress-step completed">🏠 Home</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step completed">📖 Course</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step completed">📚 Unit</div>
            <div class="progress-arrow">➜</div>
            <div class="progress-step current glow-effect">🎓 Lessons</div>
          </div>

          <div class="achievement-preview mb-4">
            <div class="achievement-item">
              <div class="achievement-icon spin-on-hover">🏆</div>
              <span class="achievement-text">Lesson Champion</span>
            </div>
            <div class="achievement-item">
              <div class="achievement-icon pulse-on-hover">⭐</div>
              <span class="achievement-text">Knowledge Master</span>
            </div>
            <div class="achievement-item">
              <div class="achievement-icon bounce-on-hover">🎯</div>
              <span class="achievement-text">Quick Learner</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <v-container class="lessons-container">
      <v-row justify="start" class="mb-4">
        <v-col cols="12">
          <v-btn
            @click="$router.go(-1)"
            color="deep-purple-accent-3"
            size="large"
            class="back-btn magic-btn"
            prepend-icon="mdi-arrow-left"
          >
            <span class="btn-text">Back to Units</span>
            <div class="btn-sparkles">🌟</div>
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="isLoading" justify="center" class="my-8">
        <v-col cols="12" class="text-center mb-6">
          <div class="loading-mascot">
            <div class="loading-character spin-animation">🎪</div>
            <h3 class="loading-text static-gradient-text">
              Loading Your Amazing Lessons...
            </h3>
            <div class="loading-dots">
              <span class="dot dot-1"></span>
              <span class="dot dot-2"></span>
              <span class="dot dot-3"></span>
            </div>
            <p class="loading-message">
              Preparing incredible learning adventures for you!
            </p>
          </div>
        </v-col>
        <v-col v-for="n in 4" :key="n" cols="12" md="6">
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
        v-if="!isLoading && lessons.length > 0"
        justify="center"
        align="stretch"
        class="lessons-grid"
      >
        <v-col
          v-for="(lesson, index) in lessons"
          :key="lesson.id"
          cols="12"
          md="6"
          class="lesson-col"
        >
          <div
            class="lesson-card-wrapper"
            :style="{ '--animation-delay': `${index * 150}ms` }"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 24 : 8"
                class="lesson-card magic-card"
                :class="[
                  `lesson-theme-${index % cardThemes.length}`,
                  { 'lesson-card--hover': isHovering },
                  { 'lesson-completed': isLessonCompleted(lesson) },
                ]"
                @click="viewLesson(lesson.id)"
                @mouseenter="playHoverSound"
              >
                <div
                  class="card-glow"
                  :class="`glow-${index % cardThemes.length}`"
                ></div>

                <div class="card-floaters">
                  <div class="floater star rotate-animation">⭐</div>
                  <div class="floater heart pulse-on-hover">💖</div>
                  <div class="floater magic float-animation">✨</div>
                </div>

                <div class="lesson-header">
                  <div class="lesson-number-badge">
                    <div class="badge-icon">📖</div>
                    <span class="badge-text">Lesson {{ index + 1 }}</span>
                  </div>

                  <div
                    class="completion-status"
                    v-if="isLessonCompleted(lesson)"
                  >
                    <div class="status-icon completed">✅</div>
                    <span class="status-text">Completed!</span>
                  </div>
                  <div class="completion-status" v-else>
                    <div class="status-icon pending">⏳</div>
                    <span class="status-text">Ready to Learn</span>
                  </div>
                </div>

                <div class="lesson-icon-container">
                  <div
                    class="lesson-icon-background"
                    :class="`bg-${index % cardThemes.length}`"
                  >
                    <div class="lesson-icon bounce-on-hover">
                      {{ getLessonIcon(index) }}
                    </div>
                    <div class="icon-ring"></div>
                    <div class="icon-sparkles">
                      <span class="sparkle" v-for="n in 6" :key="n">✨</span>
                    </div>
                  </div>
                </div>

                <div class="card-content">
                  <v-card-title class="lesson-title text-center">
                    <span class="title-icon">{{ getSubjectIcon(index) }}</span>
                    {{ lesson.title }}
                  </v-card-title>

                  <div class="lesson-progress mb-4">
                    <div class="progress-header">
                      <span class="progress-label">🎯 Your Progress</span>
                      <span class="progress-score">
                        {{ lesson.userScore }} / {{ lesson.exerciseCount }}
                      </span>
                    </div>
                    <div class="progress-bar-container">
                      <div class="progress-bar static-progress-gradient">
                        <div
                          class="progress-fill"
                          :style="{ width: getLessonProgressWidth(lesson) }"
                        >
                          <div class="progress-shine"></div>
                        </div>
                      </div>
                      <div class="progress-percentage">
                        {{ getLessonProgressPercentage(lesson) }}% Complete
                      </div>
                    </div>
                  </div>

                  <div class="lesson-features mb-4">
                    <div class="feature-item">
                      <span class="feature-icon">🎮</span>
                      <span class="feature-text">Interactive Exercises</span>
                    </div>
                    <div class="feature-item">
                      <span class="feature-icon">🎨</span>
                      <span class="feature-text">Fun Activities</span>
                    </div>
                    <div class="feature-item">
                      <span class="feature-icon">🏆</span>
                      <span class="feature-text">Earn Rewards</span>
                    </div>
                  </div>

                  <v-card-actions class="justify-center pa-4">
                    <v-btn
                      variant="elevated"
                      :color="getColorForLesson(index)"
                      class="lesson-btn magic-btn"
                      size="large"
                      @click.stop="viewLesson(lesson.id)"
                    >
                      <span class="btn-text">
                        {{
                          isLessonCompleted(lesson)
                            ? "Review Lesson!"
                            : "Start Learning!"
                        }}
                      </span>
                      <v-icon end class="btn-icon">
                        {{
                          isLessonCompleted(lesson)
                            ? "mdi-refresh"
                            : "mdi-play-circle"
                        }}
                      </v-icon>
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

                <div v-if="isLessonCompleted(lesson)" class="achievement-stars">
                  <span class="star filled" v-for="n in 3" :key="n">⭐</span>
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
              <div class="main-character pulse-on-hover">🌟</div>
              <div class="supporting-characters">
                <span class="support-char char-1 float-animation">📚</span>
                <span class="support-char char-2 bounce-on-hover">🎯</span>
                <span class="support-char char-3 rotate-on-hover">🏆</span>
                <span class="support-char char-4 pulse-on-hover">🚀</span>
              </div>
            </div>

            <h3 class="motivation-title static-gradient-text">
              Every Lesson Makes You Smarter!
            </h3>

            <p class="motivation-text">
              Each lesson is a stepping stone to success! Complete them all to
              become a true learning champion. Click on any lesson above and
              start your amazing journey of discovery!
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

// Props
const props = defineProps({
  unitId: [String, Number],
});

const router = useRouter();
const route = useRoute();

// State Management
const lessons = ref([]);
const isLoading = ref(true);
const successMessages = ref([]);
const floatingShapes = ref([]);

// REFACTOR: Assume a global state for sound settings (e.g., from Pinia/Vuex)
// This allows the entire app to respect the user's choice.
const isMuted = ref(false); // Example: replace with `const store = useSettingsStore(); const isMuted = store.isMuted;`

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
  { emoji: "🧠", message: "Smart Thinker" },
  { emoji: "💪", message: "Never Give Up" },
  { emoji: "🌟", message: "Future Star" },
  { emoji: "🎯", message: "Goal Achiever" },
  { emoji: "🚀", message: "Sky Rocket" },
];

// API Functions
const fetchLessons = async () => {
  isLoading.value = true;

  try {
    // Add loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Note: userId=1 is for testing only, will come from Vuex later
    const userId = 1;
    const response = await apiClient.get(
      `/api/EducationalContent/units/${props.unitId}/lessons?userId=${userId}`
    );

    if (response.data.success) {
      lessons.value = response.data.data;
      playSuccessSound();
    } else {
      throw new Error(response.data.message || "Failed to retrieve lessons.");
    }
  } catch (error) {
    console.error("Failed to fetch lessons:", error);
    showError("Our learning wizards are having trouble. Let's try again!");
  } finally {
    isLoading.value = false;
  }
};

// Navigation
const viewLesson = (lessonId) => {
  playClickSound();
  showSuccessMessage("Let's Learn Something Amazing! 🌟");

  // REFACTOR: Removed celebration overlay and artificial setTimeout delay.
  // Navigation is now instantaneous for a faster, better user experience.
  router.push({
    name: "LessonDetail",
    params: { ...route.params, lessonId },
  });
};

// UI Helper Functions
const getLessonIcon = (index) => {
  const icons = ["📖", "🔬", "🎨", "🌍", "🎵", "💻", "⚽", "🎭"];
  return icons[index % icons.length];
};

const getSubjectIcon = (index) => {
  const icons = ["📚", "🧮", "🔬", "🌍", "🎨", "🎵", "💻", "🏃"];
  return icons[index % icons.length];
};

const getColorForLesson = (index) =>
  cardThemes[index % cardThemes.length].color;

const isLessonCompleted = (lesson) => {
  return lesson.userScore >= lesson.exerciseCount;
};

const getLessonProgressWidth = (lesson) => {
  if (lesson.exerciseCount === 0) return "0%";
  const percentage = (lesson.userScore / lesson.exerciseCount) * 100;
  return `${Math.min(percentage, 100)}%`;
};

const getLessonProgressPercentage = (lesson) => {
  if (lesson.exerciseCount === 0) return 0;
  const percentage = Math.round(
    (lesson.userScore / lesson.exerciseCount) * 100
  );
  return Math.min(percentage, 100);
};

const getParticleStyle = (index) => {
  return {
    left: Math.random() * 100 + "%",
    top: Math.random() * 100 + "%",
    animationDelay: index * 100 + "ms",
  };
};

// Sound Effects
const playWelcomeSound = () => playSound("welcome");
const playHoverSound = () => playSound("hover");
const playClickSound = () => playSound("click");
const playSuccessSound = () => playSound("success");

const playSound = (type) => {
  // REFACTOR: Added a check for the global mute state before playing any sound.
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
  console.error(message);
  // You can implement error display here
};

// Lifecycle
onMounted(async () => {
  generateFloatingShapes();
  await fetchLessons();
  await nextTick();
  animateLessonCards();
});

// Animation Functions
const animateLessonCards = () => {
  const cards = document.querySelectorAll(".lesson-card-wrapper");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("animate-in");
    }, index * 150);
  });
};

const generateFloatingShapes = () => {
  const emojis = ["⭐", "💖", "🚀", "📚", "🏆", "✨"];
  const shapes = [];
  // REFACTOR: Reduced the number of floating elements from 25 to 8 to decrease visual clutter.
  for (let i = 0; i < 8; i++) {
    shapes.push({
      id: `shape-${i}`,
      emoji: emojis[i % emojis.length],
      style: {
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        fontSize: `${Math.random() * 1.5 + 0.5}rem`,
        // REFACTOR: Increased animation duration for slower, less distracting movement.
        animationDuration: `${Math.random() * 25 + 20}s`,
        animationDelay: `${Math.random() * 20}s`,
      },
    });
  }
  floatingShapes.value = shapes;
};
</script>

<style scoped>
/* Base Styles */
.lessons-adventure-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  /* REFACTOR: Changed primary font to Cairo for better readability. */
  font-family: "Cairo", sans-serif;
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
    opacity: 0.5; /* Reduced opacity */
  }
  100% {
    transform: translateY(-20vh) rotate(360deg);
    opacity: 0;
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

/* Mascots */
.mascots-container {
  position: relative;
  z-index: 2;
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

/* REFACTOR: Converted distracting continuous animations to interaction-based animations */
.bounce-on-hover:hover {
  animation: mascot-bounce 2s ease-in-out infinite;
}

.pulse-on-hover:hover {
  animation: pulse-anim 1.5s infinite ease-in-out;
}

.rotate-on-hover:hover {
  animation: spin-anim 4s linear infinite;
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
  font-size: 2.5rem;
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
  /* REFACTOR: Bungee font is now correctly scoped to only H1 titles. */
  font-family: "Bungee", cursive;
  font-size: clamp(2rem, 6vw, 4.5rem);
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

/* REFACTOR: Removed animated rainbow text for better readability and performance. */
.static-gradient-text {
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1);
  -webkit-background-clip: text;
  background-clip: text;
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
  /* REFACTOR: Changed Poppins to Cairo. */
  font-family: "Cairo", sans-serif;
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

/* Journey Progress Indicator */
.journey-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 50px;
  backdrop-filter: blur(5px);
}

.progress-step {
  color: #fff;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 30px;
  background: transparent;
  transition: all 0.3s ease;
}

.progress-step.completed {
  color: #e0e0e0;
}

.progress-step.current {
  background: #fff;
  color: #764ba2;
  box-shadow: 0 0 15px #fff, 0 0 25px #f093fb;
  transform: scale(1.1);
}

.glow-effect {
  animation: glow-effect-anim 2s infinite ease-in-out;
}

@keyframes glow-effect-anim {
  0%,
  100% {
    box-shadow: 0 0 15px #fff, 0 0 25px #f093fb;
  }
  50% {
    box-shadow: 0 0 25px #fff, 0 0 40px #f093fb;
  }
}

.progress-arrow {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Achievement Preview */
.achievement-preview {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
}

.achievement-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-weight: bold;
}

.achievement-icon {
  font-size: 3rem;
  transition: transform 0.3s ease;
}

.spin-on-hover:hover {
  transform: rotate(360deg) scale(1.2);
}

@keyframes pulse-anim {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

/* Main Content Container */
.lessons-container {
  position: relative;
  z-index: 10;
  padding-top: 2rem;
  padding-bottom: 4rem;
}

/* Back Button */
.magic-btn {
  border-radius: 50px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.magic-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.magic-btn .btn-sparkles {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: scale(0.5);
}

.magic-btn:hover .btn-sparkles {
  opacity: 1;
  transform: scale(1) rotate(15deg);
}

/* Loading State */
.loading-mascot {
  padding: 2rem;
}

.loading-character {
  font-size: 6rem;
  display: inline-block;
}

.spin-animation {
  animation: spin-anim 2s linear infinite;
}

@keyframes spin-anim {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 2rem;
  font-family: "Bungee", cursive;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 1rem 0;
}

.loading-dots .dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #fff;
  animation: dot-bounce 1.4s infinite ease-in-out both;
}

.dot-1 {
  animation-delay: -0.32s;
}
.dot-2 {
  animation-delay: -0.16s;
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.loading-message {
  font-size: 1.2rem;
  color: #eee;
}

.loading-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}

.shimmer-effect {
  position: relative;
  background: #2d3436;
  background-image: linear-gradient(
    to right,
    #2d3436 0%,
    #4a5255 20%,
    #2d3436 40%,
    #2d3436 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 300px;
  animation: shimmer 1.5s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.skeleton-animated {
  background: transparent !important;
}

.loading-sparkle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  color: #fff;
  opacity: 0.7;
}

/* Lessons Grid */
.lesson-card-wrapper {
  opacity: 0;
  transform: translateY(50px) scale(0.9);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.lesson-card-wrapper.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.magic-card {
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  border: 4px solid transparent;
  background-clip: padding-box;
  z-index: 1;
}

.lesson-card--hover {
  transform: translateY(-15px) rotate(2deg) scale(1.05);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
}

.lesson-completed {
  border-color: #4caf50;
  box-shadow: 0 0 20px #4caf50;
}

/* Card Themes */
.lesson-theme-0 {
  background: linear-gradient(135deg, #00796b, #004d40);
}
.lesson-theme-1 {
  background: linear-gradient(135deg, #7e57c2, #4527a0);
}
.lesson-theme-2 {
  background: linear-gradient(135deg, #ffb300, #e65100);
}
.lesson-theme-3 {
  background: linear-gradient(135deg, #ec407a, #c2185b);
}
.lesson-theme-4 {
  background: linear-gradient(135deg, #1e88e5, #0d47a1);
}
.lesson-theme-5 {
  background: linear-gradient(135deg, #43a047, #1b5e20);
}

/* Card Glow Effect */
.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 50%
  );
  transition: opacity 0.5s ease;
  opacity: 0;
  pointer-events: none;
  z-index: 2;
}
.lesson-card--hover .card-glow {
  opacity: 1;
  animation: rotate-glow 10s linear infinite;
}

@keyframes rotate-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Card Floaters */
.card-floaters {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.floater {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.7;
}
.floater.star {
  top: 10%;
  right: 15%;
}
.floater.heart {
  bottom: 15%;
  left: 10%;
}
.floater.magic {
  bottom: 25%;
  right: 10%;
}

.rotate-animation {
  animation: spin-anim 8s linear infinite reverse;
}
.float-animation {
  animation: float-anim 4s ease-in-out infinite;
}

@keyframes float-anim {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Lesson Header */
.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
}

.lesson-number-badge,
.completion-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.badge-icon,
.status-icon {
  font-size: 1.2rem;
}

/* Lesson Icon Section */
.lesson-icon-container {
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lesson-icon-background {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.bg-0 {
  background: #004d40;
}
.bg-1 {
  background: #4527a0;
}
.bg-2 {
  background: #e65100;
}
.bg-3 {
  background: #c2185b;
}
.bg-4 {
  background: #0d47a1;
}
.bg-5 {
  background: #1b5e20;
}

.lesson-icon {
  font-size: 4rem;
  transition: transform 0.3s ease;
}

.icon-ring {
  position: absolute;
  width: 120%;
  height: 120%;
  border: 3px dashed rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: spin-anim 20s linear infinite;
}

.icon-sparkles {
  position: absolute;
  width: 100%;
  height: 100%;
}
.icon-sparkles .sparkle {
  position: absolute;
  color: #fff;
  opacity: 0;
  animation: sparkle-out 2s infinite;
}
.lesson-card--hover .icon-sparkles .sparkle {
  opacity: 1;
}

.icon-sparkles .sparkle:nth-child(1) {
  top: 0;
  left: 50%;
  animation-delay: 0s;
}
.icon-sparkles .sparkle:nth-child(2) {
  top: 50%;
  right: 0;
  animation-delay: 0.3s;
}
.icon-sparkles .sparkle:nth-child(3) {
  bottom: 0;
  left: 50%;
  animation-delay: 0.6s;
}
.icon-sparkles .sparkle:nth-child(4) {
  top: 50%;
  left: 0;
  animation-delay: 0.9s;
}
.icon-sparkles .sparkle:nth-child(5) {
  top: 15%;
  left: 15%;
  animation-delay: 1.2s;
}
.icon-sparkles .sparkle:nth-child(6) {
  bottom: 15%;
  right: 15%;
  animation-delay: 1.5s;
}

@keyframes sparkle-out {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Card Content */
.card-content {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.lesson-title {
  font-family: "Bungee", cursive;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1.3;
  min-height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* Progress Section */
.lesson-progress {
  color: #fff;
}
.progress-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 8px;
}

.progress-bar-container {
  position: relative;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.progress-fill {
  height: 100%;
  border-radius: 20px;
  transition: width 0.5s ease-in-out;
  position: relative;
}

.static-progress-gradient .progress-fill {
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1);
}

.progress-shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shine-anim 2s infinite;
}

@keyframes shine-anim {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-weight: bold;
  font-size: 0.8rem;
  text-shadow: 1px 1px 1px #fff;
}

/* Lesson Features */
.lesson-features {
  display: flex;
  justify-content: space-around;
  color: #ddd;
  text-align: center;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.feature-icon {
  font-size: 1.2rem;
}

/* Action Button */
.lesson-btn {
  width: 80%;
}
.btn-icon {
  animation: btn-icon-anim 1s infinite ease-in-out;
}

@keyframes btn-icon-anim {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(4px);
  }
}

/* Hover Magic Effects */
.hover-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  border-radius: 24px;
}

.magic-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  opacity: 0;
  animation: particle-burst 0.8s ease-out forwards;
}

@keyframes particle-burst {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5)
      translate(calc(var(--x, 0) * 50px), calc(var(--y, 0) * 50px));
    opacity: 0;
  }
}

/* Achievement Stars for Completed Lessons */
.achievement-stars {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 5;
}

.achievement-stars .star {
  font-size: 1.5rem;
  animation: star-appear 0.5s ease-out forwards;
  opacity: 0;
}
.achievement-stars .star:nth-child(1) {
  animation-delay: 0.1s;
}
.achievement-stars .star:nth-child(2) {
  animation-delay: 0.2s;
}
.achievement-stars .star:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes star-appear {
  from {
    transform: translateY(10px) scale(0.5);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Motivational Section */
.motivation-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 3rem 2rem;
  border-radius: 30px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.motivation-characters {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  position: relative;
}

.support-char {
  font-size: 2rem;
  position: absolute;
}
.char-1 {
  top: -20px;
  left: 25%;
}
.char-2 {
  top: 10px;
  right: 25%;
}
.char-3 {
  bottom: -10px;
  left: 30%;
}
.char-4 {
  bottom: -20px;
  right: 30%;
}

.motivation-title {
  font-family: "Bungee", cursive;
  font-size: clamp(1.8rem, 5vw, 2.5rem);
}

.motivation-text {
  color: #eee;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 1rem auto 2rem auto;
}

.motivation-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.motivation-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 15px;
  text-align: center;
  width: 120px;
}

.badge-emoji {
  font-size: 2.5rem;
  transition: transform 0.3s ease;
}
.badge-emoji.bounce-on-hover:hover {
  transform: scale(1.2) rotate(-10deg);
}

.badge-message {
  color: #fff;
  font-weight: bold;
  margin-top: 0.5rem;
}

/* REFACTOR: Removed celebration overlay CSS as the feature was removed for better performance */

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
  background: linear-gradient(45deg, #1dd1a1, #48dbfb);
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  animation: float-and-fade 3s ease-out forwards;
}

@keyframes float-and-fade {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }
  20% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0.8);
    opacity: 0;
  }
}
</style>
