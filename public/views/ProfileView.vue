<template>
  <v-container fluid class="profile-adventure-page pa-0">
    <!-- Floating Background Elements -->
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

    <!-- Hero Section with Character -->
    <v-sheet
      class="hero-section d-flex align-center justify-center text-center"
      min-height="400px"
    >
      <v-row justify="center" align="center">
        <v-col cols="12">
          <!-- Interactive Mascot -->
          <div class="mascot-container mb-6">
            <div class="main-mascot bounce-animation" @click="playWelcomeSound">
              🎓
            </div>
            <div class="mascot-speech-bubble pulse-animation">
              <span class="speech-text">Look at your amazing progress!</span>
              <div class="bubble-sparkles">✨💫✨</div>
            </div>
          </div>

          <!-- Animated Title -->
          <h1 class="hero-title rainbow-text mb-4 title-bounce">
            🌟 Your Learning Profile! 🌟
          </h1>

          <p class="hero-subtitle animate-fade-in mb-6">
            🎯 Track your journey to becoming a learning champion!
            <br />🏆 Every lesson completed makes you stronger!
          </p>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container text-center">
      <div class="loading-character spin-animation">🎪</div>
      <h2 class="loading-text rainbow-text">Loading Your Amazing Profile...</h2>
      <p class="loading-subtitle">Gathering all your achievements!</p>
      <div class="loading-dots">
        <span class="dot dot-1"></span>
        <span class="dot dot-2"></span>
        <span class="dot dot-3"></span>
      </div>
    </div>

    <!-- Error State -->
    <v-row
      v-else-if="apiError"
      justify="center"
      align="center"
      class="fill-height my-8"
    >
      <v-col cols="12" md="8">
        <div class="error-container text-center">
          <div class="error-character shake-animation">😅</div>
          <div class="error-card">
            <h3 class="error-title">Oops! Adventure Map Lost!</h3>
            <p class="error-message">{{ apiError }}</p>
            <p class="error-sub">
              Don't worry, we'll find your progress faster than you can say
              "Learning Champion!"
            </p>
            <v-btn
              @click="fetchProfileData"
              color="primary"
              size="large"
              class="retry-btn magic-btn"
              prepend-icon="mdi-refresh"
            >
              <span class="btn-text">Try the Magic Again!</span>
              <div class="btn-sparkles">✨</div>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-container v-else-if="userProfile" class="main-content">
      <v-row class="profile-content-fade-in">
        <!-- Left Column - Profile Card -->
        <v-col cols="12" lg="4">
          <!-- User Profile Card -->
          <v-card
            class="profile-card magic-card text-center pa-6"
            elevation="16"
          >
            <div class="card-glow glow-profile"></div>

            <!-- Avatar Section -->
            <div class="avatar-container">
              <div class="avatar-ring pulse-ring"></div>
              <v-avatar
                color="amber-lighten-2"
                size="140"
                class="elevation-8 user-avatar"
              >
                <v-icon color="amber-darken-3" size="80"
                  >mdi-account-star</v-icon
                >
              </v-avatar>
              <div class="sparkle s1 twinkle-animation">✨</div>
              <div class="sparkle s2 twinkle-animation">🌟</div>
              <div class="sparkle s3 twinkle-animation">💫</div>
              <div class="level-badge">
                <div class="level-icon">🎯</div>
                <span class="level-text">Level {{ getUserLevel() }}</span>
              </div>
            </div>

            <!-- User Info -->
            <v-card-title class="user-name mt-4">
              {{ userProfile.fullName }}
            </v-card-title>
            <v-card-subtitle class="user-email mb-4">
              {{ userProfile.email }}
            </v-card-subtitle>

            <!-- Points Display -->
            <div class="points-section mb-4">
              <div class="points-display">
                <div
                  class="points-circle bounce-on-hover"
                  @click="playSound('success')"
                >
                  <div class="points-number">{{ userProfile.totalPoints }}</div>
                  <div class="points-label">POINTS</div>
                  <div class="points-shine"></div>
                </div>
              </div>
              <div class="points-message mt-3">
                <span class="motivational-text">{{
                  getMotivationalMessage()
                }}</span>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="quick-stats mt-4">
              <div class="stat-item">
                <div class="stat-icon">📚</div>
                <div class="stat-number">{{ getCompletedLessons() }}</div>
                <div class="stat-label">Lessons</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🏆</div>
                <div class="stat-number">
                  {{ userProfile.earnedBadges?.length || 0 }}
                </div>
                <div class="stat-label">Badges</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">⭐</div>
                <div class="stat-number">{{ getUserLevel() }}</div>
                <div class="stat-label">Level</div>
              </div>
            </div>
          </v-card>

          <!-- Achievement Badges Card -->
          <v-card class="mt-6 badges-card magic-card" elevation="16">
            <div class="card-glow glow-badges"></div>

            <v-card-title class="card-header">
              <div class="header-icon rotate-animation">🏆</div>
              <span class="header-text">My Awesome Badges Collection</span>
            </v-card-title>
            <v-divider class="mx-4"></v-divider>

            <v-card-text
              v-if="userProfile.earnedBadges && userProfile.earnedBadges.length"
              class="pa-5"
            >
              <div class="badges-grid">
                <div
                  v-for="(badge, index) in userProfile.earnedBadges"
                  :key="badge.name"
                  class="badge-item"
                  :style="{ '--animation-delay': `${index * 100}ms` }"
                >
                  <v-tooltip location="top" :text="badge.description">
                    <template v-slot:activator="{ props }">
                      <div
                        v-bind="props"
                        class="badge-container"
                        @click="playSound('click')"
                      >
                        <div class="badge-glow"></div>
                        <v-avatar
                          size="80"
                          class="badge-avatar"
                          :image="badge.imageUrl || generateBadgeImage(index)"
                        >
                          <v-icon v-if="!badge.imageUrl" size="40">{{
                            getBadgeIcon(index)
                          }}</v-icon>
                        </v-avatar>
                        <div class="badge-stars">
                          <span class="star" v-for="n in 3" :key="n">⭐</span>
                        </div>
                      </div>
                    </template>
                  </v-tooltip>
                  <div class="badge-name">{{ badge.name }}</div>
                </div>
              </div>
            </v-card-text>

            <v-card-text v-else class="empty-state pa-6">
              <div class="empty-state-character bounce-animation">🗺️</div>
              <h4 class="empty-state-title">Badge Adventure Awaits!</h4>
              <p class="empty-state-message">
                Complete lessons and exercises to unlock amazing badges!
                <br />Your first badge is just one lesson away! 🎯
              </p>
              <v-btn
                color="primary"
                variant="elevated"
                class="magic-btn mt-3"
                @click="$router.push('/')"
              >
                <span>Start Learning!</span>
                <v-icon end>mdi-rocket-launch</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column - Learning Journey -->
        <v-col cols="12" lg="8">
          <!-- Learning Journey Card -->
          <v-card elevation="16" class="journey-card magic-card">
            <div class="card-glow glow-journey"></div>

            <v-card-title class="card-header">
              <div class="header-icon pulse-animation">🚀</div>
              <span class="header-text">Your Amazing Learning Journey</span>
              <v-spacer></v-spacer>
              <v-chip
                color="green-accent-4"
                variant="elevated"
                prepend-icon="mdi-trending-up"
                class="progress-chip"
              >
                {{ getOverallProgress() }}% Complete
              </v-chip>
            </v-card-title>
            <v-divider class="mx-4"></v-divider>

            <!-- Progress Overview -->
            <div class="progress-overview pa-4">
              <div class="progress-bar-container">
                <div class="progress-label">Overall Learning Progress</div>
                <div class="progress-bar rainbow-progress">
                  <div
                    class="progress-fill"
                    :style="{ width: `${getOverallProgress()}%` }"
                  >
                    <div class="progress-shine"></div>
                  </div>
                </div>
                <div class="progress-percentage">
                  {{ getOverallProgress() }}%
                </div>
              </div>
            </div>

            <!-- Lessons Progress List -->
            <v-list lines="three" class="transparent-list pa-4">
              <template
                v-for="(item, index) in lessonProgress"
                :key="item.lessonId"
              >
                <v-list-item
                  class="lesson-progress-item"
                  :style="{ '--animation-delay': `${index * 150}ms` }"
                >
                  <template v-slot:prepend>
                    <div
                      class="lesson-icon-container"
                      :class="{ completed: item.isCompleted }"
                    >
                      <div class="lesson-icon">
                        {{ item.isCompleted ? "🏆" : "📖" }}
                      </div>
                      <div
                        class="completion-ring"
                        v-if="item.isCompleted"
                      ></div>
                    </div>
                  </template>

                  <v-list-item-title class="lesson-title">
                    <span class="title-text">{{ item.lessonTitle }}</span>
                    <v-chip
                      v-if="item.isCompleted"
                      size="small"
                      color="green-accent-4"
                      variant="elevated"
                      class="ml-2 completion-chip"
                    >
                      Mastered! ✨
                    </v-chip>
                  </v-list-item-title>

                  <v-list-item-subtitle class="lesson-details">
                    <div class="points-earned">
                      <v-icon size="small" color="amber-darken-2"
                        >mdi-star</v-icon
                      >
                      <span>{{ item.pointsEarned }} Points Earned</span>
                    </div>
                    <div class="completion-date" v-if="item.isCompleted">
                      <v-icon size="small" color="green"
                        >mdi-calendar-check</v-icon
                      >
                      <span
                        >Completed {{ formatDate(item.completedDate) }}</span
                      >
                    </div>
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="lesson-actions">
                      <v-btn
                        v-if="!item.isCompleted"
                        size="small"
                        color="primary"
                        variant="elevated"
                        class="continue-btn"
                        @click="continueLearning(item)"
                      >
                        Continue
                        <v-icon end size="small">mdi-play-circle</v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        size="small"
                        color="green"
                        variant="outlined"
                        class="review-btn"
                        @click="reviewLesson(item)"
                      >
                        Review
                        <v-icon end size="small">mdi-refresh</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
                <v-divider
                  v-if="index < lessonProgress.length - 1"
                  class="mx-4 my-2"
                ></v-divider>
              </template>
            </v-list>

            <!-- Empty State for Journey -->
            <div v-if="!lessonProgress.length" class="empty-state pa-8">
              <div class="empty-state-character bounce-animation">🚀</div>
              <h4 class="empty-state-title">Your Learning Adventure Begins!</h4>
              <p class="empty-state-message">
                Start your first lesson to see your amazing progress here!
                <br />Every step forward makes you a learning champion! 🎯
              </p>
              <v-btn
                color="primary"
                size="x-large"
                variant="elevated"
                class="magic-btn mt-4"
                @click="startFirstLesson"
              >
                <span>Begin Your Adventure!</span>
                <v-icon end>mdi-rocket-launch</v-icon>
                <div class="btn-sparkles">🌟✨🌟</div>
              </v-btn>
            </div>
          </v-card>

          <!-- Motivational Section -->
          <v-card class="mt-6 motivation-card magic-card" elevation="16">
            <div class="card-glow glow-motivation"></div>

            <v-card-text class="pa-6">
              <div class="motivation-content text-center">
                <div class="motivation-characters">
                  <div class="main-character pulse-animation">🌟</div>
                  <div class="supporting-characters">
                    <span class="support-char char-1 float-animation">🎨</span>
                    <span class="support-char char-2 bounce-animation">🎯</span>
                    <span class="support-char char-3 rotate-animation">🏆</span>
                    <span class="support-char char-4 pulse-animation">🚀</span>
                  </div>
                </div>

                <h3 class="motivation-title rainbow-text mb-4">
                  {{ getDynamicMotivationTitle() }}
                </h3>

                <p class="motivation-text mb-4">
                  {{ getDynamicMotivationMessage() }}
                </p>

                <div class="achievement-goals">
                  <div
                    class="goal-item"
                    v-for="goal in getNextGoals()"
                    :key="goal.text"
                  >
                    <div class="goal-icon">{{ goal.icon }}</div>
                    <div class="goal-text">{{ goal.text }}</div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

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
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";

