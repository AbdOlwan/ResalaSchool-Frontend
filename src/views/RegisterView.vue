<template>
  <v-container fluid class="pa-0 register-adventure-page">
    <!-- Floating Background Elements -->
    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 20" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape heart" v-for="n in 15" :key="'heart-' + n">
        💖
      </div>
      <div class="floating-shape rocket" v-for="n in 8" :key="'rocket-' + n">
        🚀
      </div>
      <div class="floating-shape book" v-for="n in 6" :key="'book-' + n">
        📚
      </div>
      <div class="floating-shape rainbow" v-for="n in 4" :key="'rainbow-' + n">
        🌈
      </div>
      <div class="floating-shape trophy" v-for="n in 5" :key="'trophy-' + n">
        🏆
      </div>
    </div>

    <!-- Main Registration Container -->
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">
        <!-- Welcome Characters Section -->
        <div class="characters-welcome-section text-center mb-8">
          <div class="character-group">
            <div
              class="welcome-character bounce-animation"
              @click="playWelcomeSound"
            >
              🎓
            </div>
            <div class="character-friends">
              <div class="friend friend-1 float-animation">🌟</div>
              <div class="friend friend-2 pulse-animation">📖</div>
              <div class="friend friend-3 rotate-animation">🎨</div>
            </div>
          </div>

          <div class="character-speech-bubble pulse-animation">
            <span class="speech-text">Join Our Amazing Learning Family!</span>
            <div class="bubble-sparkles">✨💫✨</div>
          </div>

          <h1 class="welcome-title rainbow-text mb-4 title-bounce">
            🌟 Create Your Learning Adventure Account! 🌟
          </h1>

          <p class="welcome-subtitle animate-fade-in">
            🎯 Sign up to start your incredible learning journey!
            <br />🚀 Discover amazing lessons, fun games, and earn awesome
            rewards!
          </p>
        </div>

        <!-- Registration Card -->
        <v-card
          class="registration-card magic-card elevation-24"
          :class="{ 'card-shake': hasError }"
        >
          <!-- Card Glow Effect -->
          <div class="card-glow"></div>

          <!-- Floating Elements on Card -->
          <div class="card-floaters">
            <div class="floater star rotate-animation">⭐</div>
            <div class="floater heart pulse-animation">💖</div>
            <div class="floater magic float-animation">✨</div>
          </div>

          <!-- Card Header -->
          <div class="registration-header">
            <div class="header-icon-container">
              <div class="header-icon bounce-hover">🎯</div>
              <div class="icon-ring"></div>
              <div class="icon-sparkles">
                <span class="sparkle" v-for="n in 6" :key="n">✨</span>
              </div>
            </div>
            <h2 class="header-title">Create Your Account</h2>
            <p class="header-subtitle">
              Join thousands of young learners on an amazing adventure!
            </p>
          </div>

          <!-- Registration Form -->
          <v-card-text class="pa-8">
            <v-form @submit.prevent="handleRegister" class="registration-form">
              <!-- Success Message -->
              <v-alert
                v-if="successMessage"
                type="success"
                variant="tonal"
                class="mb-4 success-alert"
                closable
                @click:close="successMessage = null"
              >
                <div class="alert-content">
                  <span class="alert-icon">🎉</span>
                  {{ successMessage }}
                  <div class="success-celebration">
                    Welcome to our learning family! 🌟
                  </div>
                </div>
              </v-alert>

              <!-- Error Message -->
              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mb-4 error-alert shake-animation"
                closable
                @click:close="clearError"
              >
                <div class="alert-content">
                  <span class="alert-icon">😅</span>
                  {{ errorMessage }}
                  <div class="error-encouragement">
                    Don't worry! Every great learner faces challenges. Try
                    again! 💪
                  </div>
                </div>
              </v-alert>

              <!-- Full Name Field -->
              <div class="input-group mb-4">
                <label class="input-label">
                  <span class="label-icon">👤</span>
                  Your Amazing Name
                </label>
                <v-text-field
                  v-model="fullName"
                  type="text"
                  variant="outlined"
                  class="magic-input"
                  :class="{ 'input-error': nameError }"
                  placeholder="What should we call you, champion?"
                  :rules="[rules.required]"
                  @focus="playFocusSound"
                  @blur="validateName"
                  hide-details="auto"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="input-icon">mdi-account-star</v-icon>
                  </template>
                </v-text-field>
              </div>

              <!-- Email Field -->
              <div class="input-group mb-4">
                <label class="input-label">
                  <span class="label-icon">📧</span>
                  Your Email Address
                </label>
                <v-text-field
                  v-model="email"
                  type="email"
                  variant="outlined"
                  class="magic-input"
                  :class="{ 'input-error': emailError }"
                  placeholder="Where can we send your achievements?"
                  :rules="[rules.required, rules.email]"
                  @focus="playFocusSound"
                  @blur="validateEmail"
                  hide-details="auto"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="input-icon">mdi-email-star</v-icon>
                  </template>
                </v-text-field>
              </div>

              <!-- Password Field -->
              <div class="input-group mb-6">
                <label class="input-label">
                  <span class="label-icon">🔐</span>
                  Your Secret Password
                </label>
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  class="magic-input"
                  :class="{ 'input-error': passwordError }"
                  placeholder="Create a strong secret code!"
                  :rules="[rules.required, rules.minLength]"
                  @focus="playFocusSound"
                  @blur="validatePassword"
                  hide-details="auto"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="input-icon">mdi-shield-key</v-icon>
                  </template>
                  <template v-slot:append-inner>
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      @click="togglePassword"
                      class="password-toggle"
                    >
                      <v-icon>{{
                        showPassword ? "mdi-eye-off" : "mdi-eye"
                      }}</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>

              <!-- Terms Agreement -->
              <div class="form-options mb-6">
                <v-checkbox
                  v-model="agreeToTerms"
                  class="agreement-checkbox"
                  hide-details
                >
                  <template v-slot:label>
                    <span class="checkbox-label">
                      <span class="checkbox-icon">🌟</span>
                      I'm ready to start my learning adventure and agree to the
                      terms!
                    </span>
                  </template>
                </v-checkbox>
              </div>

              <!-- Register Button -->
              <v-btn
                type="submit"
                :loading="isLoading"
                :disabled="!isFormValid"
                color="primary"
                size="x-large"
                class="register-btn magic-btn"
                @click="handleRegister"
                @mouseenter="playHoverSound"
              >
                <span class="btn-text" v-if="!isLoading">
                  🚀 Start My Adventure!
                </span>
                <span class="btn-text" v-else>
                  🌟 Creating Your Account...
                </span>
                <div class="btn-sparkles">✨⭐✨</div>
                <div class="btn-trail"></div>
              </v-btn>
            </v-form>
          </v-card-text>

          <!-- Card Footer -->
          <v-card-actions class="registration-footer pa-6">
            <div class="footer-content">
              <p class="footer-text">Already have an account?</p>
              <v-btn
                variant="outlined"
                color="secondary"
                class="login-btn magic-btn"
                @click="goToLogin"
              >
                <span class="btn-icon">🎯</span>
                Sign In Here!
                <div class="btn-sparkles">💫</div>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>

        <!-- Motivation Section -->
        <div class="motivation-section mt-8 text-center">
          <div class="motivation-characters">
            <div class="main-character pulse-animation">🌟</div>
            <div class="supporting-characters">
              <span class="support-char char-1 float-animation">🎨</span>
              <span class="support-char char-2 bounce-animation">🎯</span>
              <span class="support-char char-3 rotate-animation">🏆</span>
              <span class="support-char char-4 pulse-animation">📚</span>
            </div>
          </div>
          <h3 class="motivation-title rainbow-text mb-3">
            Your Learning Journey Awaits! 🚀
          </h3>
          <p class="motivation-text">
            Join thousands of young learners discovering amazing things every
            day! Create your account and let's make learning the most fun part
            of your day!
          </p>

          <div class="feature-highlights mt-4">
            <div
              class="feature-item"
              v-for="feature in features"
              :key="feature.icon"
            >
              <div class="feature-icon bounce-on-hover">{{ feature.icon }}</div>
              <div class="feature-text">{{ feature.text }}</div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Success Celebration Overlay -->
    <div v-if="showCelebration" class="celebration-overlay">
      <div class="celebration-content">
        <div class="celebration-character bounce-in-scale">🎉</div>
        <h2 class="celebration-title rainbow-text">Welcome to Our Family!</h2>
        <p class="celebration-message">
          🚀 Get ready for an incredible learning adventure! Your account is
          being created!
        </p>
        <div class="celebration-stars">
          <span class="celebration-star" v-for="n in 5" :key="n">⭐</span>
        </div>
      </div>
      <!-- Confetti Animation -->
      <div class="confetti-container">
        <div
          class="confetti"
          v-for="n in 100"
          :key="n"
          :style="getConfettiStyle(n)"
        ></div>
      </div>
    </div>

    <!-- Floating Success Messages -->
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/services/api.js";

