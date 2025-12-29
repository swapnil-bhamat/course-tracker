export default defineEventHandler(async (event) => {
    const user = await getGoogleUser(event)
    if (!user) {
        return { authenticated: false }
    }
    return { authenticated: true, user }
})