// --- State Management ---
const store = useStore();
const router = useRouter();
const userProfile = ref(null);
const lessonProgress = ref([]);
const isLoading = ref(true);
const apiError = ref(null);
const successMessages = ref([]);
const floatingShapes = ref([]);

// Get the logged-in user from Vuex
const currentUser = computed(() => store.getters.currentUser);

// --- UI Helper Functions ---
const getUserLevel = () => {
  const points = userProfile.value?.totalPoints || 0;
  return Math.floor(points / 100) + 1;
};

const getCompletedLessons = () => {
  return lessonProgress.value.filter((lesson) => lesson.isCompleted).length;
};

const getOverallProgress = () => {
  if (!lessonProgress.value.length) return 0;
  const completed = getCompletedLessons();
  return Math.round((completed / lessonProgress.value.length) * 100);
};

const getMotivationalMessage = () => {
  const points = userProfile.value?.totalPoints || 0;
  const messages = [
    "🌟 Amazing Start!",
    "🎯 Keep Going Champion!",
    "🏆 You're Doing Great!",
    "🚀 Superstar Learner!",
    "💎 Learning Genius!",
  ];
  return messages[Math.floor(points / 200) % messages.length];
};

const getDynamicMotivationTitle = () => {
  const progress = getOverallProgress();
  if (progress >= 80) return "You're Almost There, Champion! 🏆";
  if (progress >= 50) return "Halfway to Victory! 🎯";
  if (progress >= 20) return "Great Progress, Superstar! ⭐";
  return "Your Learning Journey Starts Here! 🚀";
};

