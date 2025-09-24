<template>
  <v-container fluid class="pa-0 lesson-detail-adventure-page">
    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 7" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape book" v-for="n in 4" :key="'book-' + n">
        📚
      </div>
      <div class="floating-shape idea" v-for="n in 3" :key="'idea-' + n">
        💡
      </div>
    </div>

    <v-container class="lesson-main-content mt-n16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div v-if="isLoading" class="loading-container text-center">
            <div class="loading-character spin-animation">🧠</div>
            <h2 class="loading-text">Unpacking Your Awesome Lesson...</h2>
            <p class="loading-subtitle">Get ready for some fun learning!</p>
            <v-progress-linear
              indeterminate
              color="amber"
              height="8"
              rounded
              class="mt-4"
            ></v-progress-linear>
          </div>

          <div v-else-if="lesson">
            <div class="lesson-header-card mb-8">
              <div class="header-mascot">🦉</div>
              <h1 class="lesson-main-title">{{ lesson.title }}</h1>
              <div class="lesson-progress-bar mt-4">
                <div class="progress-label">
                  Step {{ currentContentIndex + 1 }} of
                  {{ lesson.contents.length }}
                </div>
                <v-progress-linear
                  :model-value="lessonProgressPercentage"
                  color="yellow-lighten-2"
                  height="15"
                  rounded
                  striped
                >
                  <strong>{{ Math.ceil(lessonProgressPercentage) }}%</strong>
                </v-progress-linear>
              </div>
            </div>

            <transition name="slide-fade" mode="out-in">
              <v-card
                class="content-card"
                :key="currentContentIndex"
                elevation="16"
              >
                <div v-if="currentContent" class="content-block">
                  <div
                    v-if="currentContent.type === 'Header'"
                    class="text-content"
                  >
                    <h2 class="content-header">
                      <span class="header-icon">✨</span>
                      {{ currentContent.textContent }}
                    </h2>
                  </div>

                  <div
                    v-else-if="currentContent.type === 'Paragraph'"
                    class="text-content"
                  >
                    <p
                      class="content-paragraph"
                      v-html="currentContent.textContent"
                    ></p>
                    <v-btn
                      icon="mdi-volume-high"
                      variant="tonal"
                      color="deep-purple-accent-2"
                      @click="speakText(currentContent.textContent)"
                      class="speech-btn"
                    ></v-btn>
                  </div>

                  <v-img
                    v-else-if="
                      currentContent.type === 'Image' && currentContent.imageUrl
                    "
                    :src="currentContent.imageUrl"
                    class="content-image rounded-lg"
                    contain
                    max-height="500"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey-lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>

                  <div
                    v-else-if="
                      currentContent.type === 'Video' && currentContent.videoUrl
                    "
                    class="video-container my-5"
                  >
                    <iframe
                      :src="getYouTubeEmbedUrl(currentContent.videoUrl)"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              </v-card>
            </transition>

            <div class="navigation-controls mt-8">
              <v-btn
                @click="goToPreviousContent"
                :disabled="currentContentIndex === 0"
                size="large"
                class="nav-btn prev-btn"
                color="blue-grey"
                variant="elevated"
                prepend-icon="mdi-arrow-left-circle"
              >
                Back
              </v-btn>

              <v-btn
                v-if="!isLessonComplete"
                @click="goToNextContent"
                size="x-large"
                class="nav-btn next-btn"
                color="green-accent-4"
                variant="elevated"
                append-icon="mdi-arrow-right-circle"
              >
                Next
              </v-btn>

              <div v-else class="final-actions">
                <v-btn
                  v-if="lesson.exerciseCount > 0"
                  color="amber-darken-2"
                  size="x-large"
                  variant="elevated"
                  class="quiz-btn magic-btn"
                  @click="goToQuiz"
                >
                  Ready for the Quiz!
                  <v-icon end>mdi-star-shoot</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  color="deep-purple-accent-3"
                  size="x-large"
                  variant="elevated"
                  class="quiz-btn magic-btn"
                  @click="goToNextLesson"
                >
                  Finish Lesson
                  <v-icon end>mdi-check-circle</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div v-if="showCelebration" class="celebration-overlay">
      <div class="celebration-content">
        <div class="celebration-character bounce-in-scale">🎉</div>
        <h2 class="celebration-title">Lesson Complete!</h2>
        <p class="celebration-message">
          Amazing work! You're a learning superstar! 🌟
        </p>
      </div>
      <div class="confetti-container">
        <div
          class="confetti"
          v-for="n in 50"
          :key="n"
          :style="getConfettiStyle()"
        ></div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/services/api.js";

