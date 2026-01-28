import { defineStore } from 'pinia'
import { curriculumData as initialCurriculum, type Curriculum, type Track, type Topic } from '~/services/curriculum'
import { toast } from 'vue-sonner'
import { useDebounceFn } from '@vueuse/core'

export const useCurriculumStore = defineStore('curriculum', () => {
    const curriculum = ref<Curriculum>(initialCurriculum)
    const loading = ref(false)

    const domains = computed(() => {
        if (!curriculum.value.STUDY_TRACK) return []
        return Object.entries(curriculum.value.STUDY_TRACK)
            .map(([id, track]) => ({ id, ...track }))
    })

    async function loadFromDrive() {
        loading.value = true
        try {
            console.log('Fetching curriculum from Drive...')
            const { data: driveRes } = await useFetch('/api/drive/data')

            if (driveRes.value?.data) {
                console.log('Loaded curriculum from Drive')
                curriculum.value = driveRes.value.data as Curriculum
                return
            }

            console.log('Drive is empty, fetching from local data.json...')
            const { data: localData } = await useFetch('/data.json')
            if (localData.value) {
                console.log('Loaded initial curriculum from local JSON')
                curriculum.value = localData.value as Curriculum
                await saveToDrive()
            }
        } catch (error) {
            console.error('Failed to sync data', error)
            toast.error('Failed to sync with Google Drive')
        } finally {
            loading.value = false
        }
    }

    const debouncedSave = useDebounceFn(async (data: Curriculum) => {
        try {
            await $fetch('/api/drive/data', {
                method: 'POST',
                body: data
            })
            return true
        } catch (error) {
            console.error('Failed to save to Drive', error)
            throw error
        }
    }, 1000)

    async function saveToDrive() {
        return await debouncedSave(curriculum.value)
    }

    // CRUD ACTIONS
    function updateMeta(meta: any) {
        curriculum.value.meta = { ...curriculum.value.meta, ...meta }
        saveToDrive()
    }

    function addTrack(id: string, track: any) {
        if (!curriculum.value.STUDY_TRACK) curriculum.value.STUDY_TRACK = {}
        curriculum.value.STUDY_TRACK[id] = track
        saveToDrive()
    }

    function updateTrack(id: string, track: any) {
        if (curriculum.value.STUDY_TRACK && curriculum.value.STUDY_TRACK[id]) {
            curriculum.value.STUDY_TRACK[id] = { ...curriculum.value.STUDY_TRACK[id], ...track }
            saveToDrive()
        }
    }

    function deleteTrack(id: string) {
        if (curriculum.value.STUDY_TRACK) {
            delete curriculum.value.STUDY_TRACK[id]
            saveToDrive()
        }
    }

    // Sections logic removed

    function completeTopic(trackId: string, topicName: string, repoLink: string) {
        const track = curriculum.value.STUDY_TRACK?.[trackId]
        if (track) {
            const topic = track.topics.find(t => t.name === topicName)
            if (topic) {
                topic.status = 'completed'
                topic.repoLink = repoLink
                topic.last_touched_date = new Date().toISOString()
                saveToDrive()
            }
        }
    }

    return {
        curriculum,
        domains,
        loading,
        loadFromDrive,
        saveToDrive,
        updateMeta,
        addTrack,
        updateTrack,
        deleteTrack,
        completeTopic
    }
})

