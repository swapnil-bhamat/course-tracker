import { google } from 'googleapis'
const FILENAME = 'sa_study_tracker_data.json'

async function findFile(drive: any) {
    const response = await drive.files.list({
        q: `name = '${FILENAME}'`,
        fields: 'files(id, name)',
        spaces: 'drive'
    })
    return response.data.files[0]
}

export default defineEventHandler(async (event) => {
    const tokens = getStoredTokens(event)
    if (!tokens) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const oauth2Client = useGoogleOAuth()
    oauth2Client.setCredentials(tokens)
    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    try {
        const file = await findFile(drive)
        if (!file) return { data: null }

        const response = await drive.files.get({
            fileId: file.id,
            alt: 'media'
        })
        return { data: response.data }
    } catch (error) {
        console.error('Failed to fetch data from Drive', error)
        return { data: null }
    }
})
