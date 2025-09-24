<template>
  <div class="fitb-container">
    <p class="question-parts">
      <span>{{ questionParts.start }}</span>
      <v-text-field
        v-model="studentAnswer"
        placeholder="Answer"
        variant="solo"
        rounded="lg"
        class="answer-input"
        :class="validationClass"
        :disabled="submitted"
        :error-messages="errorMessage"
        :color="validationColor"
        @update:modelValue="$emit('answerUpdated', studentAnswer)"
        hide-details="auto"
        autofocus
        @keydown.enter.prevent="
          () => {
            /* Prevent form submission */
          }
        "
      ></v-text-field>
      <span>{{ questionParts.end }}</span>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  question: { type: Object, required: true },
  result: { type: Object, default: null }, // { isCorrect, correctAnswerText }
  submitted: { type: Boolean, default: false },
});

defineEmits(["answerUpdated"]);

const studentAnswer = ref("");

const questionParts = computed(() => {
  const parts = props.question.questionText.split("...");
  return {
    start: parts[0] || "",
    end: parts[1] || "",
  };
});

const validationState = computed(() => {
  if (!props.submitted) return { color: "primary", message: "", class: "" };

  if (props.result?.isCorrect) {
    return { color: "success", message: "Correct!", class: "correct" };
  } else {
    const correctAnswer = props.result?.correctAnswerText || "";
    return {
      color: "error",
      message: `The correct answer is: ${correctAnswer}`,
      class: "incorrect",
    };
  }
});

const validationColor = computed(() => validationState.value.color);
const errorMessage = computed(() => validationState.value.message);
const validationClass = computed(() => validationState.value.class);

watch(
  () => props.question,
  () => {
    studentAnswer.value = "";
  }
);
</script>

<style scoped>
.fitb-container {
  width: 100%;
}
.question-parts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: bold;
  text-align: center;
  color: #333;
  line-height: 2;
  font-family: "Lexend", "Comic Neue", sans-serif;
}

.answer-input {
  min-width: 150px;
  flex-grow: 0.2;
  margin: 0 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: "Lexend", "Comic Neue", sans-serif;
  text-align: center;
}

:deep(.v-input__control .v-field__input) {
  text-align: center !important;
  font-size: 1.5rem;
}

/* Correct and Incorrect state styling */
.answer-input.correct {
  animation: bounce-in 0.5s ease;
}
:deep(.v-input.correct .v-field__input) {
  color: #4caf50 !important;
}

.answer-input.incorrect {
  animation: shake 0.5s ease;
}
:deep(.v-input.incorrect .v-field__input) {
  color: #f44336 !important;
}

/* Animate the correct answer message appearing */
:deep(.v-input.incorrect .v-messages) {
  animation: fade-pop-in 0.5s ease-out;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  margin-top: 8px;
}

@keyframes fade-pop-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translateX(-1px);
  }
  20%,
  80% {
    transform: translateX(2px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-3px);
  }
  40%,
  60% {
    transform: translateX(3px);
  }
}
</style>
