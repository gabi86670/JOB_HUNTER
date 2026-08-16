import  { pool } from '@/database/pool.js';
import { User } from '@/types/database.types.js';

// repo legit just talks to table + returns typed objs
// business logic using this happens in services

// pool is connection to supabase db

export async function findUserById(id: string): Promise<User | null> {

    // $1 = id parsed in
    const res = await pool.query(
        "SELECT id, email, createdAt, updatedAt, name_first, name_last FROM users WHERE id = $1",
        [id]
    );

    if (res.rows.length === 0 ) {
        return null;
    }

    // row exists - map db row to user (email + id)
    
    const row = res.rows[0];

    const usr: User = {
        id: row.id,
        email: row.email,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        name_first: row.name_first,
        name_last: row.name_last
    };

    return usr;

};