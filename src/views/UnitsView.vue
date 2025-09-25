<template>
  <v-container fluid class="pa-0 units-adventure-page">
    <!-- School Header -->
    <div class="school-header">
      <div class="school-name">
        Resala National & International Language School
      </div>
      <div class="department-info">
        English Department • Lower Section • Junior 2
      </div>
    </div>

    <!-- Title Section -->
    <div class="main-title-section">
      <div class="adventure-badge">📚 Learning Adventure</div>
      <h1 class="main-title">Course Units!</h1>
      <div class="subtitle">Choose Your Learning Path</div>
    </div>

    <!-- Back Button -->
    <v-row justify="start" class="mb-4 px-4">
      <v-col cols="12">
        <v-btn
          @click="$router.go(-1)"
          color="deep-purple-accent-3"
          size="large"
          class="back-btn"
          prepend-icon="mdi-arrow-left"
        >
          Back to Course
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="isLoading" justify="center" class="my-8">
      <v-col cols="12" class="text-center mb-6">
        <div class="loading-mascot">
          <div class="loading-character spin-animation">📚</div>
          <h3 class="loading-text">Preparing Your Learning Units...</h3>
          <div class="loading-dots">
            <span class="dot dot-1"></span>
            <span class="dot dot-2"></span>
            <span class="dot dot-3"></span>
          </div>
          <p class="loading-message">Setting up amazing adventures for you!</p>
        </div>
      </v-col>
    </v-row>

    <!-- Units Container -->
    <v-container v-if="!isLoading && units.length > 0" class="units-container">
      <div class="units-grid">
        <div
          v-for="(unit, index) in units"
          :key="unit.id"
          class="unit-item"
          :class="`unit-theme-${index % 6}`"
          @click="selectUnit(unit.id)"
          @mouseenter="playHoverSound"
        >
          <div class="unit-number">{{ index + 1 }}</div>
          <div class="unit-content">
            <div class="unit-title">{{ unit.title }}</div>
            <div class="unit-description">
              {{ unit.description || getDefaultDescription(index) }}
            </div>
          </div>
          <div class="unit-icon">{{ getUnitIcon(index) }}</div>
        </div>
      </div>
    </v-container>

    <!-- Motivation Section -->
    <div class="motivation-section">
      <div class="character-section">
        <div class="mascot" @click="playWelcomeSound">🐻</div>
        <div class="welcome-text">You're Going to Learn Amazing Things!</div>
      </div>
    </div>

    <!-- Success Messages -->
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
import { ref, onMounted, nextTick, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/services/api.js";

// --- STATE MANAGEMENT ---
const props = defineProps({
  courseId: [String, Number],
});

const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const units = ref([]);
const successMessages = ref([]);

const soundStore = reactive({
  isMuted: false,
});

// --- API FUNCTIONS ---
const fetchUnits = async () => {
  isLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const response = await apiClient.get(
      `/api/EducationalContent/courses/${props.courseId}/units`
    );

    if (response.data && response.data.success) {
      units.value = response.data.data;
      playSuccessSound();
    } else {
      throw new Error(response.data.message || "Failed to retrieve units.");
    }
  } catch (error) {
    console.error("Error fetching units:", error);
    showError(
      "Our learning wizards are having a little trouble. Let's try again!"
    );
  } finally {
    isLoading.value = false;
  }
};

// --- NAVIGATION ---
const selectUnit = (unitId) => {
  playClickSound();
  showSuccessMessage("Let's Go! 🚀");

  router.push({
    name: "Lessons",
    params: {
      ...route.params,
      unitId: unitId,
    },
  });
};

// --- UI HELPER FUNCTIONS ---
const getUnitIcon = (index) => {
  const icons = ["🚀", "🌈", "⚽", "☀️", "🏠", "🛏️", "📖", "🔬"];
  return icons[index % icons.length];
};

const getDefaultDescription = (index) => {
  const descriptions = [
    "Beginning our amazing English adventure",
    "Discovering the colorful world around us",
    "Fun activities and exciting challenges",
    "Exploring our daily adventures",
    "Discovering the place we love most",
    "Exploring every special corner",
    "Learn amazing new skills with engaging exercises",
    "Unlock incredible knowledge with creative challenges",
  ];
  return descriptions[index % descriptions.length];
};

// --- SOUND EFFECTS ---
const playWelcomeSound = () => playSound("welcome");
const playHoverSound = () => playSound("hover");
const playClickSound = () => playSound("click");
const playSuccessSound = () => playSound("success");

