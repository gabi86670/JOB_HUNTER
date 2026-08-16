import  { pool } from '@/database/pool.js';
import { User } from '@/types/database.types.js';

// repo legit just talks to table + returns typed objs
// business logic using this happens in services

// pool is connection to supabase db

export async function findUserById(id: string): Promise<User | null> {

    // $1 = id parsed in
    const res = await pool.query(
        "SELECT $1 FROM users u WHERE undefined.id = id",
        [id]
    );

    if (length(res.rows) === 0 ) {
        return null;
    }

    // row exists - map db row to user (email + id)
    User usr = {
        id: res.id;
        email: res.email
    };

    return usr;

};