// --- State Management ---
// Tech Requirement: In a real application, this would come from a global store like Pinia.
// const store = useGlobalStore();
// const isMuted = computed(() => store.isMuted);
const isMuted = ref(false); // Using a local ref for this example.

const props = defineProps({
  lessonId: [String, Number],
});

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const lesson = ref(null);
const currentContentIndex = ref(0);
const showCelebration = ref(false);

// --- Computed Properties ---
const currentContent = computed(() => {
  return lesson.value ? lesson.value.contents[currentContentIndex.value] : null;
});

const isLessonComplete = computed(() => {
  if (!lesson.value) return false;
  return currentContentIndex.value >= lesson.value.contents.length - 1;
});

const lessonProgressPercentage = computed(() => {
  if (!lesson.value || lesson.value.contents.length === 0) return 0;
  return ((currentContentIndex.value + 1) / lesson.value.contents.length) * 100;
});

// --- API Call ---
const fetchLessonDetails = async () => {
  isLoading.value = true;
  try {
    // Performance: Removed artificial 1-second setTimeout delay for faster load times.
    const response = await apiClient.get(
      `/api/EducationalContent/lessons/${props.lessonId}`
    );
    if (response.data.success) {
      lesson.value = response.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch lesson details:", error);
  } finally {
    isLoading.value = false;
  }
};

// --- Navigation ---
const goToNextContent = () => {
  playSound("click");
  if (!isLessonComplete.value) {
    currentContentIndex.value++;
  }
};

const goToPreviousContent = () => {
  playSound("click");
  if (currentContentIndex.value > 0) {
    currentContentIndex.value--;
  }
};

// Logic Change: Celebration is now triggered on final navigation action.
// It serves as a transition screen instead of a timed interruption.
const goToQuiz = () => {
  playSound("success");
  showCelebration.value = true; // Show celebration overlay as a transition
  router.push({
    name: "Quiz",
    params: { ...route.params, lessonId: props.lessonId },
  });
};

const goToNextLesson = () => {
  playSound("success");
  showCelebration.value = true; // Show celebration overlay as a transition
  router.push({ name: "Lessons", params: { unitId: route.params.unitId } });
};

// --- UI & UX Helpers ---
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    let videoId = urlObj.searchParams.get("v");
    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    }
    return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
  } catch (e) {
    console.error("Invalid YouTube URL:", url);
    return "";
  }
};

const speakText = (textToSpeak) => {
  if ("speechSynthesis" in window) {
    playSound("click");
    const utterance = new SpeechSynthesisUtterance(
      textToSpeak.replace(/<[^>]*>?/gm, "")
    );
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Sorry, your browser does not support text-to-speech.");
  }
};

