import { createUser, findUserById } from "@/repositories/user.repository.js";
import { User } from "@/types/database.types.js";


export async function getOrCreateUser(id: string, email: string): Promise<User> {
    // first check user exists. if no user exists - make new one
    const usrExist = await findUserById(id);
    if (usrExist === null ) {
        return createUser(id, email);
    }

    return usrExist; 
}