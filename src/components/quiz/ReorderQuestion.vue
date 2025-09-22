<template>
  <div class="reorder-container">
    <p class="question-text">{{ question.questionText }}</p>

    <!-- Instructions -->
    <div class="instructions-card">
      <div class="instruction-icon">🎯</div>
      <span class="instruction-text"
        >Drag and drop the items to put them in the correct order!</span
      >
    </div>

    <!-- Reorder Items Container -->
    <div class="reorder-area">
      <transition-group
        name="reorder-item"
        tag="div"
        class="items-list"
        @before-enter="beforeEnter"
        @enter="enter"
      >
        <div
          v-for="(item, index) in localItems"
          :key="item.id"
          :data-index="index"
          class="reorder-item"
          :class="getItemClass(item, index)"
          :draggable="!submitted"
          @dragstart="handleDragStart($event, item, index)"
          @dragend="handleDragEnd"
          @dragover.prevent="handleDragOver($event, index)"
          @drop="handleDrop($event, index)"
          @click="!submitted && handleItemClick(item, index)"
        >
          <!-- Item Number -->
          <div class="item-number">
            <span class="number-text">{{ index + 1 }}</span>
          </div>

          <!-- Item Content -->
          <div class="item-content">
            <div class="item-text">{{ item.text }}</div>

            <!-- Drag Handle -->
            <div v-if="!submitted" class="drag-handle">
              <div class="handle-lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <!-- Status Icon -->
          <div v-if="submitted" class="status-icon">
            <v-icon v-if="getItemStatus(item, index) === 'correct'">
              mdi-check-circle
            </v-icon>
            <v-icon v-else-if="getItemStatus(item, index) === 'incorrect'">
              mdi-close-circle
            </v-icon>
          </div>

          <!-- Magic Sparkles for Correct Items -->
          <div
            v-if="submitted && getItemStatus(item, index) === 'correct'"
            class="magic-sparkles"
          >
            <span class="sparkle" v-for="n in 4" :key="n">✨</span>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Drop Zone Indicator -->
    <div v-if="isDragging" class="drop-zone-indicator">
      <div class="drop-zone-content">
        <div class="drop-icon">📦</div>
        <span class="drop-text">Drop here to reorder!</span>
      </div>
    </div>

    <!-- Touch Interaction Buttons (for mobile) -->
    <div
      v-if="selectedItemIndex !== null && !submitted"
      class="mobile-controls"
    >
      <v-btn
        size="small"
        color="blue-darken-2"
        @click="moveSelectedItem('up')"
        :disabled="selectedItemIndex === 0"
        class="move-btn"
      >
        <v-icon>mdi-arrow-up</v-icon>
        Move Up
      </v-btn>
      <v-btn
        size="small"
        color="orange-darken-2"
        @click="moveSelectedItem('down')"
        :disabled="selectedItemIndex === localItems.length - 1"
        class="move-btn"
      >
        <v-icon>mdi-arrow-down</v-icon>
        Move Down
      </v-btn>
      <v-btn
        size="small"
        color="green-darken-2"
        @click="deselectItem"
        class="move-btn"
      >
        <v-icon>mdi-check</v-icon>
        Done
      </v-btn>
    </div>

    <!-- Progress Indicator -->
    <div v-if="submitted" class="result-summary">
      <div class="summary-card">
        <div class="summary-icon">
          <span v-if="correctItemsCount === localItems.length">🎉</span>
          <span v-else-if="correctItemsCount > localItems.length / 2">⭐</span>
          <span v-else>💪</span>
        </div>
        <div class="summary-text">
          <div class="score-text">
            {{ correctItemsCount }} / {{ localItems.length }} Correct!
          </div>
          <div class="encouragement-text">{{ getEncouragementMessage() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  question: { type: Object, required: true },
  result: { type: Object, default: null }, // { isCorrect, correctOrder: [item1, item2, ...] }
  submitted: { type: Boolean, default: false },
});

defineEmits(["answerUpdated"]);

// State
const localItems = ref([]);
const selectedItemIndex = ref(null);
const draggedItem = ref(null);
const draggedIndex = ref(null);
const isDragging = ref(false);

// Initialize items when question changes
watch(
  () => props.question,
  () => {
    if (props.question && props.question.options) {
      // Shuffle the items initially or use them as provided
      localItems.value = [...props.question.options];
      selectedItemIndex.value = null;
    }
  },
  { immediate: true }
);

// Computed properties
const correctItemsCount = computed(() => {
  if (!props.submitted || !props.result?.correctOrder) return 0;

  return localItems.value.reduce((count, item, index) => {
    const correctItem = props.result.correctOrder[index];
    return item.id === correctItem.id ? count + 1 : count;
  }, 0);
});