// State Management
const fullName = ref("");
const email = ref("");
const password = ref("");
const agreeToTerms = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);
const nameError = ref(false);
const emailError = ref(false);
const passwordError = ref(false);
const hasError = ref(false);
const showCelebration = ref(false);
const successMessages = ref([]);

const router = useRouter();

// Features data
const features = [
  { icon: "🎮", text: "Fun Games" },
  { icon: "🏆", text: "Achievements" },
  { icon: "🌟", text: "Rewards" },
  { icon: "👥", text: "Friends" },
];

// Validation Rules
const rules = {
  required: (value) => !!value || "This field is required! 🎯",
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || "Please enter a valid email address! 📧";
  },
  minLength: (value) =>
    value.length >= 8 || "Password must be at least 8 characters! 🔐",
};

// Computed Properties
const isFormValid = computed(() => {
  return (
    fullName.value &&
    email.value &&
    password.value &&
    agreeToTerms.value &&
    !nameError.value &&
    !emailError.value &&
    !passwordError.value
  );
});

// Validation Functions
const validateName = () => {
  if (!fullName.value) {
    nameError.value = true;
    return false;
  }
  nameError.value = fullName.value.length < 2;
  return !nameError.value;
};

const validateEmail = () => {
  if (!email.value) {
    emailError.value = true;
    return false;
  }
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.value = !pattern.test(email.value);
  return !emailError.value;
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = true;
    return false;
  }
  passwordError.value = password.value.length < 8;
  return !passwordError.value;
};

