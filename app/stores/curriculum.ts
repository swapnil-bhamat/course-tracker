import { defineStore } from 'pinia'
import { curriculumData as initialCurriculum, type Curriculum, type Domain, type Section, type Topic } from '~/services/curriculum'
import { toast } from 'vue-sonner'
import { useDebounceFn } from '@vueuse/core'

export const useCurriculumStore = defineStore('curriculum', () => {
    const curriculum = ref<Curriculum>(initialCurriculum)
    const loading = ref(false)

    const domains = computed(() => {
        return Object.entries(curriculum.value)
            .filter(([key]) => key !== 'meta')
            .map(([id, domain]) => ({ id, ...(domain as Domain) }))
    })

    async function loadFromDrive() {
        loading.value = true
        try {
            // 1. Try fetching from Drive
            const { data: driveRes } = await useFetch('/api/drive/data')

            if (driveRes.value?.data) {
                curriculum.value = driveRes.value.data as Curriculum
                return
            }

            // 2. If Drive is empty, fetch from local data.json
            const { data: localData } = await useFetch('/data.json')
            if (localData.value) {
                curriculum.value = localData.value as Curriculum
                // 3. Immediately save to Drive to initialize
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
        } catch (error) {
            console.error('Failed to save to Drive', error)
            // toast.error('Failed to save progress to Google Drive')
        }
    }, 1000)

    async function saveToDrive() {
        await debouncedSave(curriculum.value)
    }

    // CRUD ACTIONS
    function updateMeta(meta: any) {
        curriculum.value.meta = { ...curriculum.value.meta, ...meta }
        saveToDrive()
    }

    function addDomain(id: string, domain: Domain) {
        curriculum.value[id] = domain
        saveToDrive()
    }

    function updateDomain(id: string, domain: Domain) {
        curriculum.value[id] = { ...curriculum.value[id], ...domain }
        saveToDrive()
    }

    function deleteDomain(id: string) {
        delete curriculum.value[id]
        saveToDrive()
    }

    function updateSection(domainId: string, sectionId: string, section: Section) {
        if (curriculum.value[domainId]) {
            curriculum.value[domainId].sections[sectionId] = section
            saveToDrive()
        }
    }

    function deleteSection(domainId: string, sectionId: string) {
        if (curriculum.value[domainId]) {
            delete curriculum.value[domainId].sections[sectionId]
            saveToDrive()
        }
    }

    function completeTopic(domainId: string, sectionId: string, topicName: string, repoLink: string) {
        const domain = curriculum.value[domainId] as Domain
        if (domain) {
            const section = domain.sections[sectionId]
            if (section) {
                const topic = section.topics.find(t => t.name === topicName)
                if (topic) {
                    topic.status = 'completed'
                    topic.repoLink = repoLink
                    saveToDrive()
                }
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
        addDomain,
        updateDomain,
        deleteDomain,
        updateSection,
        deleteSection,
        completeTopic
    }
})

