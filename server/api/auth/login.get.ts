export default defineEventHandler(async (event) => {
    const authUrl = getAuthUrl()
    return sendRedirect(event, authUrl)
})
