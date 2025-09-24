<template>
  <div class="results-container">
    <!-- 
      REQUIREMENT 2: Replaced the unstable font icon with a reliable inline SVG.
      This ensures the trophy character renders correctly on all browsers and devices.
      The animation is now applied to a group within the SVG for smoother motion.
    -->
    <svg
      width="120"
      height="120"
      viewBox="0 0 96 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="trophy-character"
    >
      <g class="trophy-bounce">
        <!-- Cup Body -->
        <path d="M16 32C16 14.3269 80 14.3269 80 32V64H16V32Z" fill="#FFC72C" />
        <path
          d="M80 64H16V72C16 80.8366 23.1634 88 32 88H64C72.8366 88 80 80.8366 80 72V64Z"
          fill="#FBBF24"
        />
        <!-- Handles -->
        <path
          d="M80 60C92 60 92 40 80 40"
          stroke="#FFC72C"
          stroke-width="8"
          stroke-linecap="round"
        />
        <path
          d="M16 60C4 60 4 40 16 40"
          stroke="#FFC72C"
          stroke-width="8"
          stroke-linecap="round"
        />
        <!-- Stem -->
        <rect x="36" y="88" width="24" height="16" fill="#FBBF24" />
        <!-- Base -->
        <rect x="24" y="104" width="48" height="16" rx="8" fill="#F59E0B" />
        <!-- Face -->
        <circle cx="38" cy="52" r="4" fill="#4B5563" />
        <circle cx="58" cy="52" r="4" fill="#4B5563" />
        <path
          d="M42 62C42 62 45 68 54 68C63 68 66 62 66 62"
          stroke="#4B5563"
          stroke-width="3"
          stroke-linecap="round"
        />
        <!-- Shine -->
        <path
          d="M24 36C24 36 32 32 40 44"
          stroke="white"
          stroke-opacity="0.8"
          stroke-width="4"
          stroke-linecap="round"
        />
      </g>
    </svg>

    <v-card class="results-card text-center pa-8" max-width="600">
      <h1 class="results-title">Quiz Complete!</h1>
      <p class="results-subtitle">{{ getResultMessage }}</p>

      <div class="score-display my-8">
        <div class="score-circle">
          <span class="score-number">{{ score }}</span>
          <span class="score-divider">/</span>
          <span class="score-total">{{ total }}</span>
        </div>
        <div class="score-label">CORRECT ANSWERS</div>
      </div>

      <!-- 
        REQUIREMENT 3: Animate stars sequentially.
        The `displayedStars` ref is incremented in the script, adding the '.active'
        class to each star one by one, triggering a CSS transition for each.
      -->
      <div class="stars-container">
        <v-icon
          v-for="i in 3"
          :key="i"
          :class="['star', { active: i <= displayedStars }]"
        >
          mdi-star
        </v-icon>
      </div>

      <v-card-actions class="justify-center mt-8">
        <v-btn
          size="x-large"
          variant="flat"
          class="action-btn retry-btn"
          @click="$emit('retry')"
          rounded="xl"
        >
          <v-icon start>mdi-refresh</v-icon>
          Try Again
        </v-btn>
        <v-btn
          size="x-large"
          variant="outlined"
          class="action-btn home-btn"
          @click="$emit('back-to-lessons')"
          rounded="xl"
        >
          <v-icon start>mdi-school</v-icon>
          Back to Lessons
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";

const props = defineProps({
  score: { type: Number, required: true },
  total: { type: Number, required: true },
});

defineEmits(["retry", "back-to-lessons"]);

const percentage = computed(() => {
  return props.total > 0 ? (props.score / props.total) * 100 : 0;
});

const finalStars = computed(() => {
  if (percentage.value >= 90) return 3;
  if (percentage.value >= 60) return 2;
  if (percentage.value > 0) return 1;
  return 0;
});

const getResultMessage = computed(() => {
  if (percentage.value >= 90) return "Wow, you're a genius! 🎉";
  if (percentage.value >= 60) return "Great job! You're a star! ✨";
  return "Well done! Keep practicing! 👍";
});

// REQUIREMENT 3: Logic for sequential star animation
const displayedStars = ref(0);
let starInterval = null;

const animateStars = () => {
  // Clear any existing animation interval
  if (starInterval) clearInterval(starInterval);

  // Reset stars before animating
  displayedStars.value = 0;

  if (finalStars.value === 0) return;

  let starCount = 0;
  starInterval = setInterval(() => {
    if (starCount < finalStars.value) {
      starCount++;
      displayedStars.value = starCount;
      // REQUIREMENT 3: Placeholder for triggering a sound effect for each star.
      // For example: playTingSound();
    } else {
      clearInterval(starInterval);
    }
  }, 350); // Delay between each star appearing
};

// Trigger animation when the component is mounted
onMounted(() => {
  animateStars();
});

// Watch for changes to the score to re-trigger the animation if needed
watch(
  () => props.score,
  () => {
    animateStars();
  }
);
</script>

<style scoped>
/* REQUIREMENT 1: Import a more legible font for UI elements. */
@import url("https://fonts.googleapis.com/css2?family=Bungee&family=Nunito:wght@700;900&display=swap");

.results-container {
  position: relative;
  padding-top: 60px; /* Make space for the trophy */
}

.trophy-character {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.trophy-bounce {
  transform-origin: center bottom;
  animation: trophy-bounce-anim 2.5s infinite ease-in-out;
}

@keyframes trophy-bounce-anim {
  0%,
  100% {
    transform: translateY(0) rotate(-4deg);
  }
  50% {
    transform: translateY(-12px) rotate(4deg);
  }
}

.results-card {
  border-radius: 24px;
  padding-top: 4rem !important;
  background: #fff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.results-title {
  font-family: "Bungee", cursive;
  font-size: 3rem;
  color: #764ba2;
}

/* REQUIREMENT 1: Use the more legible font for subtitles. */
.results-subtitle {
  font-family: "Nunito", sans-serif;
  font-size: 1.25rem;
  color: #555;
  font-weight: 700;
}

.score-display {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
.score-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd54f, #ffb300);
  color: #fff;
  display: flex;
  align-items: baseline;
  justify-content: center;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.2),
    0 5px 15px rgba(255, 179, 0, 0.5);
}

.score-number {
  font-family: "Nunito", sans-serif;
  font-weight: 900;
  font-size: 5rem;
}
.score-divider {
  font-size: 2rem;
  font-weight: 300;
  margin: 0 0.2rem;
  opacity: 0.8;
}
.score-total {
  font-size: 2.5rem;
  font-weight: 300;
  opacity: 0.8;
}

/* REQUIREMENT 1: Use the more legible font for labels. */
.score-label {
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  color: #ffb300;
  margin-top: 1rem;
  letter-spacing: 1px;
}

.stars-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  height: 4rem; /* Set fixed height to prevent layout shift */
}

/* REQUIREMENT 3: Refactored star animation using CSS transitions. */
.star {
  font-size: 4rem;
  color: #e0e0e0;
  transform: scale(0);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.star.active {
  color: #ffd700;
  transform: scale(1) rotate(15deg);
  opacity: 1;
}

/* REQUIREMENT 1: Use legible Nunito font for all action buttons. */
.action-btn {
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: none; /* Override Vuetify's default uppercase */
  margin: 0.5rem;
  transition: transform 0.2s ease;
}
.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.retry-btn {
  background: #764ba2;
  color: white;
}
.home-btn {
  color: #764ba2;
  border-color: #764ba2;
}
</style>