// Methods
const getItemClass = (item, index) => {
  const classes = [];

  if (selectedItemIndex.value === index) {
    classes.push("selected");
  }

  if (props.submitted) {
    const status = getItemStatus(item, index);
    classes.push(status);

    if (status === "correct") {
      classes.push("bounce-correct");
    } else {
      classes.push("shake-incorrect");
    }
  }

  return classes;
};

const getItemStatus = (item, index) => {
  if (!props.submitted || !props.result?.correctOrder) return null;

  const correctItem = props.result.correctOrder[index];
  return item.id === correctItem.id ? "correct" : "incorrect";
};

const getEncouragementMessage = () => {
  const score = correctItemsCount.value;
  const total = localItems.value.length;
  const percentage = (score / total) * 100;

  if (percentage === 100) return "Perfect! You're amazing! 🌟";
  if (percentage >= 75) return "Excellent work! Almost perfect! ⭐";
  if (percentage >= 50) return "Good job! Keep practicing! 💪";
  return "Nice try! You're learning! 🌈";
};

// Drag and Drop handlers
const handleDragStart = (event, item, index) => {
  draggedItem.value = item;
  draggedIndex.value = index;
  isDragging.value = true;

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", event.target);

  // Add visual feedback
  event.target.classList.add("dragging");
};

const handleDragEnd = (event) => {
  isDragging.value = false;
  event.target.classList.remove("dragging");

  // Clear drag data
  draggedItem.value = null;
  draggedIndex.value = null;
};

const handleDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  // Add visual feedback for drop zone
  const target = event.currentTarget;
  if (!target.classList.contains("drag-over")) {
    target.classList.add("drag-over");
    setTimeout(() => target.classList.remove("drag-over"), 200);
  }
};

const handleDrop = (event, dropIndex) => {
  event.preventDefault();

  if (draggedIndex.value !== null && draggedIndex.value !== dropIndex) {
    moveItem(draggedIndex.value, dropIndex);
  }
};

const moveItem = (fromIndex, toIndex) => {
  const newItems = [...localItems.value];
  const [movedItem] = newItems.splice(fromIndex, 1);
  newItems.splice(toIndex, 0, movedItem);

  localItems.value = newItems;
  emitAnswerUpdate();
};

// Touch/Click interaction for mobile
const handleItemClick = (item, index) => {
  if (selectedItemIndex.value === index) {
    selectedItemIndex.value = null; // Deselect
  } else {
    selectedItemIndex.value = index; // Select
  }
};

const moveSelectedItem = (direction) => {
  if (selectedItemIndex.value === null) return;

  const currentIndex = selectedItemIndex.value;
  let newIndex;

  if (direction === "up" && currentIndex > 0) {
    newIndex = currentIndex - 1;
  } else if (
    direction === "down" &&
    currentIndex < localItems.value.length - 1
  ) {
    newIndex = currentIndex + 1;
  } else {
    return;
  }

  moveItem(currentIndex, newIndex);
  selectedItemIndex.value = newIndex; // Update selection to follow the item
};

const deselectItem = () => {
  selectedItemIndex.value = null;
};

// Animation hooks
const beforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = "translateX(-30px)";
};

const enter = (el, done) => {
  const delay = el.dataset.index * 100;
  setTimeout(() => {
    el.style.transition = "all 0.3s ease";
    el.style.opacity = 1;
    el.style.transform = "translateX(0)";
    done();
  }, delay);
};

// Emit answer updates
const emitAnswerUpdate = () => {
  const answerData = {
    orderedItems: localItems.value.map((item) => item.id),
  };

  const emit = getCurrentInstance()?.emit;
  if (emit) {
    emit("answerUpdated", answerData);
  }
};

// Utility to get current Vue instance
const getCurrentInstance = () => {
  try {
    return require("vue").getCurrentInstance();
  } catch {
    return null;
  }
};
</script>

<style scoped>
.reorder-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.question-text {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  line-height: 1.4;
}

/* Instructions */
.instructions-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border: 2px solid #42a5f5;
  border-radius: 16px;
  padding: 16px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(66, 165, 245, 0.2);
}

.instruction-icon {
  font-size: 1.8rem;
  animation: pulse-icon 2s infinite ease-in-out;
}

