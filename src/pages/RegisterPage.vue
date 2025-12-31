<template>
  <q-page class="flex flex-center bg-black font-inter relative-position">
    <q-btn icon="home" flat round color="white" class="absolute-top-left q-ma-md z-max" to="/" />
    <div class="auth-card q-pa-xl rounded-xl relative-position z-10">
      <div class="absolute-inset bg-grid opacity-10"></div>

      <div class="text-center q-mb-xl">
        <div class="flex flex-center q-mb-md">
          <q-icon name="school" size="48px" class="q-mr-sm text-white" />
        </div>
        <h3 class="text-h4 text-weight-bold text-white q-mb-xs">Create Account</h3>
        <p class="text-grey-5">Join ClassMaster to manage your tuition classes</p>
      </div>

      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          v-model="email"
          dark
          filled
          type="email"
          label="Email Address"
          color="white"
          class="auth-input"
          :rules="[(val) => !!val || 'Email is required']"
        />

        <q-input
          v-model="password"
          dark
          filled
          type="password"
          label="Password"
          color="white"
          class="auth-input"
          :rules="[
            (val) => !!val || 'Password is required',
            (val) => val.length >= 6 || 'Password must be at least 6 characters',
          ]"
        />

        <q-input
          v-model="confirmPassword"
          dark
          filled
          type="password"
          label="Confirm Password"
          color="white"
          class="auth-input"
          :rules="[
            (val) => !!val || 'Please confirm your password',
            (val) => val === password || 'Passwords do not match',
          ]"
        />

        <q-btn
          unelevated
          type="submit"
          color="white"
          text-color="black"
          size="lg"
          label="Sign Up"
          no-caps
          class="full-width rounded-borders hover-lift q-mt-lg"
          :loading="authStore.loading"
        />

        <div class="text-center q-mt-lg text-grey-6">
          Already have an account?
          <router-link
            to="/login"
            class="text-white text-weight-bold hover-text-grey-4 transition-colors decoration-none"
            >Sign In</router-link
          >
        </div>
      </q-form>

      <div
        v-if="authStore.error"
        class="q-mt-md text-negative text-center q-pa-sm bg-grey-10 rounded-borders"
      >
        {{ authStore.error }}
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const onSubmit = async () => {
  try {
    await authStore.register(email.value, password.value)
    $q.notify({
      color: 'positive',
      message: 'Registration successful! Please verify your email.',
      icon: 'check_circle',
    })
    router.push('/login')
  } catch (error) {
    if (error.message) {
      $q.notify({
        color: 'negative',
        message: error.message,
        icon: 'report_problem',
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.font-inter {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bg-grid {
  background-image:
    linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: -1;
}
.opacity-10 {
  opacity: 0.1;
}

.decoration-none {
  text-decoration: none;
}
.hover-text-white:hover {
  color: white !important;
}
.hover-text-grey-4:hover {
  color: #bdbdbd !important;
}
.transition-colors {
  transition: color 0.3s ease;
}

.hover-lift {
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-2px);
  }
}
</style>
