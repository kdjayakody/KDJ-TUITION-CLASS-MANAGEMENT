import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),
  actions: {
    async register(email, password) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        this.user = data.user
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        this.user = data.user
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async logout() {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        this.user = null
      } catch (error) {
        this.error = error.message
      }
    },
    async checkUser() {
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user || null
    },
  },
})
