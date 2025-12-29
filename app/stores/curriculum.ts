import { defineStore } from 'pinia'
import { curriculum as initialCurriculum, type Subject } from '~/services/curriculum'
import { toast } from 'vue-sonner'

export const useCurriculumStore = defineStore('curriculum', () => {
    const subjects = ref<Subject[]>(initialCurriculum)
    const loading = ref(false)

    async function loadFromDrive() {
        loading.value = true
        try {
            const { data } = await useFetch('/api/drive/data')
            if (data.value?.data) {
                // Merge Drive data with initial curriculum structure
                // This ensures new topics are added even if Drive has old data
                const driveData = data.value.data as Subject[]
                subjects.value = subjects.value.map(s => {
                    const driveSubject = driveData.find(ds => ds.id === s.id)
                    if (!driveSubject) return s
                    return {
                        ...s,
                        topics: s.topics.map(t => {
                            const driveTopic = driveSubject.topics.find(dt => dt.id === t.id)
                            if (!driveTopic) return t
                            return { ...t, completed: driveTopic.completed, repoLink: driveTopic.repoLink }
                        })
                    }
                })
            }
        } catch (error) {
            console.error('Failed to load from Drive', error)
            toast.error('Failed to sync with Google Drive')
        } finally {
            loading.value = false
        }
    }

    async function saveToDrive() {
        try {
            await $fetch('/api/drive/data', {
                method: 'POST',
                body: subjects.value
            })
        } catch (error) {
            console.error('Failed to save to Drive', error)
            toast.error('Failed to save progress to Google Drive')
        }
    }

    async function scheduleMeeting(topic: any) {
        try {
            await $fetch('/api/calendar/event', {
                method: 'POST',
                body: {
                    title: topic.title,
                    description: topic.description
                }
            })
            toast.success('Study session scheduled in your Google Calendar!')
        } catch (error) {
            console.error('Failed to schedule meeting', error)
            toast.error('Failed to schedule calendar event')
        }
    }

    function completeTopic(subjectId: string, topicId: string, repoLink: string) {
        const subject = subjects.value.find(s => s.id === subjectId)
        if (subject) {
            const topic = subject.topics.find(t => t.id === topicId)
            if (topic) {
                topic.completed = true
                topic.repoLink = repoLink
                saveToDrive()
            }
        }
    }

    return { subjects, loading, loadFromDrive, saveToDrive, scheduleMeeting, completeTopic }
})
