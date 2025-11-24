import { successResponse } from "@libs/api-gateway"

const greeting = async (event) => {
    return successResponse({
        message: `Hello, welcome to the Jamsy's Serverless world! ${new Date().toISOString()}`,
    })
}

export const main = greeting;