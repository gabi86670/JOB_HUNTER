import  { pool } from '@/database/pool.js';
import { User } from '@/types/database.types.js';
import { NotFoundError } from '@/utils/errors.js';

// repo legit just talks to table + returns typed objs
// business logic using this happens in services

// pool is connection to supabase db

interface UserRow {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  name_first: string | null;
  name_last: string | null;
}

export async function findUserById(id: string): Promise<User | null> {
    // $1 = id parsed in
    const res = await pool.query<UserRow>(
        "SELECT id, email, created_at, updated_at, name_first, name_last FROM users WHERE id = $1",
        [id]
    );

    if (res.rows.length === 0 ) {
        return null;
    }

    // row exists - map db row to user (email + id)
    const row = res.rows[0];

    if (!row) {
        return null;
    }

    const usr: User = {
        id: row.id,
        email: row.email,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        nameFirst: row.name_first,
        nameLast: row.name_last
    };

    return usr;

};

export async function createUser(id: string, email: string): Promise<User> {
    const res = await pool.query<UserRow>(
        "INSERT INTO users (id, email) values ($1, $2) RETURNING *",
        [id, email]);

    const row = res.rows[0];


    const usr: User = {
        id: row.id,
        email: row.email,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        nameFirst: row.name_first,
        nameLast: row.name_last
    };

    return usr;
};