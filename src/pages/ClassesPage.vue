<template>
  <q-page class="q-pa-lg bg-grey-1 font-inter">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">Class Management</h1>
        <div class="text-subtitle1 text-grey-6 q-mt-sm">Manage subjects, schedules, and tutors</div>
      </div>
    </div>

    <!-- Tabs -->
    <q-tabs
      v-model="tab"
      class="text-grey q-mb-lg bg-transparent"
      active-color="black"
      indicator-color="black"
      align="left"
      narrow-indicator
    >
      <q-tab name="classes" label="Classes" class="text-weight-medium" />
      <q-tab name="subjects" label="Subjects" class="text-weight-medium" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <!-- CLASSES TAB -->
      <q-tab-panel name="classes" class="q-pa-none">
        <q-card flat class="bg-transparent no-shadow overflow-hidden">
          <div class="row items-center justify-between q-mb-md">
            <q-input
              v-model="classFilter"
              placeholder="Search classes..."
              dense
              outlined
              class="search-input"
              bg-color="white"
            >
              <template v-slot:prepend><q-icon name="search" class="text-grey-5" /></template>
            </q-input>
            <q-btn
              unelevated
              color="black"
              label="Create New Class"
              icon="add"
              no-caps
              class="rounded-borders q-px-md"
              @click="openClassDialog()"
            />
          </div>

          <q-table
            :rows="classes"
            :columns="classColumns"
            row-key="id"
            flat
            :filter="classFilter"
            :loading="loadingClasses"
            class="modern-table shadow-1 rounded-xl bg-white"
          >
            <template v-slot:header="props">
              <q-tr :props="props" class="bg-grey-1 text-grey-8">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  class="text-weight-bold"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body-cell-subject="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ props.row.subjects?.name }}</div>
                <div class="text-caption text-grey-6">{{ props.row.subjects?.code }}</div>
              </q-td>
            </template>

            <template v-slot:body-cell-tutor="props">
              <q-td :props="props">
                <div v-if="props.row.profiles">
                  <q-avatar size="24px" class="q-mr-xs" color="blue-1" text-color="blue-8">{{
                    props.row.profiles.full_name?.charAt(0) || 'T'
                  }}</q-avatar>
                  {{ props.row.profiles.full_name || props.row.profiles.email }}
                </div>
                <div v-else class="text-grey-5 text-italic">Unassigned</div>
              </q-td>
            </template>

            <template v-slot:body-cell-schedule="props">
              <q-td :props="props">
                <q-badge color="grey-3" text-color="black" class="q-pa-xs">
                  {{ props.row.day }} • {{ formatTime(props.row.start_time) }} -
                  {{ formatTime(props.row.end_time) }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.is_active ? 'positive' : 'grey'"
                  class="rounded-full q-px-sm"
                >
                  {{ props.row.is_active ? 'Active' : 'Inactive' }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-left">
                <q-btn
                  flat
                  round
                  dense
                  icon="edit_note"
                  color="grey-7"
                  class="hover-blue q-mr-sm"
                  @click="openClassDialog(props.row)"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="delete_outline"
                  color="grey-7"
                  class="hover-red"
                  @click="deleteClass(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <!-- SUBJECTS TAB -->
      <q-tab-panel name="subjects" class="q-pa-none">
        <q-card flat class="bg-transparent no-shadow overflow-hidden">
          <div class="row items-center justify-between q-mb-md">
            <q-input
              v-model="subjectFilter"
              placeholder="Search subjects..."
              dense
              outlined
              class="search-input"
              bg-color="white"
            >
              <template v-slot:prepend><q-icon name="search" class="text-grey-5" /></template>
            </q-input>
            <q-btn
              unelevated
              color="black"
              label="Add New Subject"
              icon="add"
              no-caps
              class="rounded-borders q-px-md"
              @click="openSubjectDialog()"
            />
          </div>

          <q-table
            :rows="subjects"
            :columns="subjectColumns"
            row-key="id"
            flat
            :filter="subjectFilter"
            :loading="loadingSubjects"
            class="modern-table shadow-1 rounded-xl bg-white"
          >
            <template v-slot:header="props">
              <q-tr :props="props" class="bg-grey-1 text-grey-8">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  class="text-weight-bold"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-left">
                <q-btn
                  flat
                  round
                  dense
                  icon="edit_note"
                  color="grey-7"
                  class="hover-blue q-mr-sm"
                  @click="openSubjectDialog(props.row)"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="delete_outline"
                  color="grey-7"
                  class="hover-red"
                  @click="deleteSubject(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- CLASS DIALOG -->
    <q-dialog
      v-model="showClassDialog"
      backdrop-filter="blur(4px)"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 500px" class="rounded-xl shadow-up-12">
        <q-card-section class="q-pt-lg q-px-lg row items-center justify-between">
          <div class="text-h6 text-weight-bold">
            {{ editingClass ? 'Edit Class' : 'Create Class' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup class="text-grey-5" />
        </q-card-section>

        <q-card-section class="q-px-lg q-pb-lg column q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-8">
              <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                >Subject</label
              >
              <q-select
                dense
                outlined
                v-model="classForm.subject"
                :options="subjects"
                option-label="name"
                option-value="id"
                label="Select Subject"
                emit-value
                map-options
              />
            </div>
            <div class="col-4">
              <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block">Grade</label>
              <q-input dense outlined v-model="classForm.grade" placeholder="e.g. 11/A/L" />
            </div>
          </div>

          <div>
            <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block">Tutor</label>
            <q-select
              dense
              outlined
              v-model="classForm.tutor_id"
              :options="tutors"
              option-label="full_name"
              option-value="id"
              label="Assign Tutor"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.full_name }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-4">
              <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block">Day</label>
              <q-select
                dense
                outlined
                v-model="classForm.day"
                :options="[
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ]"
              />
            </div>
            <div class="col-4">
              <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                >Start Time</label
              >
              <q-input dense outlined v-model="classForm.start_time" mask="time" :rules="['time']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="classForm.start_time" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-4">
              <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
                >End Time</label
              >
              <q-input dense outlined v-model="classForm.end_time" mask="time" :rules="['time']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="classForm.end_time" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <div>
            <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
              >Monthly Fee (LKR)</label
            >
            <q-input dense outlined type="number" v-model="classForm.monthly_fee" prefix="Rs." />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-lg q-pb-lg bg-white">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps />
          <q-btn
            unelevated
            :label="editingClass ? 'Update Class' : 'Create Class'"
            color="black"
            @click="saveClass"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- SUBJECT DIALOG -->
    <q-dialog
      v-model="showSubjectDialog"
      backdrop-filter="blur(4px)"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="min-width: 400px" class="rounded-xl shadow-up-12">
        <q-card-section class="q-pt-lg q-px-lg row items-center justify-between">
          <div class="text-h6 text-weight-bold">
            {{ editingSubject ? 'Edit Subject' : 'Add Subject' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup class="text-grey-5" />
        </q-card-section>

        <q-card-section class="q-px-lg q-pb-lg column q-gutter-md">
          <div>
            <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
              >Subject Name</label
            >
            <q-input dense outlined v-model="subjectForm.name" placeholder="Mathematics" />
          </div>
          <div>
            <label class="text-caption text-weight-medium text-grey-7 q-mb-xs block"
              >Subject Code (Optional)</label
            >
            <q-input dense outlined v-model="subjectForm.code" placeholder="MATH101" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-lg q-pb-lg bg-white">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps />
          <q-btn
            unelevated
            :label="editingSubject ? 'Update Subject' : 'Add Subject'"
            color="black"
            @click="saveSubject"
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
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const tab = ref('classes')

// --- SUBJECTS STATE ---
const subjects = ref([])
const loadingSubjects = ref(false)
const subjectFilter = ref('')
const showSubjectDialog = ref(false)
const editingSubject = ref(null)
const subjectForm = ref({ name: '', code: '' })

const subjectColumns = [
  { name: 'name', label: 'Subject Name', field: 'name', align: 'left', sortable: true },
  { name: 'code', label: 'Code', field: 'code', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left' },
]

// --- CLASSES STATE ---
const classes = ref([])
const loadingClasses = ref(false)
const classFilter = ref('')
const showClassDialog = ref(false)
const editingClass = ref(null)
const tutors = ref([])
const classForm = ref({
  subject: null,
  tutor_id: null,
  grade: '',
  day: 'Monday',
  start_time: '08:00',
  end_time: '10:00',
  monthly_fee: 0,
})

const classColumns = [
  {
    name: 'subject',
    label: 'Subject',
    field: (row) => row.subjects?.name,
    align: 'left',
    sortable: true,
  },
  { name: 'grade', label: 'Grade', field: 'grade', align: 'left', sortable: true },
  { name: 'tutor', label: 'Tutor', field: 'tutor_id', align: 'left', sortable: true },
  { name: 'schedule', label: 'Schedule', field: 'start_time', align: 'left', sortable: true },
  {
    name: 'fee',
    label: 'Fee (LKR)',
    field: 'monthly_fee',
    align: 'right',
    sortable: true,
    format: (val) => `Rs. ${val}`,
  },
  { name: 'status', label: 'Status', field: 'is_active', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left' },
]

// --- UTILS ---
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const [hours, minutes] = timeStr.split(':')
  const date = new Date()
  date.setHours(hours)
  date.setMinutes(minutes)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// --- FETCH DATA ---
const fetchSubjects = async () => {
  loadingSubjects.value = true
  const { data, error } = await supabase.from('subjects').select('*').order('name')
  if (error) $q.notify({ type: 'negative', message: 'Error loading subjects' })
  else subjects.value = data
  loadingSubjects.value = false
}

const fetchClasses = async () => {
  loadingClasses.value = true
  const { data, error } = await supabase
    .from('classes')
    .select(`*, subjects(*), profiles!classes_tutor_id_fkey(*)`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error loading classes' })
  } else classes.value = data
  loadingClasses.value = false
}

const fetchTutors = async () => {
  // Ideally filter by role='tutor' but for now showing all users so admin can be assigned too
  const { data, error } = await supabase.from('profiles').select('*').in('role', ['tutor', 'admin'])
  if (error) console.error(error)
  else tutors.value = data
}

// --- SUBJECT OPERATIONS ---
const openSubjectDialog = (row = null) => {
  if (row) {
    editingSubject.value = row
    subjectForm.value = { name: row.name, code: row.code }
  } else {
    editingSubject.value = null
    subjectForm.value = { name: '', code: '' }
  }
  showSubjectDialog.value = true
}

const saveSubject = async () => {
  if (!subjectForm.value.name) return $q.notify({ type: 'warning', message: 'Name is required' })

  try {
    let error
    if (editingSubject.value) {
      ;({ error } = await supabase
        .from('subjects')
        .update(subjectForm.value)
        .eq('id', editingSubject.value.id))
    } else {
      ;({ error } = await supabase.from('subjects').insert(subjectForm.value))
    }

    if (error) throw error
    $q.notify({ type: 'positive', message: 'Subject saved successfully' })
    showSubjectDialog.value = false
    fetchSubjects()
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  }
}

const deleteSubject = async (row) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Delete this subject?',
    cancel: true,
    ok: { label: 'Delete', color: 'negative' },
  }).onOk(async () => {
    try {
      const { error } = await supabase.from('subjects').delete().eq('id', row.id)
      if (error) throw error // Will fail if used in classes due to Foreign Key restriction (which is good)
      $q.notify({ type: 'positive', message: 'Deleted' })
      fetchSubjects()
    } catch (err) {
      console.error(err)
      $q.notify({ type: 'negative', message: 'Cannot delete: Subject is likely in use.' })
    }
  })
}

// --- CLASS OPERATIONS ---
const openClassDialog = (row = null) => {
  if (row) {
    editingClass.value = row
    classForm.value = {
      subject: row.subject_id,
      tutor_id: row.tutor_id,
      grade: row.grade,
      day: row.day,
      start_time: row.start_time,
      end_time: row.end_time,
      monthly_fee: row.monthly_fee,
    }
  } else {
    editingClass.value = null
    classForm.value = {
      subject: null,
      tutor_id: null,
      grade: '',
      day: 'Monday',
      start_time: '08:00',
      end_time: '10:00',
      monthly_fee: 0,
    }
  }
  showClassDialog.value = true
}

const saveClass = async () => {
  if (!classForm.value.subject || !classForm.value.grade)
    return $q.notify({ type: 'warning', message: 'Subject and Grade required' })

  const payload = {
    subject_id: classForm.value.subject,
    tutor_id: classForm.value.tutor_id,
    grade: classForm.value.grade,
    day: classForm.value.day,
    start_time: classForm.value.start_time,
    end_time: classForm.value.end_time,
    monthly_fee: classForm.value.monthly_fee,
  }

  try {
    let error
    if (editingClass.value) {
      ;({ error } = await supabase.from('classes').update(payload).eq('id', editingClass.value.id))
    } else {
      ;({ error } = await supabase.from('classes').insert(payload))
    }

    if (error) throw error
    $q.notify({ type: 'positive', message: 'Class saved successfully' })
    showClassDialog.value = false
    fetchClasses()
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  }
}

const deleteClass = async (row) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Delete this class?',
    cancel: true,
    ok: { label: 'Delete', color: 'negative' },
  }).onOk(async () => {
    const { error } = await supabase.from('classes').delete().eq('id', row.id)
    if (error) $q.notify({ type: 'negative', message: error.message })
    else {
      $q.notify({ type: 'positive', message: 'Deleted' })
      fetchClasses()
    }
  })
}

onMounted(() => {
  fetchSubjects()
  fetchClasses()
  fetchTutors()
})
</script>
