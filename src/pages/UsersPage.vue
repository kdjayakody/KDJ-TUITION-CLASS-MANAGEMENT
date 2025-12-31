<template>
  <q-page class="q-pa-lg bg-grey-1 font-inter">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">User Management</h1>
        <div class="text-subtitle1 text-grey-6 q-mt-sm">
          Manage access and roles for your institute
        </div>
      </div>
      <q-btn
        unelevated
        color="black"
        label="Add New User"
        icon="add"
        no-caps
        class="rounded-borders q-px-lg q-py-sm shadow-2"
        @click="openAddUserDialog"
      />
    </div>

    <q-card flat class="bg-transparent no-shadow overflow-hidden">
      <!-- Search & Filter Header -->
      <div class="row items-center justify-between q-mb-md">
        <q-input
          v-model="filter"
          placeholder="Search users..."
          dense
          outlined
          class="search-input rounded-borders"
          bg-color="white"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-grey-5" />
          </template>
        </q-input>
        <!-- Additional Filters could go here -->
      </div>

      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        flat
        :filter="filter"
        :loading="loading"
        class="modern-table"
      >
        <!-- Custom Header -->
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-grey-1 text-grey-8">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-bold">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- Role Badge -->
        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-badge
              :class="getRoleBadgeClass(props.row.role)"
              class="q-px-md q-py-xs rounded-full text-weight-medium"
            >
              {{ props.row.role || 'User' }}
            </q-badge>
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
              class="q-mr-sm hover-blue"
              @click="editUser(props.row)"
            >
              <q-tooltip class="bg-black">Edit User</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete_outline"
              color="grey-7"
              class="hover-red"
              @click="deleteUser(props.row)"
            >
              <q-tooltip class="bg-red">Delete User</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modern Dialog -->
    <q-dialog
      v-model="showAddUserDialog"
      backdrop-filter="blur(4px)"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 400px" class="rounded-xl shadow-up-12">
        <q-card-section class="q-pt-lg q-px-lg row items-center justify-between">
          <div class="text-h6 text-weight-bold">
            {{ isEditing ? 'Edit Profile' : 'Create Account' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup class="text-grey-5" />
        </q-card-section>

        <q-card-section class="q-px-lg q-pb-lg q-pt-none column q-gutter-md">
          <!-- Email -->
          <div>
            <label class="text-grey-7 text-weight-medium text-caption q-mb-xs block"
              >Email Address</label
            >
            <q-input
              dense
              outlined
              v-model="newUser.email"
              placeholder="e.g. name@example.com"
              :readonly="isEditing"
              :bg-color="isEditing ? 'grey-1' : 'white'"
            />
          </div>

          <!-- Password -->
          <div v-if="!isEditing">
            <label class="text-grey-7 text-weight-medium text-caption q-mb-xs block"
              >Password</label
            >
            <q-input dense outlined v-model="newUser.password" readonly bg-color="grey-1">
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  icon="content_copy"
                  size="sm"
                  @click="copyPassword"
                  color="grey-7"
                >
                  <q-tooltip>Copy</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  icon="refresh"
                  size="sm"
                  @click="generatePassword"
                  color="primary"
                >
                  <q-tooltip>Generate New</q-tooltip>
                </q-btn>
              </template>
            </q-input>
            <div class="text-caption text-grey-5 q-mt-xs">Auto-generated secure password</div>
          </div>

          <!-- Full Name -->
          <div>
            <label class="text-grey-7 text-weight-medium text-caption q-mb-xs block"
              >Full Name</label
            >
            <q-input dense outlined v-model="newUser.full_name" placeholder="John Doe" />
          </div>

          <!-- Role -->
          <div>
            <label class="text-grey-7 text-weight-medium text-caption q-mb-xs block"
              >Access Level</label
            >
            <q-select
              dense
              outlined
              v-model="newUser.role"
              :options="['admin', 'staff', 'tutor', 'student']"
              dropdown-icon="expand_more"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-lg q-pb-lg bg-white">
          <q-btn
            flat
            label="Cancel"
            color="grey-7"
            class="text-weight-bold"
            v-close-popup
            no-caps
          />
          <q-btn
            unelevated
            :label="isEditing ? 'Save Changes' : 'Create User'"
            color="black"
            class="text-weight-bold q-px-md rounded-borders"
            @click="saveUser"
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
  padding-top: 16px;
  padding-bottom: 16px;
}
.modern-table :deep(td) {
  font-size: 0.95rem;
}
.rounded-full {
  border-radius: 9999px;
}
.hover-blue:hover {
  color: #1976d2 !important;
  background: #e3f2fd;
}
.hover-red:hover {
  color: #c10015 !important;
  background: #ffebee;
}

/* badge colors */
.badge-admin {
  background: #f3e8ff;
  color: #7e22ce;
}
.badge-staff {
  background: #e0f2fe;
  color: #0369a1;
}
.badge-tutor {
  background: #ffedd5;
  color: #c2410c;
}
.badge-student {
  background: #dcfce7;
  color: #15803d;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(true)
const users = ref([])
const showAddUserDialog = ref(false)
const filter = ref('')

const newUser = ref({
  email: '',
  password: '',
  role: 'student',
  full_name: '',
})

const columns = [
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'full_name', label: 'Full Name', field: 'full_name', align: 'left', sortable: true },
  { name: 'role', label: 'Role', field: 'role', align: 'center', sortable: true },
  {
    name: 'created_at',
    label: 'Joined',
    field: 'created_at',
    format: (val) => new Date(val).toLocaleDateString(),
    align: 'left',
    sortable: true,
  },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left' },
]

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin':
      return 'badge-admin'
    case 'staff':
      return 'badge-staff'
    case 'tutor':
      return 'badge-tutor'
    default:
      return 'badge-student'
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    users.value = data
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch users: ' + error.message,
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}

