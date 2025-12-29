import { google } from 'googleapis'

export const getStoredTokens = (event: any) => {
    const tokensCookie = getCookie(event, 'google_tokens')
    return tokensCookie ? JSON.parse(tokensCookie) : null
}

export const getGoogleUser = async (event: any) => {
    const tokens = getStoredTokens(event)
    if (!tokens) return null

    const oauth2Client = useGoogleOAuth()
    oauth2Client.setCredentials(tokens)

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    try {
        const { data } = await oauth2.userinfo.get()
        return data
    } catch (error) {
        console.error('Failed to fetch user info', error)
        return null
    }
}
