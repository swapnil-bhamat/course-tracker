export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const code = query.code as string

    if (!code) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid code'
        })
    }

    const oauth2Client = useGoogleOAuth()
    const { tokens } = await oauth2Client.getToken(code)

    // Store tokens in a cookie
    // Note: In a production app, tokens should be encrypted or stored in a DB
    setCookie(event, 'google_tokens', JSON.stringify(tokens), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return sendRedirect(event, '/')
})
