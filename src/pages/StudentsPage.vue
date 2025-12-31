<template>
  <q-page class="q-pa-lg bg-grey-1 font-inter">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">Student Management</h1>
        <div class="text-subtitle1 text-grey-6 q-mt-sm">
          Manage student registrations and details
        </div>
      </div>
      <q-btn
        unelevated
        color="black"
        label="Register New Student"
        icon="person_add"
        no-caps
        class="rounded-borders q-px-lg q-py-sm shadow-2"
        @click="openStudentDialog()"
      />
    </div>

    <q-card flat class="bg-transparent no-shadow overflow-hidden">
      <!-- Search -->
      <div class="row items-center justify-between q-mb-md">
        <div class="row q-gutter-sm">
          <q-input
            v-model="filter"
            placeholder="Search students..."
            dense
            outlined
            class="search-input"
            bg-color="white"
          >
            <template v-slot:prepend><q-icon name="search" class="text-grey-5" /></template>
          </q-input>
          <!-- Future filters: Grade, Class -->
        </div>
      </div>

      <q-table
        :rows="students"
        :columns="columns"
        row-key="id"
        flat
        :filter="filter"
        :loading="loading"
        class="modern-table shadow-1 rounded-xl bg-white"
      >
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-grey-1 text-grey-8">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-bold">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- Custom Cell: Student Name & Email -->
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-avatar size="32px" class="q-mr-sm" color="blue-1" text-color="blue-8">
                {{ props.row.full_name?.charAt(0) || 'S' }}
              </q-avatar>
              <div>
                <div class="text-weight-bold">{{ props.row.full_name }}</div>
                <div class="text-caption text-grey-6">{{ props.row.email }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Custom Cell: Contact -->
        <template v-slot:body-cell-contact="props">
          <q-td :props="props">
            <div>{{ props.row.student_details?.[0]?.parent_phone || '-' }}</div>
            <div class="text-caption text-grey">
              {{ props.row.student_details?.[0]?.parent_name || 'No Parent Info' }}
            </div>
          </q-td>
        </template>

        <!-- Actions -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-left">
            <q-btn
              flat
              round
              dense
              icon="edit_note"
              color="grey-7"
              class="hover-blue q-mr-sm"
              @click="openStudentDialog(props.row)"
            >
              <q-tooltip class="bg-black">Edit Details</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete_outline"
              color="grey-7"
              class="hover-red"
              @click="deleteStudent(props.row)"
            >
              <q-tooltip class="bg-red">Delete Student</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Student Dialog -->
    <q-dialog
      v-model="showDialog"
      backdrop-filter="blur(4px)"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 600px" class="rounded-xl shadow-up-12">
        <q-card-section class="q-pt-lg q-px-lg row items-center justify-between">
          <div class="text-h6 text-weight-bold">
            {{ isEditing ? 'Edit Student' : 'Register Student' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup class="text-grey-5" />
        </q-card-section>

        <q-separator class="q-mx-lg" />

        <q-card-section class="q-px-lg q-py-lg scroll" style="max-height: 70vh">
          <q-form @submit="saveStudent" class="column q-gutter-md">
            <!-- Account Info -->
            <div class="text-subtitle2 text-grey-8">Account Information</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                  >Full Name *</label
                >
                <q-input
                  dense
                  outlined
                  v-model="form.full_name"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                  >Email Login *</label
                >
                <q-input
                  dense
                  outlined
                  v-model="form.email"
                  type="email"
                  :readonly="isEditing"
                  :bg-color="isEditing ? 'grey-1' : ''"
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>
              <div class="col-12 col-md-6" v-if="!isEditing">
                <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                  >Password *</label
                >
                <q-input dense outlined v-model="form.password" readonly bg-color="grey-1">
                  <template v-slot:append>
                    <q-btn
                      flat
                      round
                      dense
                      icon="content_copy"
                      size="sm"
                      @click="copyPassword"
                      color="grey-7"
                    />
                    <q-btn
                      flat
                      round
                      dense
                      icon="refresh"
                      size="sm"
                      @click="generatePassword"
                      color="primary"
                    />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- Personal Info -->
            <div class="text-subtitle2 text-grey-8 q-mt-sm">Personal Details</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                  >School</label
                >
                <q-input dense outlined v-model="form.school" />
              </div>
              <div class="col-12 col-md-6">
                <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                  >Current Grade</label
                >
                <q-input dense outlined v-model="form.grade" placeholder="e.g. Grade 10" />
              </div>
              <div class="col-12 col-md-6">
                <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                  >Admission No / Reg No</label
                >
                <q-input
                  dense
                  outlined
                  v-model="form.student_reg_no"
                  placeholder="Auto or Manual"
                />
              </div>
              <div class="col-12 col-md-6">
                <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                  >Date of Birth</label
                >
                <q-input dense outlined v-model="form.date_of_birth" type="date" />
              </div>
            </div>

            <!-- Address -->
            <div>
              <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                >Address</label
              >
              <q-input dense outlined v-model="form.address" type="textarea" rows="2" />
            </div>

            <!-- Parent Info -->
            <div class="text-subtitle2 text-grey-8 q-mt-sm">Parent / Guardian</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                  >Parent Name</label
                >
                <q-input dense outlined v-model="form.parent_name" />
              </div>
              <div class="col-12 col-md-6">
                <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                  >Parent Phone</label
                >
                <q-input
                  dense
                  outlined
                  v-model="form.parent_phone"
                  mask="###-#######"
                  placeholder="07X-XXXXXXX"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-px-lg q-pb-lg bg-white">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps />
          <q-btn
            unelevated
            :label="isEditing ? 'Save Changes' : 'Register Student'"
            color="black"
            @click="saveStudent"
            :loading="saving"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}
.search-input {
  width: 300px;
}
.modern-table :deep(th) {
  font-size: 0.85rem;
  padding: 16px;
}
.modern-table :deep(td) {
  font-size: 0.95rem;
}
.hover-blue:hover {
  color: #1976d2 !important;
  background: #e3f2fd;
}
.hover-red:hover {
  color: #c10015 !important;
  background: #ffebee;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(true)
const students = ref([])
const filter = ref('')
const showDialog = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const form = ref({
  // Auth
  id: '',
  email: '',
  password: '',
  full_name: '',
  // Details
  school: '',
  grade: '',
  student_reg_no: '',
  date_of_birth: '',
  address: '',
  parent_name: '',
  parent_phone: '',
})
const currentId = ref(null)

const columns = [
  { name: 'name', label: 'Student', field: 'full_name', align: 'left', sortable: true },
  {
    name: 'reg_no',
    label: 'Reg ID',
    field: (row) => row.student_details?.[0]?.student_reg_no || '-',
    align: 'left',
    sortable: true,
  },
  {
    name: 'school',
    label: 'School',
    field: (row) => row.student_details?.[0]?.school || '-',
    align: 'left',
    sortable: true,
  },
  { name: 'contact', label: 'Parent Contact', field: 'contact', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'left' },
]

// --- UTIL ---
const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let pass = ''
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.value.password = pass
}

const copyPassword = () => {
  navigator.clipboard.writeText(form.value.password)
  $q.notify({ type: 'positive', message: 'Copied', icon: 'check' })
}

// --- DATA ---
const fetchStudents = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
            *,
            student_details(*)
        `,
    )
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  if (error) {
    $q.notify({ type: 'negative', message: 'Error fetching students: ' + error.message })
  } else {
    students.value = data
  }
  loading.value = false
}

// --- ACTIONS ---
const openStudentDialog = (row = null) => {
  if (row) {
    isEditing.value = true
    currentId.value = row.id
    form.value.id = row.id

    const details = row.student_details?.[0] || {}
    form.value = {
      id: row.id,
      email: row.email,
      password: '', // No password needed for edit
      full_name: row.full_name,
      school: details.school || '',
      grade: details.grade || '',
      student_reg_no: details.student_reg_no || '',
      date_of_birth: details.date_of_birth || '',
      address: details.address || '',
      parent_name: details.parent_name || '',
      parent_phone: details.parent_phone || '',
    }
  } else {
    isEditing.value = false
    currentId.value = null
    form.value = {
      id: '',
      email: '',
      full_name: '',
      school: '',
      grade: '',
      student_reg_no: '',
      date_of_birth: '',
      address: '',
      parent_name: '',
      parent_phone: '',
    }
    generatePassword() // Generate password for new student
  }
  showDialog.value = true
}

const saveStudent = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      // Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: form.value.full_name })
        .eq('id', form.value.id)
      if (profileError) throw profileError

      // Update Details using upsert to handle both insert and update cases
      const { error: detailsError } = await supabase.from('student_details').upsert({
        id: form.value.id,
        school: form.value.school,
        grade: form.value.grade,
        student_reg_no: form.value.student_reg_no,
        date_of_birth: form.value.date_of_birth || null,
        address: form.value.address,
        parent_name: form.value.parent_name,
        parent_phone: form.value.parent_phone,
      })
      if (detailsError) throw detailsError

      $q.notify({ type: 'positive', message: 'Student updated successfully' })
    } else {
      // REGISTER NEW
      // 1. Create User (Temp Client)
      const { createClient } = await import('@supabase/supabase-js')
      const tempClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
      )

      const { data: authData, error: signUpError } = await tempClient.auth.signUp({
        email: form.value.email,
        password: form.value.password,
        options: { data: { full_name: form.value.full_name, role: 'student' } },
      })
      if (signUpError) throw signUpError
      if (!authData.user) throw new Error('User creation failed')

      const newUserId = authData.user.id

      // 2. Wait for profile to be created by trigger (poll instead of fixed timeout)
      let retries = 10
      let profileExists = false
      while (retries > 0 && !profileExists) {
        await new Promise((r) => setTimeout(r, 500))
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', newUserId)
          .single()
        if (profile) {
          profileExists = true
        }
        retries--
      }

      if (!profileExists) {
        throw new Error('Profile creation timeout - please verify the student was created')
      }

      // 3. Update Role to student
      const { error: roleError } = await supabase.from('profiles').update({ role: 'student' }).eq('id', newUserId)
      if (roleError) throw roleError

      // 4. Insert Details - throw error if fails to ensure data consistency
      const { error: detailsError } = await supabase.from('student_details').insert({
        id: newUserId,
        school: form.value.school,
        grade: form.value.grade,
        student_reg_no: form.value.student_reg_no,
        date_of_birth: form.value.date_of_birth || null,
        address: form.value.address,
        parent_name: form.value.parent_name,
        parent_phone: form.value.parent_phone,
      })
      if (detailsError) throw detailsError

      $q.notify({ type: 'positive', message: 'Student registered successfully' })
    }

    showDialog.value = false
    fetchStudents()
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  } finally {
    saving.value = false
  }
}

const deleteStudent = async (row) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Delete student? This removes their account completely.',
    cancel: true,
    ok: { label: 'Delete', color: 'negative' },
  }).onOk(async () => {
    try {
      // Use the Secure RPC we made earlier
      const { error } = await supabase.rpc('delete_user_completely', { target_user_id: row.id })
      if (error) throw error
      $q.notify({ type: 'positive', message: 'Deleted' })
      fetchStudents()
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Delete failed: ' + err.message })
    }
  })
}

onMounted(() => {
  fetchStudents()
})
</script>
