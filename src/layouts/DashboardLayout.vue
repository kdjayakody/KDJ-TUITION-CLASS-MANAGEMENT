<template>
  <q-layout view="lHh LpR lFf" class="bg-grey-1 text-black font-inter">
    <!-- Top Bar -->
    <q-header bordered class="bg-white text-black q-py-xs">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-weight-bold flex items-center">
          <q-icon name="school" class="q-mr-sm text-primary" size="24px" />
          <span class="tracking-wide text-subtitle1">ClassMaster</span>
        </q-toolbar-title>

        <div class="q-gutter-x-sm flex items-center">
          <q-input
            dense
            outlined
            placeholder="Search..."
            class="gt-xs search-input"
            bg-color="grey-1"
          >
            <template v-slot:prepend>
              <q-icon name="search" class="text-grey-5" />
            </template>
          </q-input>

          <q-btn flat round dense icon="notifications_none" class="text-grey-7 relative-position">
            <q-badge
              color="red"
              rounded
              floating
              padding="none"
              style="top: 8px; right: 8px; width: 8px; height: 8px; min-height: 8px"
            />
          </q-btn>

          <q-btn flat round no-caps class="q-ml-sm">
            <q-avatar size="32px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item clickable v-close-popup to="/dashboard/profile">
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="handleLogout">
                  <q-item-section class="text-negative">Sign Out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-white" :width="260">
      <q-scroll-area class="fit">
        <div class="q-pa-md q-mb-sm">
          <div class="text-caption text-grey-6 text-uppercase text-weight-bold q-mb-sm q-pl-sm">
            Main Menu
          </div>
          <q-list padding class="menu-list">
            <q-item
              v-for="item in menuItems"
              :key="item.label"
              clickable
              v-ripple
              :to="item.link"
              exact
              active-class="bg-grey-2 text-primary text-weight-bold"
              class="rounded-borders q-mb-xs"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" size="20px" class="q-my-xs" />
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="q-pa-md">
          <div class="text-caption text-grey-6 text-uppercase text-weight-bold q-mb-sm q-pl-sm">
            Management
          </div>
          <q-list padding class="menu-list">
            <q-item
              v-for="item in managementItems"
              :key="item.label"
              clickable
              v-ripple
              :to="item.link"
              active-class="bg-grey-2 text-primary text-weight-bold"
              class="rounded-borders q-mb-xs"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" size="20px" />
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const menuItems = [{ label: 'Dashboard', icon: 'grid_view', link: '/dashboard' }]

const managementItems = [
  { label: 'Users', icon: 'people_outline', link: '/dashboard/users' },
  { label: 'Classes & Subjects', icon: 'menu_book', link: '/dashboard/classes' },
  { label: 'Students', icon: 'school', link: '/dashboard/students' },
  { label: 'Attendance', icon: 'event_available', link: '/dashboard/attendance' },
  { label: 'Payments', icon: 'payments', link: '/dashboard/payments' },
  { label: 'Exams', icon: 'assignment', link: '/dashboard/exams' },
]
</script>

<style lang="scss" scoped>
.font-inter {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

.search-input {
  width: 300px;
  :deep(.q-field__control) {
    border-radius: 8px;
    &::before {
      border-color: #eee;
    }
  }
}

.menu-list .q-item {
  border-radius: 8px;
  color: #555;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f8f8;
    color: #000;
  }
}
</style>
