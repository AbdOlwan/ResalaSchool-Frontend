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
        <v-col v-for="n in 4" :key="n" cols="12" md="6" lg="4">
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
        class="lessons-simple-grid"
      >
        <v-col
          v-for="(lesson, index) in lessons"
          :key="lesson.id"
          cols="12"
          md="6"
          lg="4"
          class="lesson-col"
        >
          <div
            class="lesson-card-wrapper"
            :style="{ '--animation-delay': `${index * 150}ms` }"
          >
            <div
              class="lesson-simple-card"
              @click="viewLesson(lesson.id)"
              @mouseenter="playHoverSound"
            >
              <div class="lesson-header-simple">
                <div class="lesson-icon-simple">
                  {{ getLessonIcon(index) }}
                </div>
                <div class="lesson-number">Lesson {{ index + 1 }}</div>
              </div>

              <div class="lesson-content-simple">
                <h3 class="lesson-title-simple">
                  {{ lesson.title }}
                </h3>

                <div class="lesson-progress-simple mb-3">
                  <div class="progress-header-simple">
                    <span class="progress-label-simple">Progress</span>
                    <span class="progress-score-simple">
                      {{ lesson.userScore }} / {{ lesson.exerciseCount }}
                    </span>
                  </div>
                  <div class="progress-bar-simple">
                    <div
                      class="progress-fill-simple"
                      :style="{ width: getLessonProgressWidth(lesson) }"
                    ></div>
                  </div>
                  <div class="progress-percentage-simple">
                    {{ getLessonProgressPercentage(lesson) }}% Complete
                  </div>
                </div>

                <div
                  class="lesson-status"
                  :class="{ completed: isLessonCompleted(lesson) }"
                >
                  <div class="status-icon">
                    {{ isLessonCompleted(lesson) ? "✅" : "⏳" }}
                  </div>
                  <span class="status-text">
                    {{
                      isLessonCompleted(lesson)
                        ? "Completed!"
                        : "Ready to Learn"
                    }}
                  </span>
                </div>

                <v-btn
                  variant="elevated"
                  :color="getColorForLesson(index)"
                  class="lesson-btn-simple"
                  block
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
                </v-btn>
              </div>

              <div v-if="isLessonCompleted(lesson)" class="achievement-badge">
                <span class="achievement-stars">⭐⭐⭐</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row justify="center" class="mt-16 mb-8">
        <v-col cols="12" md="10" lg="8" class="text-center">
          <div class="motivation-section">
            <div class="motivation-characters">
              <div class="main-character pulse-on-hover">🌟</div>
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
                <div class="badge-emoji bounce-on-hover">
                  {{ badge.emoji }}
                </div>
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

// Assume a global state for sound settings (e.g., from Pinia/Vuex)
const isMuted = ref(false);

// UI Data
const cardThemes = [
  { color: "teal-darken-2" },
  { color: "deep-purple-accent-3" },
  { color: "amber-darken-3" },
  { color: "pink-accent-2" },
  { color: "blue-darken-2" },
  { color: "green-darken-2" },
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
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const userId = 1; // For testing, will come from state management later
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

// Sound Effects
const playWelcomeSound = () => playSound("welcome");
const playHoverSound = () => playSound("hover");
const playClickSound = () => playSound("click");
const playSuccessSound = () => playSound("success");

const playSound = (type) => {
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
  // Target the wrapper for the animation
  const cards = document.querySelectorAll(".lesson-card-wrapper");
  cards.forEach((card) => {
    card.classList.add("animate-in");
  });
};

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
        animationDuration: `${Math.random() * 25 + 20}s`,
        animationDelay: `${Math.random() * 20}s`,
      },
    });
  }
  floatingShapes.value = shapes;
};
</script>

<style scoped>
/* Keeping original styles for Hero, Background, etc. */
.lessons-adventure-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: "Cairo", sans-serif;
}

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
    opacity: 0.5;
  }
  100% {
    transform: translateY(-20vh) rotate(360deg);
    opacity: 0;
  }
}

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

.mascots-container {
  position: relative;
  z-index: 2;
}
.main-mascot {
  font-size: 6rem;
  cursor: pointer;
  display: inline-block;
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
}
.hero-title {
  font-family: "Bungee", cursive;
  font-size: clamp(2rem, 6vw, 4.5rem);
}
.static-gradient-text {
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-subtitle {
  font-family: "Cairo", sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: #fff;
}
.journey-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 50px;
}
.progress-step {
  color: #fff;
  font-weight: bold;
}
.progress-step.current {
  background: #fff;
  color: #764ba2;
  border-radius: 30px;
  padding: 8px 16px;
}
.progress-arrow {
  color: #fff;
  font-size: 1.5rem;
}
.lessons-container {
  position: relative;
  z-index: 10;
  padding-top: 2rem;
  padding-bottom: 4rem;
}
.magic-btn {
  border-radius: 50px;
  font-weight: bold;
}
.loading-mascot,
.motivation-section {
  /* Styles for these sections are kept from the original file */
  padding: 2rem;
}

/* START: NEW STYLES for Simple Lesson Cards */
.lessons-simple-grid {
  margin-top: 2rem;
}

.lesson-card-wrapper {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  /* Use the delay variable from the template */
  transition-delay: var(--animation-delay);
}

.lesson-card-wrapper.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.lesson-simple-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.lesson-simple-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #764ba2;
}

.lesson-header-simple {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.lesson-icon-simple {
  font-size: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lesson-number {
  background: #f0f0f0;
  color: #5a6c7d;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.lesson-content-simple {
  text-align: left;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.lesson-title-simple {
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 15px;
  min-height: 3.9rem; /* Ensures alignment for 1 or 2-line titles */
  flex-grow: 1;
}

.lesson-progress-simple {
  margin-bottom: 20px;
}

.progress-header-simple {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.progress-label-simple {
  color: #7f8c8d;
  font-weight: 500;
}

.progress-score-simple {
  font-weight: bold;
}

.progress-bar-simple {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill-simple {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-percentage-simple {
  text-align: right;
  color: #5a6c7d;
  font-size: 0.85rem;
  font-weight: 500;
}

.lesson-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 10px 15px;
  border-radius: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.lesson-status.completed {
  background: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.status-icon {
  font-size: 1.2rem;
}

.status-text {
  font-weight: 500;
  font-size: 0.9rem;
}

.lesson-btn-simple {
  border-radius: 15px;
  font-weight: 600;
  text-transform: none;
  padding: 12px;
  margin-top: auto; /* Pushes button to the bottom */
  transition: all 0.3s ease;
}

.lesson-btn-simple:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.achievement-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  border-radius: 20px;
  padding: 8px 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: rotate(10deg);
}

.achievement-stars {
  font-size: 1rem;
  color: #8b4513;
}
/* END: NEW STYLES */

/* Other original styles */
.motivation-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 3rem 2rem;
  border-radius: 30px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}
.motivation-title {
  font-family: "Bungee", cursive;
}
.motivation-text {
  color: #eee;
}
.motivation-badges {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}
.motivation-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 15px;
  width: 120px;
}
.badge-emoji {
  font-size: 2.5rem;
}
.badge-message {
  color: #fff;
  font-weight: bold;
}
.success-message {
  position: absolute;
  background: linear-gradient(45deg, #1dd1a1, #48dbfb);
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
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
</style>