// Form Actions
const handleRegister = async () => {
  if (!validateName() || !validateEmail() || !validatePassword()) {
    playErrorSound();
    hasError.value = true;
    setTimeout(() => (hasError.value = false), 500);
    return;
  }

  if (!agreeToTerms.value) {
    errorMessage.value =
      "Please agree to our terms to start your adventure! 🌟";
    playErrorSound();
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await apiClient.post("/api/auth/register", {
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    });

    if (response.data.success) {
      playSuccessSound();
      showSuccessMessage("Account created successfully! Welcome aboard! 🎉");
      showCelebration.value = true;

      setTimeout(() => {
        showCelebration.value = false;
        successMessage.value =
          "Registration successful! Redirecting to login...";
        setTimeout(() => {
          router.push({ name: "Login" });
        }, 2000);
      }, 3000);
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration failed:", error);
    playErrorSound();
    hasError.value = true;
    setTimeout(() => (hasError.value = false), 500);

    errorMessage.value =
      error.response?.data?.message ||
      "Oops! Something went wrong. The email might already be in use. Let's try again! 🔄";
  } finally {
    isLoading.value = false;
  }
};

const togglePassword = () => {
  playClickSound();
  showPassword.value = !showPassword.value;
};

const clearError = () => {
  playClickSound();
  errorMessage.value = null;
  hasError.value = false;
};

const goToLogin = () => {
  playClickSound();
  router.push({ name: "Login" });
};

// Sound Effects
const playWelcomeSound = () => playSound("welcome");
const playHoverSound = () => playSound("hover");
const playClickSound = () => playSound("click");
const playFocusSound = () => playSound("focus");
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
      case "hover":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        break;
      case "click":
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case "focus":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
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

// Confetti Animation
const getConfettiStyle = (index) => {
  const colors = [
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
  ];
  return {
    left: Math.random() * 100 + "%",
    backgroundColor: colors[index % colors.length],
    animationDelay: Math.random() * 3 + "s",
    animationDuration: Math.random() * 2 + 3 + "s",
  };
};
</script>

<style scoped>
/* Base Styles */
.register-adventure-page {
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
  z-index: 1;
}

.floating-shape {
  position: absolute;
  font-size: clamp(1.5rem, 2.5vw, 2.5rem);
  animation: float-around 25s ease-in-out infinite;
  opacity: 0.6;
}

.floating-shape.star:nth-child(1) {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}
.floating-shape.star:nth-child(2) {
  top: 20%;
  left: 85%;
  animation-delay: -2s;
}
.floating-shape.star:nth-child(3) {
  top: 60%;
  left: 10%;
  animation-delay: -4s;
}
.floating-shape.heart:nth-child(1) {
  top: 15%;
  right: 20%;
  animation-delay: -1s;
}
.floating-shape.rocket:nth-child(1) {
  top: 30%;
  left: 20%;
  animation-delay: -3s;
}

@keyframes float-around {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(15vw, -10vh) rotate(90deg) scale(1.2);
  }
  50% {
    transform: translate(10vw, -20vh) rotate(180deg) scale(0.8);
  }
  75% {
    transform: translate(-10vw, -15vh) rotate(270deg) scale(1.1);
  }
}

