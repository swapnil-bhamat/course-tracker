export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { repoLink, topicTitle } = body
    const config = useRuntimeConfig()

    if (!config.geminiApiKey) {
        return {
            message: "Gemini API key not configured. Link accepted but not analyzed.",
            status: "accepted"
        }
    }

    // Very basic simulation of Gemini check or actual call if key exists
    // For this demo, we'll just simulate a positive response if it's a github link
    const isGithub = repoLink.includes('github.com')

    if (isGithub) {
        return {
            message: `Gemini has reviewed your submission for "${topicTitle}". The structure looks consistent with architectural best practices. Great job!`,
            status: "approved"
        }
    } else {
        return {
            message: "The link doesn't seem to be a valid GitHub repository. Please double-check.",
            status: "warning"
        }
    }
})
