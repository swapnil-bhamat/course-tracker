import { google } from 'googleapis'
const FILENAME = 'sa_study_tracker_data.json'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const tokens = getStoredTokens(event)
    if (!tokens) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const oauth2Client = useGoogleOAuth()
    oauth2Client.setCredentials(tokens)
    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    try {
        const existingFile = await drive.files.list({
            q: `name = '${FILENAME}'`,
            fields: 'files(id, name)'
        }).then(res => res.data.files[0])

        if (existingFile) {
            // Update existing file
            await drive.files.update({
                fileId: existingFile.id,
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(body)
                }
            })
        } else {
            // Create new file
            await drive.files.create({
                requestBody: {
                    name: FILENAME,
                    mimeType: 'application/json'
                },
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(body)
                }
            })
        }
        return { success: true }
    } catch (error) {
        console.error('Failed to save data to Drive', error)
        throw createError({ statusCode: 500, message: 'Failed to save data' })
    }
})
