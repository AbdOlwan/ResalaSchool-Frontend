<template>
  <div class="results-container">
    <div class="trophy-character">🏆</div>
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

      <div class="stars-container">
        <v-icon
          v-for="i in 3"
          :key="i"
          :class="['star', { active: i <= stars }]"
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
import { computed } from "vue";

const props = defineProps({
  score: { type: Number, required: true },
  total: { type: Number, required: true },
});

defineEmits(["retry", "back-to-lessons"]);

const percentage = computed(() => {
  return props.total > 0 ? (props.score / props.total) * 100 : 0;
});

const stars = computed(() => {
  if (percentage.value >= 90) return 3;
  if (percentage.value >= 60) return 2;
  if (percentage.value > 0) return 1;
  return 0;
});

const getResultMessage = computed(() => {
  if (percentage.value >= 90) return "Wow, you're a genius! 🚀";
  if (percentage.value >= 60) return "Great job! You're a star! ✨";
  return "Well done! Keep practicing! 👍";
});
</script>

<style scoped>
.results-container {
  position: relative;
}

.trophy-character {
  font-size: 6rem;
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  animation: trophy-bounce 2s infinite ease-in-out;
}
@keyframes trophy-bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateX(-50%) translateY(-15px) rotate(5deg);
  }
}

.results-card {
  border-radius: 24px;
  padding-top: 4rem !important;
  background: #fff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.results-title {
  font-family: "Bungee", cursive;
  font-size: 3rem;
  color: #764ba2;
}
.results-subtitle {
  font-size: 1.2rem;
  color: #555;
  font-weight: 500;
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
  animation: scale-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scale-in {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.score-number {
  font-size: 5rem;
  font-weight: bold;
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
.score-label {
  font-weight: bold;
  color: #ffb300;
  margin-top: 1rem;
  letter-spacing: 1px;
}

.stars-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.star {
  font-size: 4rem;
  color: #e0e0e0;
  opacity: 0;
  transform: scale(0);
  animation: star-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
.star.active {
  color: #ffd700;
}
.star:nth-child(1) {
  animation-delay: 0.5s;
}
.star:nth-child(2) {
  animation-delay: 0.7s;
}
.star:nth-child(3) {
  animation-delay: 0.9s;
}

@keyframes star-pop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.action-btn {
  font-family: "Bungee", cursive;
  margin: 0.5rem;
  transition: transform 0.2s ease;
}
.action-btn:hover {
  transform: translateY(-3px);
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