@keyframes pulse-icon {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.instruction-text {
  font-weight: 600;
  color: #1565c0;
  font-size: 1rem;
}

/* Reorder Area */
.reorder-area {
  position: relative;
  min-height: 200px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Reorder Items */
.reorder-item {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #fff, #f8f9ff);
  border: 3px solid #e0e7ff;
  border-radius: 16px;
  padding: 16px;
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.reorder-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #c7d2fe;
}

.reorder-item.selected {
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2), 0 8px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.reorder-item.dragging {
  opacity: 0.8;
  transform: rotate(3deg) scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  cursor: grabbing;
}

.reorder-item.drag-over {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

/* Item Number */
.item-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease;
}

.reorder-item:hover .item-number {
  transform: scale(1.1);
}

.number-text {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Item Content */
.item-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
}

/* Drag Handle */
.drag-handle {
  display: flex;
  align-items: center;
  padding: 8px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.reorder-item:hover .drag-handle {
  opacity: 0.8;
}

.handle-lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.handle-lines span {
  width: 20px;
  height: 2px;
  background-color: #6b7280;
  border-radius: 1px;
  transition: background-color 0.3s ease;
}

.reorder-item:hover .handle-lines span {
  background-color: #4b5563;
}

/* Status Icon */
.status-icon {
  margin-left: 12px;
  font-size: 1.8rem;
}

.correct .status-icon {
  color: #10b981;
  animation: bounce-in 0.5s ease;
}

.incorrect .status-icon {
  color: #ef4444;
  animation: shake 0.5s ease;
}

/* Item States */
.reorder-item.correct {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

.reorder-item.incorrect {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
}

/* Magic Sparkles */
.magic-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 1.2rem;
  animation: sparkle-float 2s infinite ease-in-out;
  color: #fbbf24;
}

.sparkle:nth-child(1) {
  top: 10%;
  left: 80%;
  animation-delay: 0s;
}
.sparkle:nth-child(2) {
  top: 70%;
  left: 85%;
  animation-delay: 0.5s;
}
.sparkle:nth-child(3) {
  top: 30%;
  left: 75%;
  animation-delay: 1s;
}
.sparkle:nth-child(4) {
  top: 50%;
  left: 90%;
  animation-delay: 1.5s;
}

@keyframes sparkle-float {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px) scale(1.2);
  }
}

/* Drop Zone Indicator */
.drop-zone-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(59, 130, 246, 0.1);
  border: 3px dashed #3b82f6;
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(4px);
  animation: pulse-drop-zone 1.5s infinite ease-in-out;
}

@keyframes pulse-drop-zone {
  0%,
  100% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
}

.drop-icon {
  font-size: 2rem;
}

.drop-text {
  font-weight: 600;
  font-size: 1rem;
}

/* Mobile Controls */
.mobile-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  padding: 16px;
  background: rgba(244, 244, 245, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(4px);
}

.move-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
}

/* Result Summary */
.result-summary {
  margin-top: 24px;
  animation: slide-up 0.5s ease-out;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 2px solid #0ea5e9;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
}

.summary-icon {
  font-size: 2.5rem;
  animation: bounce-summary 2s infinite ease-in-out;
}

@keyframes bounce-summary {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

.summary-text {
  flex: 1;
}

.score-text {
  font-size: 1.3rem;
  font-weight: bold;
  color: #0c4a6e;
  margin-bottom: 4px;
}

.encouragement-text {
  font-size: 1rem;
  color: #0369a1;
  font-weight: 500;
}

/* Animations */
@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
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

.bounce-correct {
  animation: bounce-correct 0.6s ease;
}

@keyframes bounce-correct {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.shake-incorrect {
  animation: shake-incorrect 0.5s ease;
}

@keyframes shake-incorrect {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* Transitions */
.reorder-item-move,
.reorder-item-enter-active,
.reorder-item-leave-active {
  transition: all 0.3s ease;
}

.reorder-item-enter-from,
.reorder-item-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.reorder-item-leave-active {
  position: absolute;
}

/* Responsive Design */
@media (max-width: 768px) {
  .reorder-container {
    max-width: 100%;
    padding: 0 8px;
  }

  .reorder-item {
    padding: 12px;
  }

  .item-number {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }

  .number-text {
    font-size: 1rem;
  }

  .item-text {
    font-size: 1rem;
  }

  .instructions-card {
    padding: 12px 16px;
    margin-bottom: 16px;
  }

  .instruction-text {
    font-size: 0.9rem;
  }
}

/* Accessibility */
.reorder-item:focus {
  outline: 3px solid #4f46e5;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .reorder-item {
    border-width: 3px;
    border-color: #000;
  }

  .reorder-item.correct {
    border-color: #008000;
  }

  .reorder-item.incorrect {
    border-color: #ff0000;
  }
}
</style>
