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
            const { data } = await useFetch('/api/drive/data')
            if (data.value?.data) {
                const driveData = data.value.data as Curriculum

                // Merge Drive data with initial curriculum structure
                // We preserve the structure of initialCurriculum but update status and repoLink from driveData
                Object.keys(curriculum.value).forEach(domainId => {
                    if (domainId === 'meta') return

                    const driveDomain = driveData[domainId]
                    if (!driveDomain) return

                    const domain = curriculum.value[domainId] as Domain
                    Object.keys(domain.sections).forEach(sectionId => {
                        const section = domain.sections[sectionId]
                        const driveSection = driveDomain.sections?.[sectionId]
                        if (!section || !driveSection) return

                        section.topics.forEach(topic => {
                            const driveTopic = driveSection.topics?.find((t: Topic) => t.name === topic.name)
                            if (driveTopic) {
                                topic.status = driveTopic.status
                                topic.repoLink = driveTopic.repoLink
                            }
                        })
                    })
                })
            }
        } catch (error) {
            console.error('Failed to load from Drive', error)
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
            toast.error('Failed to save progress to Google Drive')
        }
    }, 1000)

    async function saveToDrive() {
        await debouncedSave(curriculum.value)
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

    return { curriculum, domains, loading, loadFromDrive, saveToDrive, completeTopic }
})