const getConfettiStyle = () => {
  const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#f093fb"];
  return {
    left: `${Math.random() * 100}%`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${Math.random() * 3 + 2}s`,
  };
};

// --- Sound Effects ---
const playSound = (type) => {
  // Tech Requirement: Added mute check before playing any sound.
  if (isMuted.value) return;

  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);

    switch (type) {
      case "click":
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case "success":
      case "celebrate":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.linearRampToValueAtTime(
          1046.5,
          audioContext.currentTime + 0.4
        ); // C6
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

onMounted(fetchLessonDetails);
</script>

<style scoped>
/* --- Base Styles & Background --- */
.lesson-detail-adventure-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  /* Font Change: Switched to Cairo for better readability and language support. */
  font-family: "Cairo", sans-serif;
}

.lesson-main-content {
  position: relative;
  z-index: 5;
  padding-top: 8rem;
  padding-bottom: 4rem;
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
  font-size: clamp(1.5rem, 3vw, 3rem);
  /* Animation Change: Animation is much slower to be less distracting. */
  animation: float-around 60s ease-in-out infinite;
  opacity: 0.4;
}

.floating-shape.star {
  animation-delay: -5s;
}
.floating-shape.book {
  animation-delay: -15s;
}
.floating-shape.idea {
  animation-delay: -25s;
}

@keyframes float-around {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(15vw, -15vh) rotate(90deg);
  }
  50% {
    transform: translate(5vw, -25vh) rotate(180deg);
  }
  75% {
    transform: translate(-15vw, -10vh) rotate(270deg);
  }
}

/* --- Loading State --- */
.loading-container {
  background: rgba(0, 0, 0, 0.2);
  padding: 4rem 2rem;
  border-radius: 24px;
  backdrop-filter: blur(10px);
}
.loading-character {
  font-size: 6rem;
  display: inline-block;
}
.loading-text {
  /* Font Change: Bungee is reserved for H1, using Cairo here for consistency. */
  font-family: "Cairo", sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  color: #fff;
}
.loading-subtitle {
  color: #eee;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}
@keyframes spin-animation {
  to {
    transform: rotate(360deg);
  }
}

/* --- Lesson Header Card --- */
.lesson-header-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.header-mascot {
  font-size: 4rem;
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: #764ba2;
  border-radius: 50%;
  padding: 10px;
  border: 4px solid #fff;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
/* Animation Change: Animation now triggers on user interaction (:hover) */
.header-mascot:hover {
  animation: mascot-bounce 0.8s ease;
}
@keyframes mascot-bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-15px);
  }
}
.lesson-main-title {
  /* Font Change: Bungee is correctly used here for the main title. */
  font-family: "Bungee", cursive;
  color: #fff;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.2;
}
.progress-label {
  color: #fff;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: left;
}

/* --- Content Card --- */
.content-card {
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  background-color: #fdfcff;
}
.content-block {
  padding: clamp(1rem, 5vw, 3rem);
}
.text-content {
  position: relative;
}
.content-header {
  /* Font Change: Bungee font removed for better readability, using Cairo. */
  font-family: "Cairo", sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  /* UI Change: Replaced distracting rainbow animation with a solid, high-contrast color. */
  color: #764ba2;
}
.header-icon {
  margin-right: 10px;
}
.content-paragraph {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  line-height: 1.8;
  color: #333;
  text-align: justify;
}
.speech-btn {
  position: absolute;
  top: 0;
  right: 0;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* --- Content Transitions --- */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-fade-enter-from {
  transform: translateX(50px) scale(0.95);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-50px) scale(0.95);
  opacity: 0;
}

/* UI Change: Removed rainbow text animation for performance and readability. */

/* --- Navigation Controls --- */
.navigation-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}
.nav-btn {
  font-weight: bold;
  border-radius: 50px;
  transition: all 0.3s ease;
}
.nav-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.final-actions {
  width: 100%;
  display: flex;
  justify-content: center;
}
.quiz-btn {
  /* Font Change: Removed Bungee for consistency and readability on buttons. */
  font-weight: 700;
  letter-spacing: 1px;
}

/* --- Celebration Overlay --- */
.celebration-overlay {
  position: fixed;
  inset: 0;
  background: rgba(118, 75, 162, 0.85);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  animation: fade-in-celebration 0.5s forwards;
}
@keyframes fade-in-celebration {
  to {
    opacity: 1;
  }
}
.celebration-content {
  text-align: center;
  color: #fff;
}
.celebration-character {
  font-size: 8rem;
}
.bounce-in-scale {
  animation: bounce-in-scale-anim 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
}
@keyframes bounce-in-scale-anim {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.celebration-title {
  /* Font Change: Using Cairo instead of Bungee for better readability. */
  font-family: "Cairo", sans-serif;
  font-weight: 700;
  font-size: 3rem;
  margin: 1rem 0;
  color: #ffd700; /* Replaced rainbow text with a single bright color. */
}
.celebration-message {
  font-size: 1.2rem;
}

.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  opacity: 0;
  animation: fall 5s linear infinite;
}
@keyframes fall {
  0% {
    transform: translateY(-10vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}
</style>
