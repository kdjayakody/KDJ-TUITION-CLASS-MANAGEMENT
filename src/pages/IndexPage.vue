<template>
  <q-page class="bg-black text-white font-inter">
    <!-- Header -->
    <header class="q-py-md q-px-md flex items-center justify-between glass-header fixed-top z-max">
      <div class="flex items-center">
        <q-icon name="school" size="32px" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold tracking-wide">ClassMaster</div>
      </div>
      <nav class="gt-sm">
        <q-btn flat no-caps label="Features" class="text-grey-4 hover-text-white" />
        <q-btn flat no-caps label="Solutions" class="text-grey-4 hover-text-white" />
        <q-btn flat no-caps label="About" class="text-grey-4 hover-text-white" />
      </nav>
      <div class="flex items-center q-gutter-x-sm">
        <template v-if="authStore.user">
          <q-btn flat no-caps label="Dashboard" class="text-white" to="/dashboard" />
          <q-btn
            flat
            no-caps
            label="Log out"
            class="text-grey-4 hover-text-white"
            @click="handleLogout"
          />
        </template>
        <template v-else>
          <q-btn flat no-caps label="Log in" class="text-white" to="/login" />
          <q-btn
            unelevated
            color="white"
            text-color="black"
            label="Get Started"
            no-caps
            class="q-px-lg rounded-borders"
            to="/register"
          />
        </template>
      </div>
    </header>

    <!-- Hero Section -->
    <section
      class="min-h-screen flex items-center justify-center relative-position overflow-hidden hero-section"
    >
      <div class="absolute-full gradient-overlay z-1"></div>

      <div class="container q-px-md z-10 relative-position w-full">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6 fade-in-up hero-content">
            <q-badge
              color="grey-9"
              text-color="white"
              class="q-mb-md q-py-xs q-px-md text-subtitle2 rounded-borders"
            >
              100% Free & Open Source
            </q-badge>
            <h1 class="text-h1 text-weight-bold q-my-md leading-tight">
              Master Your <br />
              <span class="text-gradient">Tuition Business</span>
            </h1>
            <p class="text-h5 text-grey-5 q-mb-lg max-w-md">
              Streamline students, payments, and schedules in one unified, high-performance
              platform. Focus on teaching, we handle the rest.
            </p>
            <div class="row q-gutter-md hero-buttons">
              <q-btn
                unelevated
                color="white"
                text-color="black"
                size="lg"
                label="Get Started Now"
                no-caps
                class="q-px-xl rounded-borders hover-lift col-12 col-sm-auto"
                to="/register"
              />
              <q-btn
                outline
                color="white"
                size="lg"
                label="View Demo"
                icon-right="arrow_forward"
                no-caps
                class="q-px-lg rounded-borders col-12 col-sm-auto"
              />
            </div>
          </div>
          <div class="col-12 col-md-6 text-center fade-in-right relative-position">
            <div class="hero-glow absolute-center"></div>
            <img
              src="~assets/hero-bg.png"
              alt="Platform Abstract"
              class="hero-image rounded-xl shadow-2xl relative-position full-width"
              style="max-height: 600px; width: 100%; object-fit: contain"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Brands Section -->
    <section class="q-py-xl bg-dark-page border-y-grey">
      <div class="container text-center">
        <p class="text-grey-6 q-mb-lg text-uppercase tracking-widest text-caption">
          Trusted by premium institutes worldwide
        </p>
        <div
          class="flex flex-center q-gutter-md q-gutter-md-xl opacity-50 grayscale hover-grayscale-0 transition-grayscale wrap"
        >
          <div class="text-h6 text-grey-5 text-weight-bold">ACADEMY</div>
          <div class="text-h6 text-grey-5 text-weight-bold">TUTOR+</div>
          <div class="text-h6 text-grey-5 text-weight-bold">SCHOLAR</div>
          <div class="text-h6 text-grey-5 text-weight-bold">EDUMASTER</div>
          <div class="text-h6 text-grey-5 text-weight-bold">NEXTGEN</div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="q-py-xl section-padding relative-position">
      <div class="container">
        <div class="text-center q-mb-xl fade-in">
          <h2 class="text-h3 text-weight-bold q-mb-sm">Everything in One Place</h2>
          <p class="text-grey-5 text-h6 max-w-2xl q-mx-auto">
            Replacing multiple fragmented tools with one cohesive operating system.
          </p>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4" v-for="(feature, index) in features" :key="index">
            <div class="feature-card q-pa-lg rounded-xl h-full">
              <div class="icon-box q-mb-md">
                <q-icon :name="feature.icon" size="24px" />
              </div>
              <h3 class="text-h5 text-weight-bold q-mb-sm">{{ feature.title }}</h3>
              <p class="text-grey-5">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Showcase: Dashboard -->
    <section class="section-padding bg-grey-10 overflow-hidden">
      <div class="container">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6 order-last order-md-first fade-in-left">
            <img
              src="~assets/dashboard-mockup.png"
              alt="Dashboard"
              class="rounded-xl shadow-2xl hover-scale transition-transform w-full"
            />
          </div>
          <div class="col-12 col-md-6 fade-in-right">
            <h2 class="text-h3 text-weight-bold q-mb-md">Data-Driven Insights</h2>
            <p class="text-grey-5 text-h6 q-mb-lg">
              Visualize your institute's performance in real-time. Track revenue, student
              attendance, and enrollment trends with our powerful analytics engine.
            </p>
            <ul class="text-grey-4 text-body1 q-pl-none list-none q-gutter-y-sm">
              <li class="flex items-center">
                <q-icon name="check_circle" class="q-mr-sm text-white" /> Real-time financial
                reporting
              </li>
              <li class="flex items-center">
                <q-icon name="check_circle" class="q-mr-sm text-white" /> Automated attendance
                tracking
              </li>
              <li class="flex items-center">
                <q-icon name="check_circle" class="q-mr-sm text-white" /> Growth trend analysis
              </li>
            </ul>
            <q-btn
              flat
              color="white"
              label="Explore Reporting"
              icon-right="arrow_forward"
              no-caps
              class="q-mt-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Showcase: Mobile App -->
    <section class="section-padding">
      <div class="container">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-5 fade-in-left">
            <h2 class="text-h3 text-weight-bold q-mb-md">Learning in Their Pocket</h2>
            <p class="text-grey-5 text-h6 q-mb-lg">
              Give students and parents the modern experience they expect. A dedicated mobile app
              for assignments, schedules, and fee payments.
            </p>
            <div class="flex q-gutter-md q-mt-lg">
              <div
                class="bg-grey-9 q-pa-md rounded-lg text-center min-w-120 cursor-pointer hover-bg-grey-8"
              >
                <q-icon name="apple" size="24px" class="q-mb-xs" />
                <div class="text-caption">Download on</div>
                <div class="text-weight-bold">App Store</div>
              </div>
              <div
                class="bg-grey-9 q-pa-md rounded-lg text-center min-w-120 cursor-pointer hover-bg-grey-8"
              >
                <q-icon name="android" size="24px" class="q-mb-xs" />
                <div class="text-caption">Get it on</div>
                <div class="text-weight-bold">Google Play</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-7 flex flex-center fade-in-right relative-position">
            <div class="absolute-center circle-glow"></div>
            <img
              src="~assets/mobile-app.png"
              alt="Mobile App"
              class="rounded-xl relative-position w-full"
              style="max-width: 400px"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="q-py-xl section-padding text-center relative-position">
      <div class="absolute-inset bg-grid opacity-10"></div>
      <div class="container relative-position z-10">
        <h2 class="text-h2 text-weight-bold q-mb-md">Ready to Get Started?</h2>
        <p class="text-grey-5 text-h6 max-w-xl q-mx-auto q-mb-xl">
          Join the community of forward-thinking tuition classes utilizing ClassMaster.
        </p>
        <q-btn
          unelevated
          color="white"
          text-color="black"
          size="xl"
          label="Start Using for Free"
          no-caps
          class="q-px-xl rounded-borders hover-lift"
        />
        <p class="q-mt-md text-grey-6 text-caption">No hidden fees · Forever Free & Open Source</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black border-t-grey q-py-xl text-grey-5">
      <div class="container">
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-4">
            <div class="flex items-center q-mb-md">
              <q-icon name="school" size="24px" class="q-mr-sm text-white" />
              <div class="text-h6 text-white text-weight-bold">ClassMaster</div>
            </div>
            <p class="text-body2">
              Empowering education entrepreneurs with the best tools to manage and grow their
              tuition classes.
            </p>
          </div>
          <div class="col-6 col-md-2">
            <h6 class="text-white text-subtitle2 q-mb-md font-bold text-uppercase">Product</h6>
            <ul class="list-none q-pl-none q-gutter-y-sm">
              <li><a href="#" class="hover-text-white transition-colors">Features</a></li>
              <li><a href="#" class="hover-text-white transition-colors">Mobile App</a></li>
              <li><a href="#" class="hover-text-white transition-colors">Security</a></li>
            </ul>
          </div>
          <div class="col-6 col-md-2">
            <h6 class="text-white text-subtitle2 q-mb-md font-bold text-uppercase">Company</h6>
            <ul class="list-none q-pl-none q-gutter-y-sm">
              <li><a href="#" class="hover-text-white transition-colors">About Us</a></li>
              <li><a href="#" class="hover-text-white transition-colors">Careers</a></li>
              <li><a href="#" class="hover-text-white transition-colors">Blog</a></li>
              <li><a href="#" class="hover-text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div class="col-12 col-md-4">
            <h6 class="text-white text-subtitle2 q-mb-md font-bold text-uppercase">Subscribe</h6>
            <p class="text-caption q-mb-md">Get the latest news and updates.</p>
            <q-input dark dense filled color="white" placeholder="Enter your email" class="q-mb-sm">
              <template v-slot:after>
                <q-btn flat icon="send" color="white" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="q-mt-xl text-center text-caption border-t-grey-dark q-pt-md">
          &copy; 2024 ClassMaster Inc. All rights reserved.
          <div class="q-mt-xs text-grey-6">Powered by KDJ Lanka (Pvt) Ltd</div>
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const features = [
  {
    title: 'Student Management',
    desc: 'Keep detailed records of student profiles, enrollments, and academic history in one secure database.',
    icon: 'manage_accounts',
  },
  {
    title: 'Smart Scheduling',
    desc: 'Effortlessly create and manage class timetables, resolving conflicts and handling adjustments on the fly.',
    icon: 'calendar_month',
  },
  {
    title: 'Automated Payments',
    desc: 'Generate invoices, track fee statuses, and send automated reminders to parents via SMS and Email.',
    icon: 'payments',
  },
  {
    title: 'Attendance Tracking',
    desc: 'QR-code based or manual attendance marking that syncs instantly with parent reporting.',
    icon: 'qr_code_scanner',
  },
  {
    title: 'Exam Results',
    desc: 'Publish exam marks and detailed performance reports directly to the student portal.',
    icon: 'assessment',
  },
  {
    title: 'Staff Management',
    desc: 'Manage tutor assignments, payroll, and access permissions with granular control.',
    icon: 'badge',
  },
]
</script>

