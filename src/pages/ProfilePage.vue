<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">My Profile</h1>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Left Column: Identity Card -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-xl bg-white text-center q-pa-lg">
          <q-card-section>
            <q-avatar size="120px" class="shadow-3">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-h6 text-weight-bold q-mt-md text-grey-9">Admin User</div>
            <div class="text-subtitle2 text-grey-6">{{ authStore.user?.email }}</div>
            <q-badge color="primary" class="q-mt-sm" label="Administrator" />
          </q-card-section>

          <q-separator class="q-my-md" />

          <q-card-section class="text-left">
            <div class="text-caption text-grey-6 text-uppercase text-weight-bold q-mb-sm">
              Details
            </div>
            <div class="q-mb-sm">
              <q-icon name="o_email" class="q-mr-sm text-grey-7" />
              <span class="text-grey-8">{{ authStore.user?.email }}</span>
            </div>
            <div class="q-mb-sm">
              <q-icon name="o_calendar_today" class="q-mr-sm text-grey-7" />
              <span class="text-grey-8">Joined {{ formatDate(authStore.user?.created_at) }}</span>
            </div>
            <div class="q-mb-sm">
              <q-icon name="o_verified_user" class="q-mr-sm text-grey-7" />
              <span class="text-positive" v-if="authStore.user?.email_confirmed_at"
                >Verified Account</span
              >
              <span class="text-warning" v-else>Unverified</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right Column: Settings -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="rounded-xl bg-white">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="general" label="General Information" />
            <q-tab name="security" label="Security" />
            <q-tab name="preferences" label="Preferences" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <!-- General Tab -->
            <q-tab-panel name="general" class="q-pa-lg">
              <div class="text-h6 q-mb-md text-grey-9">Personal Details</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input outlined v-model="profileData.firstName" label="First Name" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined v-model="profileData.lastName" label="Last Name" />
                </div>
                <div class="col-12">
                  <q-input
                    outlined
                    v-model="profileData.bio"
                    type="textarea"
                    label="Bio / About"
                    rows="3"
                  />
                </div>
              </div>
              <div class="row justify-end q-mt-lg">
                <q-btn unelevated color="primary" label="Save Changes" no-caps />
              </div>
            </q-tab-panel>

            <!-- Security Tab -->
            <q-tab-panel name="security" class="q-pa-lg">
              <div class="text-h6 q-mb-md text-grey-9">Change Password</div>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input outlined type="password" label="Current Password" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined type="password" label="New Password" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined type="password" label="Confirm New Password" />
                </div>
              </div>
              <div class="row justify-end q-mt-lg">
                <q-btn outline color="grey-8" label="Cancel" no-caps class="q-mr-sm" />
                <q-btn unelevated color="primary" label="Update Password" no-caps />
              </div>
            </q-tab-panel>

            <!-- Preferences Tab -->
            <q-tab-panel name="preferences" class="q-pa-lg">
              <div class="text-h6 q-mb-md text-grey-9">Notifications</div>
              <q-list>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Email Notifications</q-item-label>
                    <q-item-label caption>Receive emails about account activity</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-toggle color="primary" v-model="preferences.email" val="email" />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Marketing Updates</q-item-label>
                    <q-item-label caption>Receive offers and product updates</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-toggle color="primary" v-model="preferences.marketing" val="marketing" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { date } from 'quasar'

const authStore = useAuthStore()
const tab = ref('general')

const profileData = ref({
  firstName: 'Admin',
  lastName: 'User',
  bio: 'Administrator of the Tuition Management System.',
})

const preferences = ref({
  email: true,
  marketing: false,
})

const formatDate = (dateString) => {
  if (!dateString) return 'NiL'
  return date.formatDate(dateString, 'MMM D, YYYY')
}
</script>
