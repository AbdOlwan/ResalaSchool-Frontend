<template>
  <v-container fluid class="quiz-adventure-page fill-height">
    <div class="floating-elements">
      <div class="floating-shape" v-for="n in 8" :key="n">
        {{ ["⭐", "🧠", "💡", "🚀", "✅"][n % 5] }}
      </div>
    </div>

    <v-fade-transition mode="out-in">
      <div v-if="isLoading" class="text-center loading-container">
        <div class="loading-character">🎓</div>
        <h2 class="loading-text">Preparing Your Challenge!</h2>
        <p>Get ready to show your skills...</p>
      </div>

      <QuizResults
        v-else-if="quizFinished"
        :score="score"
        :total="questions.length"
        @retry="restartQuiz"
        @back-to-lessons="goBackToLessons"
      />

      <v-card
        v-else-if="currentQuestion"
        class="quiz-card mx-auto"
        width="100%"
        max-width="850px"
      >
        <div class="progress-container">
          <div class="progress-bar-label">
            Question {{ currentQuestionIndex + 1 }} / {{ questions.length }}
          </div>
          <v-progress-linear
            :model-value="((currentQuestionIndex + 1) / questions.length) * 100"
            color="amber-lighten-1"
            height="18"
            rounded
            striped
          >
            <strong
              >{{
                Math.ceil(
                  ((currentQuestionIndex + 1) / questions.length) * 100
                )
              }}%</strong
            >
          </v-progress-linear>
        </div>

        <v-card-title class="quiz-header">
          <div class="mascot-guide">🦉</div>
          <v-chip class="score-chip" color="orange-darken-2" label large>
            <v-icon start icon="mdi-star-circle"></v-icon>
            Score: {{ score }}
          </v-chip>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6 content-area">
          <v-fade-transition mode="out-in">
            <component
              :key="currentQuestion.id"
              :is="questionComponent"
              :question="currentQuestion"
              :result="answerResult"
              :submitted="answerSubmitted"
              @answer-selected="handleAnswerSelection"
              @answer-updated="handleAnswerUpdate"
            />
          </v-fade-transition>
        </v-card-text>

        <v-card-actions class="pa-5 actions-footer">
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!isAnswerProvided && !answerSubmitted"
            :loading="isSubmitting"
            @click="handleSubmit"
            class="action-btn"
            size="x-large"
            rounded="xl"
            elevation="8"
          >
            <span class="btn-text">{{
              answerSubmitted ? "Next Question" : "Check Answer"
            }}</span>
            <v-icon end>{{
              answerSubmitted ? "mdi-arrow-right-bold-circle" : "mdi-check-bold"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-fade-transition>

    <v-overlay
      v-model="showFeedback"
      class="d-flex align-center justify-center"
      scrim="#6A1B9A"
      persistent
    >
      <div class="feedback-content text-center">
        <div v-if="answerResult && answerResult.isCorrect">
          <div class="feedback-character correct-anim">🎉</div>
          <h2 class="feedback-title correct-text">Fantastic!</h2>
          <p class="feedback-message">You are a superstar! 🌟</p>
          <div class="confetti-container">
            <div class="confetti" v-for="i in 30" :key="i"></div>
          </div>
        </div>
        <div v-else>
          <div class="feedback-character incorrect-anim">🤔</div>
          <h2 class="feedback-title incorrect-text">Good Try!</h2>
          <p class="feedback-message">
            Every mistake is a chance to learn. The correct answer is
            highlighted for you.
          </p>
        </div>
      </div>
    </v-overlay>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, markRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import apiClient from "@/services/api.js";
import MultipleChoiceQuestion from "../components/quiz/MultipleChoiceQuestion.vue";
import FillInTheBlankQuestion from "../components/quiz/FillInTheBlankQuestion.vue";
import QuizResults from "../components/quiz/QuizResults.vue";
import ReorderQuestion from "../components/quiz/ReorderQuestion.vue";

const props = defineProps({
  lessonId: [String, Number],
});

const route = useRoute();
const router = useRouter();
const store = useStore();

// --- State Management ---
const isLoading = ref(true);
const questions = ref([]);
const currentQuestionIndex = ref(0);
const score = ref(0);
const quizFinished = ref(false);
const selectedOptionId = ref(null);
const answerText = ref("");
const answerResult = ref(null);
const answerSubmitted = ref(false);
const isSubmitting = ref(false);
const showFeedback = ref(false);
const orderedItems = ref([]);

// --- Computed Properties ---
const currentUser = computed(() => store.getters.currentUser);

// Sound Refactoring: Added a computed property to get the global mute state from Vuex.
// Assumes a getter named 'isMuted' exists in your Vuex store.
const isMuted = computed(() => store.getters.isMuted || false);

const currentQuestion = computed(
  () => questions.value[currentQuestionIndex.value]
);

const questionComponentMap = {
  MultipleChoice: markRaw(MultipleChoiceQuestion),
  FillInBlank: markRaw(FillInTheBlankQuestion),
  Reorder: markRaw(ReorderQuestion),
};

const questionComponent = computed(() => {
  if (!currentQuestion.value) return null;
  return questionComponentMap[currentQuestion.value.type] || null;
});

const isAnswerProvided = computed(() => {
  if (!currentQuestion.value) return false;
  switch (currentQuestion.value.type) {
    case "MultipleChoice":
      return selectedOptionId.value !== null;
    case "FillInBlank":
      return answerText.value.trim() !== "";
    case "Reorder":
      // Logic: The user must have interacted with the reorder items.
      // We check if the orderedItems array is populated.
      // Note: This relies on the child component emitting an event to update `orderedItems`.
      return orderedItems.value.length > 0;
    default:
      return false;
  }
});

// --- Sound Effects ---
const playSound = (type) => {
  // Sound Refactoring: Check the global mute state before playing any sound.
  if (isMuted.value) {
    return;
  }
  const audioFiles = {
    correct: "https://www.soundjay.com/buttons/sounds/button-1.mp3",
    incorrect: "https://www.soundjay.com/buttons/sounds/button-10.mp3",
    click: "https://www.soundjay.com/buttons/sounds/button-7.mp3",
  };
  if (audioFiles[type]) {
    new Audio(audioFiles[type])
      .play()
      .catch((e) => console.error("Audio playback failed:", e));
  }
};

// --- API & Quiz Logic ---
onMounted(() => {
  fetchQuiz();
});

const fetchQuiz = async () => {
  isLoading.value = true;
  quizFinished.value = false;
  resetQuizState();

  try {
    // Artificial delay for better perceived loading experience
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const response = await apiClient.get(
      `/api/Exercises/lesson/${props.lessonId}/quiz?count=5`
    );
    if (response.data.success && response.data.data.length > 0) {
      questions.value = response.data.data;
    } else {
      questions.value = [];
      quizFinished.value = true;
    }
  } catch (error) {
    console.error("Failed to fetch quiz:", error);
    questions.value = [];
    quizFinished.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleAnswerSelection = (optionId) => {
  if (!answerSubmitted.value) {
    selectedOptionId.value = optionId;
  }
};

const handleAnswerUpdate = (text) => {
  if (!answerSubmitted.value) {
    answerText.value = text;
  }
};

const handleSubmit = async () => {
  if (answerSubmitted.value) {
    goToNextQuestion();
    return;
  }

  isSubmitting.value = true;
  const userId = currentUser.value?.id || 1;

  const payload = {
    exerciseId: currentQuestion.value.id,
    selectedOptionId:
      currentQuestion.value.type === "MultipleChoice"
        ? selectedOptionId.value
        : null,
    answerText:
      currentQuestion.value.type === "FillInBlank" ? answerText.value : null,
  };

  try {
    const response = await apiClient.post(
      `/api/Exercises/submit?userId=${userId}`,
      payload
    );
    if (response.data.success) {
      answerResult.value = response.data.data;
      answerSubmitted.value = true;

      if (answerResult.value.isCorrect) {
        score.value += answerResult.value.pointsAwarded;
        playSound("correct");
      } else {
        playSound("incorrect");
      }

      showFeedback.value = true;
      // UX Logic: This timeout provides immediate visual feedback for a short duration.
      // It does NOT block navigation, which is user-initiated by the "Next Question" button. This aligns with the principle of no artificial delays.
      setTimeout(() => {
        showFeedback.value = false;
      }, 2500);
    }
  } catch (error) {
    console.error("Failed to submit answer:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const goToNextQuestion = () => {
  playSound("click");
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
    resetQuestionStateForNext();
  } else {
    quizFinished.value = true;
  }
};

const resetQuestionStateForNext = () => {
  selectedOptionId.value = null;
  answerText.value = "";
  answerResult.value = null;
  answerSubmitted.value = false;
};

const resetQuizState = () => {
  score.value = 0;
  currentQuestionIndex.value = 0;
  resetQuestionStateForNext();
};

const restartQuiz = () => {
  fetchQuiz();
};

const goBackToLessons = () => {
  router.push({ name: "Lessons", params: { unitId: route.params.unitId } });
};
</script>

<style scoped>
/* --- Page Layout & Background --- */
.quiz-adventure-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Font Refactoring: Set 'Cairo' as the primary font for readability and multilingual support. */
  font-family: "Cairo", sans-serif;
  position: relative;
  overflow: hidden;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.15);
  /* Animation Refactoring: Animation duration increased to make movement slower and less distracting. */
  animation: float 45s ease-in-out infinite;
  left: 50%;
  top: 50%;
}

.floating-shape:nth-child(2n) {
  animation-duration: 50s;
  animation-delay: -5s;
}
.floating-shape:nth-child(3n) {
  animation-duration: 55s;
  animation-delay: -10s;
}
.floating-shape:nth-child(4n) {
  animation-duration: 40s;
  animation-delay: -2s;
}

@keyframes float {
  0% {
    transform: translate(-50vw, -50vh) rotate(0deg);
  }
  100% {
    transform: translate(50vw, 50vh) rotate(360deg);
  }
}

/* --- Loading State --- */
.loading-container {
  color: white;
}
.loading-character {
  font-size: 6rem;
  display: inline-block;
  animation: bounce 2s infinite ease-in-out;
}
.loading-text {
  /* Font Refactoring: Bungee is reserved for main titles like this one. */
  font-family: "Bungee", cursive;
  font-size: 2.5rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

/* --- Quiz Card --- */
.quiz-card {
  border-radius: 24px;
  border: 4px solid #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: #fdfcff;
  overflow: visible;
  position: relative;
}

.progress-container {
  padding: 16px;
  background-color: #764ba2;
  color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.progress-bar-label {
  font-weight: bold;
  margin-bottom: 8px;
}
.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  position: relative;
}

.mascot-guide {
  font-size: 4rem;
  position: absolute;
  left: 16px;
  top: -55px;
  transform: rotate(-15deg);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.score-chip {
  font-size: 1.1rem;
  font-weight: bold;
  padding: 20px 15px !important;
  height: auto !important;
}

.content-area {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.actions-footer {
  background-color: #f5f5f5;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.action-btn {
  /* Font Refactoring: Switched button font to 'Cairo' for consistency and readability. */
  font-family: "Cairo", sans-serif;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #f7971e, #ffd200);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Animation Refactoring: Button animation is interaction-based (on hover), which is good UX. */
.action-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.action-btn:disabled {
  background: #bdbdbd;
  color: #757575 !important;
}

/* --- Feedback Overlay --- */
.feedback-content {
  color: white;
}
.feedback-character {
  font-size: 8rem;
  line-height: 1;
}
.feedback-title {
  font-family: "Bungee", cursive;
  font-size: 3.5rem;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.2);
}
.feedback-message {
  font-size: 1.2rem;
  max-width: 400px;
  margin-top: 1rem;
}

.correct-text {
  color: #81c784;
}
.incorrect-text {
  color: #e57373;
}

.correct-anim {
  animation: tada 1s ease;
}
.incorrect-anim {
  animation: shake 0.5s ease;
}

@keyframes tada {
  from {
    transform: scale3d(1, 1, 1);
  }
  10%,
  20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }
  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }
  40%,
  60%,
  80% {
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }
  to {
    transform: scale3d(1, 1, 1);
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

/* --- Confetti --- */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.confetti {
  width: 10px;
  height: 10px;
  background-color: #f9a825;
  position: absolute;
  top: -20px;
  animation: confetti-fall 3s linear forwards;
}
.confetti:nth-child(2n) {
  background-color: #4caf50;
}
.confetti:nth-child(3n) {
  background-color: #2196f3;
}
.confetti:nth-child(4n) {
  background-color: #e91e63;
}

@keyframes confetti-fall {
  to {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Reduced number of selectors to match the reduced confetti count */
.confetti:nth-child(1) {
  left: 10%;
  animation-delay: 0.1s;
}
.confetti:nth-child(2) {
  left: 20%;
  animation-delay: 0.3s;
}
.confetti:nth-child(3) {
  left: 30%;
  animation-delay: 0.5s;
}
.confetti:nth-child(4) {
  left: 40%;
  animation-delay: 0.2s;
}
.confetti:nth-child(5) {
  left: 50%;
  animation-delay: 0.6s;
}
.confetti:nth-child(6) {
  left: 60%;
  animation-delay: 0.1s;
}
.confetti:nth-child(7) {
  left: 70%;
  animation-delay: 0.4s;
}
.confetti:nth-child(8) {
  left: 80%;
  animation-delay: 0.3s;
}
.confetti:nth-child(9) {
  left: 90%;
  animation-delay: 0.7s;
}
.confetti:nth-child(10) {
  left: 95%;
  animation-delay: 0.2s;
}
.confetti:nth-child(11) {
  left: 15%;
  animation-delay: 0.8s;
}
.confetti:nth-child(12) {
  left: 25%;
  animation-delay: 1s;
}
.confetti:nth-child(13) {
  left: 35%;
  animation-delay: 1.2s;
}
.confetti:nth-child(14) {
  left: 45%;
  animation-delay: 0.9s;
}
.confetti:nth-child(15) {
  left: 55%;
  animation-delay: 1.3s;
}
</style>