const playSound = (type) => {
  if (soundStore.isMuted) return;

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
    console.warn("Web Audio API is not supported in this browser.");
  }
};

// --- NOTIFICATIONS & MESSAGES ---
const showSuccessMessage = (text) => {
  const id = Date.now();
  const message = {
    id,
    text,
    style: {
      left: Math.random() * 80 + 10 + "%",
      top: Math.random() * 60 + 20 + "%",
    },
  };
  successMessages.value.push(message);
  setTimeout(() => {
    successMessages.value = successMessages.value.filter((m) => m.id !== id);
  }, 3000);
};

const showError = (message) => {
  console.error(message);
  showSuccessMessage("Oops! Something went wrong. 😕");
};

// --- LIFECYCLE HOOKS ---
onMounted(async () => {
  await fetchUnits();
  await nextTick();
  const cards = document.querySelectorAll(".unit-item");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("animate-in");
    }, index * 150);
  });
});
</script>

<style scoped>
/* Import Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Nunito:wght@300;400;600;700;800&family=Comic+Neue:wght@300;400;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.units-adventure-page {
  font-family: "Nunito", sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

/* School Header */
.school-header {
  text-align: center;
  padding: 30px 20px 20px;
  position: relative;
  z-index: 2;
}

.school-name {
  font-family: "Fredoka One", cursive;
  font-size: 24px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.department-info {
  font-family: "Comic Neue", cursive;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

/* Title Section */
.main-title-section {
  text-align: center;
  padding: 40px 20px;
  position: relative;
  z-index: 2;
}

.adventure-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 25px;
  font-family: "Comic Neue", cursive;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 20px;
  box-shadow: 0 8px 16px rgba(240, 147, 251, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
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

.main-title {
  font-family: "Fredoka One", cursive;
  font-size: 48px;
  color: white;
  margin-bottom: 10px;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.subtitle {
  font-family: "Comic Neue", cursive;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  margin-bottom: 30px;
}

/* Back Button */
.back-btn {
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Loading State */
.loading-character {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.spin-animation {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-family: "Fredoka One", cursive;
  color: white;
  margin-bottom: 1rem;
}

.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.dot {
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
  animation: bounce-dots 1.2s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce-dots {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.loading-message {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

/* Units Container */
.units-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.units-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Unit Item */
.unit-item {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
}

.unit-item.animate-in {
  animation: fade-in-up 0.6s ease-out forwards;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.unit-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

/* Unit Themes */
.unit-theme-0 {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
}
.unit-theme-1 {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
}
.unit-theme-2 {
  background: linear-gradient(135deg, #fffde7 0%, #fff9c4 100%);
}
.unit-theme-3 {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
}
.unit-theme-4 {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}
.unit-theme-5 {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
}

.unit-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Fredoka One", cursive;
  font-size: 18px;
  margin-right: 20px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.unit-content {
  flex: 1;
}

.unit-title {
  font-family: "Comic Neue", cursive;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 5px;
}

.unit-description {
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 400;
  line-height: 1.4;
}

.unit-icon {
  font-size: 32px;
  margin-left: 15px;
  transition: transform 0.3s ease;
}

.unit-item:hover .unit-icon {
  transform: scale(1.2) rotate(10deg);
}

/* Character Section */
.motivation-section {
  padding: 40px 20px;
  text-align: center;
}

.character-section {
  max-width: 400px;
  margin: 0 auto;
}

.mascot {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-bottom: 15px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.mascot:hover {
  transform: scale(1.1);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: scale(1.1) translateY(0);
  }
  40% {
    transform: scale(1.1) translateY(-10px);
  }
  60% {
    transform: scale(1.1) translateY(-5px);
  }
}

.welcome-text {
  font-family: "Comic Neue", cursive;
  font-size: 18px;
  color: white;
  font-weight: 600;
  line-height: 1.4;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Success Messages */
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
  padding: 10px 20px;
  background-color: #ffeb3b;
  color: #333;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  animation: floating-message 3s ease-in-out forwards;
}

@keyframes floating-message {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  30% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -150%) scale(0.8);
    opacity: 0;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-title {
    font-size: 36px;
  }

  .subtitle {
    font-size: 20px;
  }

  .units-container {
    padding: 10px;
  }

  .unit-item {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }

  .unit-number {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .unit-icon {
    margin-left: 0;
    margin-top: 15px;
  }
}

@media (max-width: 480px) {
  .school-name {
    font-size: 18px;
  }

  .main-title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }
}
</style>
