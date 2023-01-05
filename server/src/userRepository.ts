
export async function findUserByLogin(email: string): Promise<string | null> {
    console.info("findUserByLogin returns test user for email", email)
    if (email === "auramo@reaktor.fi")
        return Promise.resolve("hard-coded-test-user")
    else
        return Promise.resolve(null)
}

export default { findUserByLogin }
