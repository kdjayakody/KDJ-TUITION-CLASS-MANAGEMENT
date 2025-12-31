<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Welcome Section -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">Dashboard</h1>
        <p class="text-grey-6 q-my-xs">Welcome back, here's what's happening today.</p>
      </div>
      <div>
        <q-btn
          unelevated
          color="primary"
          label="New Enrollment"
          icon="add"
          no-caps
          class="rounded-borders"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-3" v-for="(stat, index) in stats" :key="index">
        <q-card flat bordered class="rounded-xl bg-white full-height transition-hover">
          <q-card-section class="q-pa-lg">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 text-grey-6 text-uppercase letter-spacing-1">
                  {{ stat.title }}
                </div>
                <div class="text-h4 text-weight-bold text-grey-9 q-mt-sm">{{ stat.value }}</div>
                <div
                  class="text-caption q-mt-xs"
                  :class="stat.trend > 0 ? 'text-positive' : 'text-negative'"
                >
                  <q-icon :name="stat.trend > 0 ? 'trending_up' : 'trending_down'" />
                  {{ Math.abs(stat.trend) }}% from last month
                </div>
              </div>
              <div class="col-auto">
                <q-avatar
                  :color="stat.color"
                  text-color="white"
                  icon="o_paid"
                  v-if="stat.icon === 'payment'"
                />
                <q-avatar
                  :color="stat.color"
                  text-color="white"
                  icon="o_school"
                  v-else-if="stat.icon === 'student'"
                />
                <q-avatar
                  :color="stat.color"
                  text-color="white"
                  icon="o_class"
                  v-else-if="stat.icon === 'class'"
                />
                <q-avatar :color="stat.color" text-color="white" icon="o_person" v-else />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Recent Enrollements -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="rounded-xl bg-white col-grow">
          <q-card-section class="q-px-lg q-pt-lg q-pb-none row items-center justify-between">
            <div class="text-h6 text-grey-9">Recent Enrollments</div>
            <q-btn flat dense color="primary" label="View All" no-caps />
          </q-card-section>
          <q-card-section class="q-pa-lg text-center text-grey-6">
            <q-icon name="sentiment_dissatisfied" size="48px" class="q-mb-sm text-grey-4" />
            <div>No recent enrollments found.</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Quick Actions / Schedule -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-xl bg-white q-mb-md">
          <q-card-section class="q-px-lg q-pt-lg q-pb-none">
            <div class="text-h6 text-grey-9">Today's Schedule</div>
          </q-card-section>
          <q-card-section class="q-pa-lg text-center text-grey-6">
            <q-icon name="event_busy" size="48px" class="q-mb-sm text-grey-4" />
            <div>No classes scheduled for today.</div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="rounded-xl bg-blue-1 text-primary">
          <q-card-section class="q-pa-lg relative-position overflow-hidden">
            <div class="text-h6 text-weight-bold">System Status</div>
            <p class="text-primary q-mb-none text-weight-medium">All systems operational.</p>
            <div class="text-caption text-grey-7 q-mt-sm">Version 1.0.0 (Open Source)</div>
            <q-icon
              name="check_circle"
              size="80px"
              class="absolute-bottom-right text-primary opacity-10"
              style="right: -10px; bottom: -10px"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const stats = [
  { title: 'Total Students', value: '0', trend: 0, icon: 'student', color: 'blue' },
  { title: 'Active Classes', value: '0', trend: 0, icon: 'class', color: 'orange' },
  { title: 'Monthly Revenue', value: 'Rs. 0', trend: 0, icon: 'payment', color: 'green' },
  { title: 'New Tutors', value: '0', trend: 0, icon: 'tutor', color: 'purple' },
]
</script>

<style lang="scss" scoped>
.transition-hover {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
  }
}

.opacity-20 {
  opacity: 0.2;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}
</style>