const isEditing = ref(false)

const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let pass = ''
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  newUser.value.password = pass
}

const copyPassword = () => {
  navigator.clipboard.writeText(newUser.value.password)
  $q.notify({ color: 'positive', message: 'Password copied to clipboard', icon: 'content_copy' })
}

const openAddUserDialog = () => {
  isEditing.value = false
  newUser.value = { email: '', password: '', role: 'student', full_name: '' }
  generatePassword() // Auto generate password
  showAddUserDialog.value = true
}

const editUser = (user) => {
  isEditing.value = true
  newUser.value = { ...user } // Copy user data
  showAddUserDialog.value = true
}

const saveUser = async () => {
  try {
    if (isEditing.value) {
      // Update existing user profile
      console.log('Attemping to update user:', newUser.value)

      const { data, error } = await supabase
        .from('profiles')
        .update({
          role: newUser.value.role,
          full_name: newUser.value.full_name,
        })
        .eq('id', newUser.value.id)
        .select()

      console.log('Update result:', { data, error })

      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('No rows updated. Check permissions or ID.')
      }

      $q.notify({ color: 'positive', message: 'User updated successfully', icon: 'check' })
    } else {
      // Create new user using a temporary, non-persisted Supabase client
      // This allows acting as "another user" (signing them up) without logging out the Admin.

      const { createClient } = await import('@supabase/supabase-js')

      const tempClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false, // Don't overwrite admin session
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        },
      )

      const { data: authData, error: signUpError } = await tempClient.auth.signUp({
        email: newUser.value.email,
        password: newUser.value.password,
        options: {
          data: {
            full_name: newUser.value.full_name,
          },
        },
      })

      if (signUpError) throw signUpError

      // The 'handle_new_user' trigger has already created the profile with default 'user' role.
      // We now need to update it if a specific role was chosen.
      if (authData.user && newUser.value.role !== 'user') {
        // Wait a tiny bit for trigger to complete
        await new Promise((r) => setTimeout(r, 1000))

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: newUser.value.role })
          .eq('id', authData.user.id)

        if (updateError) {
          console.warn('Could not auto-update role. Manual update required.', updateError)
        }
      }

      $q.notify({ color: 'positive', message: 'User created successfully', icon: 'check' })
    }
    showAddUserDialog.value = false
    // Slight delay to allow trigger/backend to finish
    setTimeout(() => {
      fetchUsers()
    }, 1000)
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error saving user: ' + error.message, icon: 'error' })
  }
}

const deleteUser = (user) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete user ${user.email}? This action cannot be undone.`,
    persistent: true,
    ok: { label: 'Delete', color: 'negative', flat: true },
    cancel: { color: 'grey-8', flat: true },
  }).onOk(async () => {
    try {
      const { error } = await supabase.rpc('delete_user_completely', {
        target_user_id: user.id,
      })

      if (error) throw error

      $q.notify({ color: 'positive', message: 'User deleted successfully', icon: 'check' })
      fetchUsers()
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Failed to delete user: ' + error.message,
        icon: 'error',
      })
    }
  })
}

onMounted(() => {
  fetchUsers()
})
</script>