<style lang="scss" scoped>
.text-gradient {
  background: linear-gradient(to right, #ffffff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.leading-tight {
  line-height: 1.1;
}

.font-inter {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-left: 24px;
  padding-right: 24px;
}

.glass-header {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.bg-gradient-white {
  background: linear-gradient(to right, #ffffff, #999999);
}

// Hero
.hero-section {
  padding-top: 150px;
  padding-bottom: 50px;
}

.gradient-overlay {
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 60%),
    linear-gradient(to bottom, #000000 0%, #000000 20%, #1a1a1a 100%);
}

.hero-glow {
  width: 300px;
  height: 300px;
  background: #ffffff;
  opacity: 0.1;
  filter: blur(100px);
  border-radius: 50%;
  z-index: 0;
}

.section-padding {
  padding-top: 100px;
  padding-bottom: 100px;
}

.max-w-md {
  max-width: 480px;
}
.max-w-xl {
  max-width: 800px;
}
.max-w-2xl {
  max-width: 900px;
}
.z-max {
  z-index: 9999;
}
.z-1 {
  z-index: 1;
}
.z-10 {
  z-index: 10;
}

// Borders
.border-y-grey {
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
}
.border-grey {
  border: 1px solid #333;
}
.border-t-grey {
  border-top: 1px solid #333;
}
.border-t-grey-dark {
  border-top: 1px solid #222;
}

// Card Styles
.feature-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-5px);
  }
}

