<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'
import { supabase } from 'boot/supabase'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkUser()

  supabase.auth.onAuthStateChange((event, session) => {
    authStore.user = session?.user || null
  })
})
</script>