/* Welcome Section */
.characters-welcome-section {
  position: relative;
  z-index: 2;
  margin-bottom: 2rem;
}

.character-group {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.welcome-character {
  font-size: 6rem;
  cursor: pointer;
  display: inline-block;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.welcome-character:hover {
  transform: scale(1.15) rotate(10deg);
}

.bounce-animation {
  animation: character-bounce 2s ease-in-out infinite;
}

@keyframes character-bounce {
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

.character-friends {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.friend {
  position: absolute;
  font-size: 2.5rem;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2));
}

.friend-1 {
  top: -80px;
  left: -100px;
}
.friend-2 {
  top: -60px;
  right: -80px;
}
.friend-3 {
  bottom: -70px;
  left: -90px;
}

.float-animation {
  animation: character-float 4s ease-in-out infinite;
}

.pulse-animation {
  animation: character-pulse 2s ease-in-out infinite;
}

.rotate-animation {
  animation: character-rotate 6s linear infinite;
}

@keyframes character-float {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

@keyframes character-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes character-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.character-speech-bubble {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 25px;
  padding: 12px 25px;
  min-width: 300px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  color: #764ba2;
  font-weight: bold;
  font-size: 1.2rem;
  opacity: 0;
  animation: bubble-appear 1s ease-in-out forwards 1.5s;
}

.character-speech-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-top: 22px solid #fff;
}

@keyframes bubble-appear {
  0% {
    transform: translateX(-50%) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

.bubble-sparkles {
  position: absolute;
  top: -12px;
  right: -12px;
  font-size: 1.5rem;
  animation: sparkle-dance 1.5s ease-in-out infinite;
}

@keyframes sparkle-dance {
  0%,
  100% {
    text-shadow: 0 0 5px #fff, 0 0 10px #f093fb;
  }
  50% {
    text-shadow: 0 0 15px #fff, 0 0 25px #f093fb;
  }
}

/* Typography */
.welcome-title {
  font-family: "Bungee", cursive;
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

.rainbow-text {
  background: linear-gradient(
    90deg,
    #ff6b6b,
    #feca57,
    #48dbfb,
    #1dd1a1,
    #ff6b6b
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: rainbow-anim 4s linear infinite;
}

@keyframes rainbow-anim {
  to {
    background-position: 200% center;
  }
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

.welcome-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  opacity: 0;
}

.animate-fade-in {
  animation: fade-in-subtitle 1s ease-in forwards 1s;
}

@keyframes fade-in-subtitle {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Registration Card */
.registration-card {
  border-radius: 30px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  position: relative;
  transition: all 0.4s ease;
}

.card-shake {
  animation: card-shake 0.6s ease-in-out;
}

@keyframes card-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-5px);
  }
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
    transparent 70%
  );
  animation: card-glow-rotate 15s linear infinite;
  opacity: 0.7;
  pointer-events: none;
}

@keyframes card-glow-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.card-floaters {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floater {
  position: absolute;
  font-size: 1.8rem;
}
.floater.star {
  top: -20px;
  left: 10%;
}
.floater.heart {
  top: 15%;
  right: -15px;
}
.floater.magic {
  bottom: -10px;
  left: 20%;
}

/* Registration Header */
.registration-header {
  text-align: center;
  padding: 2rem 1.5rem;
  position: relative;
  background: linear-gradient(45deg, #7b4397, #dc2430);
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  color: white;
}

.header-icon-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
}

.header-icon {
  width: 100%;
  height: 100%;
  background-color: #fff;
  color: #764ba2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.bounce-hover:hover {
  animation: icon-bounce 0.5s ease;
}

@keyframes icon-bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.icon-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px dashed #fff;
  border-radius: 50%;
  animation: rotate-animation 10s linear infinite;
  opacity: 0.7;
}

.icon-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.sparkle {
  position: absolute;
  color: #ffd700;
  font-size: 1rem;
  animation: sparkle-out 1.5s ease-in-out infinite;
}
.sparkle:nth-child(1) {
  top: 0;
  left: 50%;
  animation-delay: 0s;
}
.sparkle:nth-child(2) {
  top: 50%;
  right: 0;
  animation-delay: 0.25s;
}
.sparkle:nth-child(3) {
  bottom: 0;
  left: 50%;
  animation-delay: 0.5s;
}
.sparkle:nth-child(4) {
  top: 50%;
  left: 0;
  animation-delay: 0.75s;
}

@keyframes sparkle-out {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.5);
    opacity: 0;
  }
}

.header-title {
  font-family: "Bungee", cursive;
  font-size: 1.8rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header-subtitle {
  font-size: 1rem;
  opacity: 0.9;
}

/* Form Styles */
.registration-form {
  position: relative;
  z-index: 2;
}

.input-group {
  position: relative;
}

.input-label {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #555;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.label-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.magic-input {
  transition: all 0.3s ease;
}

.magic-input:focus-within {
  box-shadow: 0 0 15px rgba(118, 75, 162, 0.4);
  transform: translateY(-2px);
}

.input-icon {
  color: #764ba2;
}

.input-error .v-field {
  border-color: #ff5252 !important;
  animation: shake-animation 0.4s;
}

.password-toggle {
  color: #777;
}

.agreement-checkbox .checkbox-label {
  color: #333;
  font-size: 0.95rem;
  cursor: pointer;
}
.agreement-checkbox .checkbox-icon {
  margin-right: 8px;
  animation: pulse-animation 2s infinite;
}

/* Button Styles */
.magic-btn {
  border-radius: 50px !important;
  font-weight: bold !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.magic-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.register-btn {
  background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%) !important;
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-sparkles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 1.5rem;
}

.magic-btn:hover .btn-sparkles {
  opacity: 1;
  animation: sparkle-dance 1s infinite;
}

.btn-trail {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transform: skewX(-20deg);
  transition: left 0.5s ease;
}

.magic-btn:hover .btn-trail {
  left: 100%;
}

/* Footer Styles */
.registration-footer {
  background-color: #f7f3ff;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-text {
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 0;
}

.login-btn .btn-icon {
  margin-right: 0.5rem;
}

/* Alert Styles */
.alert-content {
  display: flex;
  align-items: center;
}

.alert-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.success-celebration,
.error-encouragement {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 4px;
}

.shake-animation {
  animation: shake-animation 0.5s ease-in-out;
}

@keyframes shake-animation {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-8px);
  }
  40%,
  80% {
    transform: translateX(8px);
  }
}

