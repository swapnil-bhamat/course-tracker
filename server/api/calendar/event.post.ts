import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const tokens = getStoredTokens(event)

    if (!tokens) {
        throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const oauth2Client = useGoogleOAuth()
    oauth2Client.setCredentials(tokens)

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const { title, description } = body

    const startDateTime = new Array(8).fill(0).map((_, i) => {
        const d = new Date()
        d.setHours(10, 0, 0, 0) // Default to 10 AM today
        return d.toISOString()
    })[0]

    const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString()

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: `Study: ${title}`,
                description: description,
                start: { dateTime: startDateTime },
                end: { dateTime: endDateTime },
                reminders: { useDefault: true }
            }
        })
        return response.data
    } catch (error) {
        console.error('Failed to create calendar event', error)
        throw createError({ statusCode: 500, message: 'Failed to create event' })
    }
})
