<template>
  <div class="mcq-container">
    <p class="question-text">{{ question.questionText }}</p>
    <v-radio-group
      v-model="selectedOption"
      @update:modelValue="$emit('answerSelected', $event)"
      :disabled="submitted"
      class="options-grid"
    >
      <v-radio
        v-for="(option, index) in question.options"
        :key="option.id"
        :value="option.id"
        class="option-item"
      >
        <template v-slot:label>
          <div class="option-card" :class="getOptionClass(option.id)">
            <div class="option-letter">
              {{ String.fromCharCode(65 + index) }}
            </div>
            <span class="option-text">{{ option.text }}</span>
            <div class="option-icon">
              <v-icon v-if="getIcon(option.id)">{{
                getIcon(option.id)
              }}</v-icon>
            </div>
          </div>
        </template>
      </v-radio>
    </v-radio-group>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  question: { type: Object, required: true },
  result: { type: Object, default: null }, // { isCorrect, correctOptionId }
  submitted: { type: Boolean, default: false },
});

defineEmits(["answerSelected"]);

const selectedOption = ref(null);

watch(
  () => props.question,
  () => {
    selectedOption.value = null;
  }
);

/**
 * REFACTORED: This function now implements the new feedback logic.
 * When a user is incorrect, it highlights their wrong answer (red),
 * highlights the correct answer (green), and fades out all other
 * incorrect options to improve focus.
 */
const getOptionClass = (optionId) => {
  // Before submission, only apply the 'selected' class
  if (!props.submitted) {
    return selectedOption.value === optionId ? "selected" : "";
  }

  const isCorrectOption = props.result?.correctOptionId === optionId;
  const isSelectedOption = selectedOption.value === optionId;

  // Case 1: The user's answer was CORRECT
  if (props.result?.isCorrect) {
    return isCorrectOption ? "correct" : "disabled";
  }
  // Case 2: The user's answer was INCORRECT
  else {
    if (isCorrectOption) return "correct"; // Highlight the correct answer
    if (isSelectedOption) return "incorrect"; // Highlight the user's wrong choice
    return "faded"; // Fade out all other incorrect options
  }
};

const getIcon = (optionId) => {
  if (!props.submitted) return null;

  const isCorrect = props.result?.correctOptionId === optionId;
  const isSelected = selectedOption.value === optionId;

  if (isCorrect) return "mdi-check-circle";
  if (isSelected && !props.result?.isCorrect) return "mdi-close-circle";
  return null;
};
</script>

<style scoped>
.mcq-container {
  width: 100%;
}
.question-text {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Hiding the actual radio button */
:deep(.v-input--selection-controls__input) {
  display: none;
}

.option-card {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  border: 3px solid #e0e0e0;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.option-card:hover {
  transform: translateY(-4px);
  border-color: #764ba2;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.option-letter {
  /* CHANGED: Darkened background for better contrast and readability */
  background-color: #673ab7;
  color: #ffffff;
  border-radius: 8px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 1rem;
  flex-shrink: 0;
  transition: all 0.2s ease-in-out;
}

.option-text {
  flex-grow: 1;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.option-icon {
  font-size: 1.8rem;
  margin-left: 1rem;
}

/* --- State Styles --- */
.option-card.selected {
  border-color: #764ba2;
  background-color: #f3e5f5;
}
.option-card.selected .option-letter {
  background-color: #512da8; /* Slightly darken on select */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.option-card.correct {
  border-color: #4caf50;
  background-color: #e8f5e9;
  animation: bounce-in 0.5s ease;
}
.option-card.correct .option-icon {
  color: #4caf50;
}

.option-card.incorrect {
  border-color: #f44336;
  background-color: #ffebee;
  animation: shake 0.5s ease;
}
.option-card.incorrect .option-icon {
  color: #f44336;
}

.option-card.disabled {
  background-color: #f5f5f5;
  opacity: 0.7;
  cursor: not-allowed;
  border-color: #e0e0e0;
}
.option-card.disabled:hover {
  transform: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* NEW: Added a 'faded' state for non-selected incorrect answers */
.option-card.faded {
  opacity: 0.4;
  pointer-events: none;
  background-color: #fafafa;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.05);
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
