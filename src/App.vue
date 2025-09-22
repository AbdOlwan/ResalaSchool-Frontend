<template>
  <v-app>
    <v-app-bar app color="primary" dark v-if="isAuthenticated">
      <v-btn v-if="!isHomePage" @click="goBack" icon class="mr-2">
        <v-tooltip activator="parent" location="bottom">Go Back</v-tooltip>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title @click="goToHome" style="cursor: pointer">
        Resala Schools
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <span class="mr-4" v-if="currentUser"
        >Welcome, {{ currentUser.fullName }}</span
      >

      <v-btn :to="{ name: 'Profile' }" icon class="mr-2">
        <v-tooltip activator="parent" location="bottom">My Profile</v-tooltip>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>

      <v-btn @click="handleLogout" icon>
        <v-tooltip activator="parent" location="bottom">Logout</v-tooltip>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
// تم التعديل: استيراد useRoute للوصول لمعلومات الصفحة الحالية
import { useRouter, useRoute } from "vue-router";

const store = useStore();
const router = useRouter();
// تم التعديل: تهيئة useRoute
const route = useRoute();

const isAuthenticated = computed(() => store.getters.isAuthenticated);
const currentUser = computed(() => store.getters.currentUser);

// تمت الإضافة: خاصية محسوبة (computed property) للتحقق مما إذا كانت الصفحة الحالية هي الرئيسية
const isHomePage = computed(() => route.name === "home");

const handleLogout = () => {
  store.commit("logout");
  router.push({ name: "Login" });
};

// تمت الإضافة: دالة للانتقال إلى الصفحة الرئيسية
const goToHome = () => {
  router.push({ name: "home" });
};

// تمت الإضافة: دالة للرجوع صفحة واحدة للخلف
const goBack = () => {
  router.go(-1);
};
</script>
