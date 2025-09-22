<template>
  <v-container fluid class="pa-0 login-adventure-page">
    <!-- Floating Background Elements -->
    <div class="floating-elements">
      <div class="floating-shape star" v-for="n in 15" :key="'star-' + n">
        ⭐
      </div>
      <div class="floating-shape heart" v-for="n in 10" :key="'heart-' + n">
        💖
      </div>
      <div class="floating-shape rocket" v-for="n in 8" :key="'rocket-' + n">
        🚀
      </div>
      <div class="floating-shape book" v-for="n in 6" :key="'book-' + n">
        📚
      </div>
      <div class="floating-shape magic" v-for="n in 12" :key="'magic-' + n">
        ✨
      </div>
    </div>

    <!-- Main Login Container -->
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">
        <!-- Welcome Mascot Section -->
        <div class="mascot-welcome-section text-center mb-8">
          <div
            class="welcome-mascot bounce-animation"
            @click="playWelcomeSound"
          >
            🎓
          </div>
          <div class="mascot-speech-bubble pulse-animation">
            <span class="speech-text">Welcome Back, Super Student!</span>
            <div class="bubble-sparkles">✨💫✨</div>
          </div>
          <h1 class="welcome-title rainbow-text mb-4 title-bounce">
            🌟 Ready for Your Learning Adventure? 🌟
          </h1>
          <p class="welcome-subtitle animate-fade-in">
            🎯 Sign in to continue your amazing journey!
            <br />🏆 Your lessons and achievements are waiting for you!
          </p>
        </div>

        <!-- Login Card -->
        <v-card
          class="login-card magic-card elevation-24"
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
          <div class="login-header">
            <div class="header-icon-container">
              <div class="header-icon bounce-hover">🔐</div>
              <div class="icon-ring"></div>
            </div>
            <h2 class="header-title">Login to Your Account</h2>
            <p class="header-subtitle">Enter your magic learning portal!</p>
          </div>

          <!-- Login Form -->
          <v-card-text class="pa-8">
            <v-form @submit.prevent="handleLogin" class="login-form">
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
                    Don't worry! Try again, champion!
                  </div>
                </div>
              </v-alert>

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
                  placeholder="Enter your email..."
                  :rules="[rules.required, rules.email]"
                  @focus="playFocusSound"
                  @blur="validateEmail"
                  hide-details="auto"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="input-icon">mdi-email</v-icon>
                  </template>
                </v-text-field>
              </div>

              <!-- Password Field -->
              <div class="input-group mb-6">
                <label class="input-label">
                  <span class="label-icon">🔑</span>
                  Your Secret Password
                </label>
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  class="magic-input"
                  :class="{ 'input-error': passwordError }"
                  placeholder="Enter your password..."
                  :rules="[rules.required]"
                  @focus="playFocusSound"
                  @blur="validatePassword"
                  hide-details="auto"
                >
                  <template v-slot:prepend-inner>
                    <v-icon class="input-icon">mdi-lock</v-icon>
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

              <!-- Remember Me & Forgot Password -->
              <div class="form-options mb-6">
                <v-checkbox
                  v-model="rememberMe"
                  class="remember-checkbox"
                  hide-details
                >
                  <template v-slot:label>
                    <span class="checkbox-label">
                      <span class="checkbox-icon">🌟</span>
                      Remember me for next adventure!
                    </span>
                  </template>
                </v-checkbox>

                <v-btn
                  variant="text"
                  color="primary"
                  class="forgot-password-btn"
                  @click="showForgotPassword"
                >
                  <span class="forgot-icon">🤔</span>
                  Forgot Password?
                </v-btn>
              </div>

              <!-- Login Button -->
              <v-btn
                type="submit"
                :loading="isLoading"
                :disabled="!isFormValid"
                color="primary"
                size="x-large"
                class="login-btn magic-btn"
                @click="handleLogin"
                @mouseenter="playHoverSound"
              >
                <span class="btn-text" v-if="!isLoading">
                  🚀 Start My Adventure!
                </span>
                <span class="btn-text" v-else> 🌟 Opening Portal... </span>
                <div class="btn-sparkles">✨⭐✨</div>
                <div class="btn-trail"></div>
              </v-btn>
            </v-form>
          </v-card-text>

          <!-- Card Footer -->
          <v-card-actions class="login-footer pa-6">
            <div class="footer-content">
              <p class="footer-text">New to our magical learning world?</p>
              <v-btn
                variant="outlined"
                color="secondary"
                class="register-btn magic-btn"
                @click="goToRegister"
              >
                <span class="btn-icon">🎯</span>
                Create New Account!
                <div class="btn-sparkles">💫</div>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>

        <!-- Motivational Section -->
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
            Your Learning Journey Awaits!
          </h3>
          <p class="motivation-text">
            Join thousands of young learners discovering amazing things every
            day! Sign in and let's make learning fun together!
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- Success Celebration Overlay -->
    <div v-if="showCelebration" class="celebration-overlay">
      <div class="celebration-content">
        <div class="celebration-character bounce-in-scale">🎉</div>
        <h2 class="celebration-title rainbow-text">Welcome Back, Champion!</h2>
        <p class="celebration-message">
          🚀 Get ready for an amazing learning adventure! Your progress is
          waiting for you!
        </p>
        <div class="celebration-stars">
          <span class="celebration-star" v-for="n in 5" :key="n">⭐</span>
        </div>
      </div>
      <!-- Confetti Animation -->
      <div class="confetti-container">
        <div
          class="confetti"
          v-for="n in 80"
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
import { useStore } from "vuex";