.icon-box {
  background: transparent;
  color: #ffffff;
  padding: 0;
  display: inline-block;
  margin-bottom: 16px;
}
.hover-scale:hover {
  transform: scale(1.02);
}
.hover-text-white:hover {
  color: white !important;
}
.hover-bg-grey-8:hover {
  background: #424242; // grey-8 equivalent
}

.transition-all {
  transition: all 0.3s ease;
}
.transition-transform {
  transition: transform 0.3s ease;
}
.transition-colors {
  transition: color 0.3s ease;
}
.opacity-50 {
  opacity: 0.5;
}
.bg-dark-page {
  background: #0a0a0a;
}

.bg-grid {
  background-image:
    linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px);
  background-size: 40px 40px;
}
.opacity-10 {
  opacity: 0.1;
}

.circle-glow {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0) 70%);
  border-radius: 50%;
  z-index: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

.min-w-120 {
  min-width: 150px;
}

// Responsive
@media (max-width: 599px) {
  .hero-section {
    padding-top: 100px;
    padding-bottom: 40px;
  }

  .section-padding {
    padding-top: 60px;
    padding-bottom: 60px;
  }

  .text-h1 {
    font-size: 2.5rem;
    line-height: 1.1;
  }

  .text-h2 {
    font-size: 2rem;
    line-height: 1.2;
  }

  .text-h3 {
    font-size: 1.75rem;
  }

  .q-px-xl {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (min-width: 1024px) {
  .text-md-left {
    text-align: left !important;
  }
}

// Responsive Hero Alignment
.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (min-width: 1024px) {
    align-items: flex-start;
    text-align: left;
  }
}

.hero-buttons {
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
}
</style>
