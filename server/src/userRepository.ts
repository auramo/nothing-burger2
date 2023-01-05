export async function findUserByLogin(email: string): Promise<string | null> {
  return Promise.resolve(email);
}

export default { findUserByLogin };