// State Management
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);
const emailError = ref(false);
const passwordError = ref(false);
const hasError = ref(false);
const showCelebration = ref(false);
const successMessages = ref([]);

const router = useRouter();
const store = useStore();

// Validation Rules
const rules = {
  required: (value) => !!value || "This field is required! 🎯",
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || "Please enter a valid email address! 📧";
  },
};

// Computed Properties
const isFormValid = computed(() => {
  return (
    email.value && password.value && !emailError.value && !passwordError.value
  );
});

// Validation Functions
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
  passwordError.value = password.value.length < 3;
  return !passwordError.value;
};

// Form Actions
const handleLogin = async () => {
  if (!validateEmail() || !validatePassword()) {
    playErrorSound();
    hasError.value = true;
    setTimeout(() => (hasError.value = false), 500);
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const response = await apiClient.post("/api/auth/login", {
      email: email.value,
      password: password.value,
    });

    if (response.data.success) {
      const user = response.data.data;

      // Store user data
      store.commit("setAuth", { isAuthenticated: true, user: user });

      // Use localStorage for "Remember Me", otherwise sessionStorage
      if (rememberMe.value) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      // Show success celebration
      playSuccessSound();
      showSuccessMessage("Login successful! Welcome back! 🌟");
      showCelebration.value = true;

      // Navigate after celebration
      setTimeout(() => {
        showCelebration.value = false;
        router.push({ name: "home" });
      }, 3000);
    } else {
      throw new Error(response.data.message || "Invalid credentials");
    }
  } catch (error) {
    console.error("Login failed:", error);
    playErrorSound();
    hasError.value = true;
    setTimeout(() => (hasError.value = false), 500);

    errorMessage.value =
      error.response?.data?.message ||
      "Oops! Something went wrong. Let's try again! 🔄";
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

const showForgotPassword = () => {
  playClickSound();
  // Implement forgot password functionality
  showSuccessMessage("Password reset feature coming soon! 🚀");
};

const goToRegister = () => {
  playClickSound();
  router.push({ name: "Register" });
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
.login-adventure-page {
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
  animation: float-around 20s ease-in-out infinite;
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
.floating-shape.star:nth-child(4) {
  bottom: 30%;
  right: 15%;
  animation-delay: -6s;
}
.floating-shape.star:nth-child(5) {
  top: 80%;
  left: 75%;
  animation-delay: -8s;
}

.floating-shape.heart:nth-child(1) {
  top: 15%;
  right: 20%;
  animation-delay: -1s;
}
.floating-shape.heart:nth-child(2) {
  bottom: 20%;
  left: 30%;
  animation-delay: -5s;
}
.floating-shape.heart:nth-child(3) {
  top: 70%;
  right: 40%;
  animation-delay: -9s;
}

.floating-shape.rocket:nth-child(1) {
  top: 30%;
  left: 20%;
  animation-delay: -3s;
}
.floating-shape.rocket:nth-child(2) {
  bottom: 40%;
  right: 25%;
  animation-delay: -7s;
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
.mascot-welcome-section {
  position: relative;
  z-index: 2;
  margin-bottom: 2rem;
}

.welcome-mascot {
  font-size: 6rem;
  cursor: pointer;
  display: inline-block;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.welcome-mascot:hover {
  transform: scale(1.15) rotate(10deg);
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
  min-width: 280px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
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

.bubble-sparkles {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  animation: sparkle-glow 1.5s ease-in-out infinite;
}

@keyframes sparkle-glow {
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
  animation: title-bounce 1s ease-in-out forwards;
}

@keyframes title-bounce {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.welcome-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  opacity: 0;
}

.animate-fade-in {
  animation: fade-in 1s ease-in-out forwards 1s;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

/* Login Card */
.login-card {
  border-radius: 30px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  position: relative;
  transition: all 0.4s ease;
}

.card-shake {
  animation: shake 0.6s ease-in-out;
}

@keyframes shake {
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
  animation: rotate-glow 15s linear infinite;
  opacity: 0.7;
  pointer-events: none;
}

@keyframes rotate-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.card-floaters {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
}

.floater {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.7;
}

.floater.star {
  top: 10%;
  right: 15%;
}
.floater.heart {
  bottom: 15%;
  left: 10%;
}
.floater.magic {
  top: 25%;
  left: 20%;
}

.rotate-animation {
  animation: spin 8s linear infinite;
}
.pulse-animation {
  animation: pulse-anim 2s infinite;
}
.float-animation {
  animation: float-anim 4s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes pulse-anim {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
@keyframes float-anim {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Login Header */
.login-header {
  text-align: center;
  padding: 2rem 2rem 1rem 2rem;
  position: relative;
  z-index: 3;
}

.header-icon-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.header-icon {
  font-size: 4rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.header-icon:hover {
  transform: scale(1.1) rotate(10deg);
}

.icon-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  border: 3px dashed #ffd700;
  animation: ring-spin 10s linear infinite;
}

@keyframes ring-spin {
  to {
    transform: rotate(360deg);
  }
}

.header-title {
  font-family: "Bungee", cursive;
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.header-subtitle {
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Form Styles */
.login-form {
  position: relative;
  z-index: 3;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #333;
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

.magic-input:hover {
  transform: translateY(-2px);
}

.magic-input.input-error {
  animation: input-shake 0.5s ease-in-out;
}

@keyframes input-shake {
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

:deep(.magic-input .v-field) {
  border-radius: 15px !important;
  border: 2px solid #e0e0e0 !important;
  background: #fff !important;
}

:deep(.magic-input .v-field--focused) {
  border-color: #764ba2 !important;
  box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1) !important;
}

.input-icon {
  color: #764ba2;
  transition: transform 0.2s ease;
}

:deep(.magic-input .v-field--focused .input-icon) {
  transform: scale(1.2);
}

.password-toggle {
  color: #aaa;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #764ba2;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.remember-checkbox .checkbox-label {
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

:deep(.remember-checkbox .v-input--dirty .checkbox-icon) {
  transform: rotate(360deg) scale(1.2);
}

.forgot-password-btn {
  text-transform: none;
  font-weight: bold;
}

.forgot-icon {
  margin-right: 0.3rem;
}

/* Login & Register Buttons */
.magic-btn {
  position: relative;
  overflow: hidden;
  border-radius: 50px !important;
  font-weight: bold !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
  z-index: 1;
}

.magic-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
}

.login-btn {
  width: 100%;
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
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.magic-btn:hover .btn-sparkles {
  opacity: 1;
  animation: sparkle-glow 1s infinite;
}

.btn-trail {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
  z-index: 0;
}

.magic-btn:hover .btn-trail {
  width: 200%;
  height: 200%;
}

/* Login Footer */
.login-footer {
  background-color: rgba(240, 240, 255, 0.6);
  border-top: 2px dashed #e0e0e0;
  text-align: center;
  display: block;
}

.footer-content {
  width: 100%;
}

.footer-text {
  margin-bottom: 0.8rem;
  color: #555;
  font-weight: 500;
}

/* Alerts */
.alert-content {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.alert-icon {
  font-size: 1.5rem;
  margin-right: 0.8rem;
}

.error-encouragement {
  font-size: 0.8rem;
  font-weight: normal;
  margin-top: 0.3rem;
  color: #b71c1c;
}

/* Motivational Section */
.motivation-section {
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
}

.motivation-characters {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.main-character {
  display: inline-block;
  font-size: 4rem;
}

.support-char {
  font-size: 2rem;
  margin: 0 0.5rem;
  display: inline-block;
}

.motivation-title {
  font-family: "Bungee", cursive;
  font-size: 2rem;
}

.motivation-text {
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Success Celebration Overlay */
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.celebration-content {
  text-align: center;
  color: #fff;
  padding: 2rem;
}

.celebration-character {
  font-size: 6rem;
  animation: celebration-bounce 2s ease-in-out infinite;
}

@keyframes celebration-bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.celebration-title {
  font-family: "Bungee", cursive;
  font-size: 3rem;
  margin-top: 1rem;
}

.celebration-message {
  font-size: 1.2rem;
  margin-top: 1rem;
}

/* Confetti */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 20px;
  top: -50px;
  opacity: 0.8;
  animation: confetti-fall linear infinite;
}

@keyframes confetti-fall {
  to {
    transform: translateY(105vh) rotate(720deg);
    opacity: 0;
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
  z-index: 1001;
}

.success-message {
  position: absolute;
  background: rgba(46, 204, 113, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  animation: float-up-fade-out 3s ease-in-out forwards;
}

@keyframes float-up-fade-out {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  20% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
  80% {
    transform: translateY(-80px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0.8);
    opacity: 0;
  }
}
</style>