const getDynamicMotivationMessage = () => {
  const progress = getOverallProgress();
  if (progress >= 80)
    return "Just a few more lessons to become a complete learning champion! You've got this!";
  if (progress >= 50)
    return "You're making incredible progress! Keep up the amazing work and you'll reach the top!";
  if (progress >= 20)
    return "Every lesson completed makes you stronger! You're building amazing knowledge!";
  return "Every great learner started with their first lesson. Click any course to begin your incredible adventure!";
};

const getNextGoals = () => {
  const completed = getCompletedLessons();
  const badges = userProfile.value?.earnedBadges?.length || 0;

  return [
    {
      icon: "📚",
      text: `Complete ${Math.max(
        1,
        (Math.floor(completed / 5) + 1) * 5
      )} lessons`,
    },
    { icon: "🏆", text: `Earn ${badges + 1} badge${badges === 0 ? "" : "s"}` },
    { icon: "⭐", text: `Reach Level ${getUserLevel() + 1}` },
  ];
};

const getBadgeIcon = (index) => {
  const icons = [
    "mdi-trophy",
    "mdi-star",
    "mdi-medal",
    "mdi-crown",
    "mdi-shield-star",
    "mdi-diamond",
  ];
  return icons[index % icons.length];
};

const generateBadgeImage = (index) => {
  const colors = ["4CAF50", "2196F3", "FF9800", "E91E63", "9C27B0", "00BCD4"];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/80x80/${color}/ffffff?text=★`;
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// --- Navigation Functions ---
const continueLearning = (lesson) => {
  playSound("click");
  showSuccessMessage("Let's continue your amazing journey! 🚀");
  // Navigate to lesson
  router.push(`/lesson/${lesson.lessonId}`);
};

const reviewLesson = (lesson) => {
  playSound("click");
  showSuccessMessage("Great idea to review! 📚");
  // Navigate to lesson review
  router.push(`/lesson/${lesson.lessonId}`);
};

const startFirstLesson = () => {
  playSound("success");
  showSuccessMessage("Your adventure begins now! 🌟");
  router.push("/");
};

// --- API Calls ---
const fetchProfileData = async () => {
  if (!currentUser.value?.id) {
    apiError.value =
      "Could not identify the current user. Please log in again.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    apiError.value = null;
    const userId = currentUser.value.id;

    // Add loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const profilePromise = axios.get(`/api/auth/${userId}/profile`);
    const progressPromise = axios.get(`/api/users/${userId}/progress/lessons`);

    const [profileResponse, progressResponse] = await Promise.all([
      profilePromise,
      progressPromise,
    ]);

    if (profileResponse.data?.success) {
      userProfile.value = profileResponse.data.data;
      playSuccessSound();
    } else {
      throw new Error(
        profileResponse.data?.message || "Failed to load profile details."
      );
    }

    if (progressResponse.data?.success) {
      lessonProgress.value = progressResponse.data.data;
    } else {
      console.warn(
        "Could not load lesson progress:",
        progressResponse.data?.message
      );
    }
  } catch (error) {
    console.error("API Error fetching profile data:", error);
    apiError.value =
      "We had trouble connecting to get your amazing profile. Let's try again!";
    playErrorSound();
  } finally {
    isLoading.value = false;
  }
};

// --- Sound Effects ---
const playWelcomeSound = () => playSound("welcome");
const playSuccessSound = () => playSound("success");
const playErrorSound = () => playSound("error");

const playSound = (type) => {
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
      case "error":
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
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

// --- Success Messages ---
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

// --- Generate Floating Shapes ---
const generateFloatingShapes = () => {
  const emojis = ["⭐", "🏆", "📚", "🎯", "💎", "✨", "🌟", "🎨"];
  const shapes = [];
  for (let i = 0; i < 20; i++) {
    shapes.push({
      id: `shape-${i}`,
      emoji: emojis[i % emojis.length],
      style: {
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        fontSize: `${Math.random() * 1.5 + 1}rem`,
        animationDuration: `${Math.random() * 20 + 15}s`,
        animationDelay: `${Math.random() * 15}s`,
      },
    });
  }
  floatingShapes.value = shapes;
};

// --- Lifecycle Hook ---
onMounted(() => {
  generateFloatingShapes();
  fetchProfileData();
});
</script>
<style scoped>
/* Base Styles */
.profile-adventure-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: "Comic Neue", cursive;
}

/* Floating Background Elements */
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-shape {
  position: absolute;
  opacity: 0;
  animation: float-up linear infinite;
  color: white;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

@keyframes float-up {
  0% {
    transform: translateY(10vh);
    opacity: 0;
  }
  10%,
  90% {
    opacity: 0.6;
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
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 2;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    repeat;
}

/* Mascot */
.mascot-container {
  position: relative;
  z-index: 2;
  display: inline-block;
}

.main-mascot {
  font-size: 6rem;
  cursor: pointer;
  display: inline-block;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.main-mascot:hover {
  transform: scale(1.15) rotate(5deg);
}

.bounce-animation {
  animation: mascot-bounce 2s ease-in-out infinite;
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

.bubble-sparkles {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  animation: twinkle-animation 1.5s infinite;
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

/* Hero Titles & Subtitles */
.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
}

.title-bounce {
  animation: title-bounce-in 1s ease-out forwards 0.5s;
}

@keyframes title-bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-in forwards 1s;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading & Error States */
.loading-container,
.error-container {
  padding: 40px;
  color: white;
  z-index: 10;
  position: relative;
}

.loading-character,
.error-character {
  font-size: 6rem;
  display: inline-block;
  margin-bottom: 1rem;
}

.loading-text {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.loading-subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
}

.loading-dots {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #fff;
  margin: 0 5px;
  animation: loading-bounce 1.4s infinite ease-in-out both;
}
.dot-1 {
  animation-delay: -0.32s;
}
.dot-2 {
  animation-delay: -0.16s;
}

@keyframes loading-bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
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

.error-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 20px;
  color: #333;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.error-title {
  color: #e91e63;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.shake-animation {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
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

/* Main Content Layout */
.main-content {
  z-index: 2;
  position: relative;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.profile-content-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

/* Magic Card Base Style */
.magic-card {
  position: relative;
  border-radius: 24px !important;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  overflow: hidden;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.magic-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 16px 40px 0 rgba(31, 38, 135, 0.5);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  animation: rotate-glow 15s linear infinite;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.magic-card:hover .card-glow {
  opacity: 1;
}

@keyframes rotate-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1.5rem;
}

.header-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

/* Profile Card */
.avatar-container {
  position: relative;
  display: inline-block;
  margin-top: -80px;
}

.user-avatar {
  border: 6px solid white;
}

.avatar-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  border: 4px dashed #ffeb3b;
  animation: pulse-ring-animation 3s infinite;
}

@keyframes pulse-ring-animation {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

.sparkle {
  position: absolute;
  color: #ffeb3b;
  font-size: 1.5rem;
}
.s1 {
  top: 10%;
  right: 0;
}
.s2 {
  bottom: 0;
  left: 10%;
}
.s3 {
  top: 20%;
  left: 0;
}

.twinkle-animation {
  animation: twinkle-animation 2s infinite ease-in-out;
}
@keyframes twinkle-animation {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.level-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #ffc107, #ff9800);
  color: white;
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
}

.level-icon {
  margin-right: 4px;
}

.user-name {
  font-size: 2rem;
  font-weight: bold;
}
.user-email {
  opacity: 0.8;
}

.points-section {
  position: relative;
}
.points-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #1a2a42;
  margin: 0 auto;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(56, 249, 215, 0.4);
  transition: transform 0.2s ease-out;
}
.points-circle:hover {
  transform: scale(1.05);
}

.points-number {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
}
.points-label {
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 2px;
}
.points-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(25deg);
  opacity: 0.7;
}

.motivational-text {
  font-style: italic;
  font-size: 1.1rem;
  color: #ffeb3b;
}

.quick-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}
.stat-icon {
  font-size: 2rem;
}
.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
}
.stat-label {
  opacity: 0.8;
}

/* Badges Card */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 1.5rem;
}
.badge-item {
  text-align: center;
  opacity: 0;
  animation: badge-fade-in 0.5s ease-out forwards;
  animation-delay: var(--animation-delay);
}
@keyframes badge-fade-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.badge-container {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.badge-container:hover {
  transform: scale(1.15);
}
.badge-avatar {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border: 3px solid #ffd700;
}
.badge-glow {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background: radial-gradient(circle, #ffd700 30%, transparent 70%);
  filter: blur(10px);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.badge-container:hover .badge-glow {
  opacity: 0.7;
}
.badge-stars {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}
.badge-name {
  margin-top: 0.5rem;
  font-weight: bold;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Learning Journey Card */
.progress-overview {
  text-align: center;
}
.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.progress-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.progress-bar {
  flex-grow: 1;
  height: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}
.progress-fill {
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(90deg, #43e97b, #38f9d7, #2196f3, #9c27b0);
  background-size: 200% 200%;
  transition: width 1s ease-out;
  animation: rainbow-bg 3s ease infinite;
  position: relative;
}
.progress-shine {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shine-anim 2s infinite linear;
}

@keyframes shine-anim {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

.progress-percentage {
  font-weight: bold;
  font-size: 1.2rem;
}

.transparent-list {
  background: transparent !important;
}

.lesson-progress-item {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 1rem;
  transition: background 0.3s ease;
  opacity: 0;
  animation: lesson-fade-in 0.6s ease-out forwards;
  animation-delay: var(--animation-delay);
}

@keyframes lesson-fade-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.lesson-progress-item:hover {
  background: rgba(0, 0, 0, 0.4);
}

.lesson-icon-container {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4a5568;
  border: 3px solid #718096;
}
.lesson-icon-container.completed {
  background: #38a169;
  border-color: #48bb78;
}
.lesson-icon {
  font-size: 2rem;
}
.completion-ring {
  position: absolute;
  inset: -4px;
  border: 3px solid #68d391;
  border-radius: 50%;
  animation: pulse-ring-animation 2s infinite;
}
.lesson-title .title-text {
  font-weight: bold;
  font-size: 1.2rem;
}
.lesson-details {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  align-items: center;
  opacity: 0.9;
}
.points-earned,
.completion-date {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Empty State Styles */
.empty-state {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}
.empty-state-character {
  font-size: 4rem;
  margin-bottom: 1rem;
}
.empty-state-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}
.empty-state-message {
  font-size: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

/* Motivational Card */
.motivation-content {
  position: relative;
}
.motivation-characters {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.main-character {
  font-size: 4rem;
  display: inline-block;
}
.support-char {
  position: absolute;
  font-size: 2rem;
}
.char-1 {
  top: 0;
  left: 20%;
  animation-delay: 0.2s;
}
.char-2 {
  top: 50%;
  left: 10%;
  animation-delay: 0.4s;
}
.char-3 {
  top: 10%;
  right: 20%;
  animation-delay: 0.6s;
}
.char-4 {
  top: 60%;
  right: 15%;
  animation-delay: 0.8s;
}

.float-animation {
  animation: mascot-bounce 3s ease-in-out infinite;
}
.rotate-animation {
  animation: spin 4s linear infinite;
}

.motivation-title {
  font-size: 2rem;
  font-weight: bold;
}
.motivation-text {
  font-size: 1.1rem;
  opacity: 0.9;
}

.achievement-goals {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}
.goal-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;
}
.goal-item:hover {
  background: rgba(0, 0, 0, 0.5);
}
.goal-icon {
  font-size: 1.5rem;
}
.goal-text {
  font-weight: bold;
}

/* General Animations & Effects */
.pulse-animation {
  animation: pulse-effect 2s infinite;
}

@keyframes pulse-effect {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.rainbow-text {
  background: linear-gradient(
    90deg,
    #f093fb,
    #f5576c,
    #f7941d,
    #ffeb3b,
    #764ba2,
    #667eea,
    #f093fb
  );
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow-bg 4s linear infinite;
}

@keyframes rainbow-bg {
  to {
    background-position: 200% center;
  }
}

/* Button Styles */
.magic-btn {
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: bold;
}
.magic-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.magic-btn .btn-sparkles {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 20%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 80%
  );
  animation: btn-shine 3s infinite linear;
}
@keyframes btn-shine {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

/* Success Messages */
.success-messages {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.success-message {
  position: absolute;
  background: rgba(45, 211, 111, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: success-float-up 3s ease-out forwards;
}

@keyframes success-float-up {
  0% {
    transform: translateY(0) scale(0.5);
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
