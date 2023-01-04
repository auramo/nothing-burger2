
export async function findUserByLogin(email: string): Promise<string> {
    console.info("findUserByLogin returns test user for email", email)
    return Promise.resolve("hard-coded-test-user")
}

export default { findUserByLogin }
