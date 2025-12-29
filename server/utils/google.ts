import { google } from 'googleapis'

export const useGoogleOAuth = () => {
    const config = useRuntimeConfig()

    const oauth2Client = new google.auth.OAuth2(
        config.googleClientId,
        config.googleClientSecret,
        config.googleRedirectUri
    )

    return oauth2Client
}

export const getAuthUrl = () => {
    const oauth2Client = useGoogleOAuth()

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/calendar.events'
    ]

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    })
}