/* Motivation Section */
.motivation-section {
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.motivation-characters {
  margin-bottom: 1rem;
}
.main-character {
  font-size: 4rem;
  display: inline-block;
}
.support-char {
  font-size: 1.8rem;
  margin: 0 0.5rem;
  display: inline-block;
}
.motivation-title {
  font-family: "Bungee", cursive;
}
.motivation-text {
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.feature-highlights {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.feature-icon {
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.bounce-on-hover:hover {
  animation: icon-bounce 0.5s ease;
}

.feature-text {
  font-weight: bold;
}

/* Celebration Overlay */
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  text-align: center;
  color: white;
}

.celebration-content {
  position: relative;
  z-index: 1002;
}

.celebration-character {
  font-size: 6rem;
}

.bounce-in-scale {
  animation: bounce-in-scale-anim 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
}

@keyframes bounce-in-scale-anim {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.celebration-title {
  font-family: "Bungee", cursive;
  font-size: 2.5rem;
  margin-top: 1rem;
}

.celebration-message {
  font-size: 1.2rem;
  max-width: 400px;
  margin: 1rem auto;
}

.celebration-stars .celebration-star {
  font-size: 1.5rem;
  margin: 0 5px;
  display: inline-block;
  animation: sparkle-out 1.5s infinite;
}
.celebration-star:nth-child(2) {
  animation-delay: 0.2s;
}
.celebration-star:nth-child(3) {
  animation-delay: 0.4s;
}
.celebration-star:nth-child(4) {
  animation-delay: 0.6s;
}
.celebration-star:nth-child(5) {
  animation-delay: 0.8s;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1001;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -20px;
  animation: confetti-fall linear infinite;
}

@keyframes confetti-fall {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
}

/* Floating Success Messages */
.success-messages {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1005;
}

.success-message {
  position: absolute;
  background: rgba(46, 204, 113, 0.9);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: float-up-fade-out 3s ease-out forwards;
}

@keyframes float-up-fade-out {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1.2);
    opacity: 0;
  }
}
</style>
