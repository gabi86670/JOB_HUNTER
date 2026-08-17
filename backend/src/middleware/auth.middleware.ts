import type { Request, Response, NextFunction } from "express";
import { supabaseClient } from '@/config/supabase.js';
import { UnauthorisedError } from "@/utils/errors.js";
import { getOrCreateUser } from "@/services/user/user.services.js";


export  async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorisedError('Missing or invalid authorization header');
    }

    const token = authHeader.trim().replace("Bearer ","");

    // returns obj w data + error
    const validateToken = await supabaseClient.auth.getUser(token);
    if (validateToken.error) {
        throw new UnauthorisedError('Missing or invalid token');
    }
    const usr = validateToken.data.user;

    // attach to req + call next()
    // declare request contains user
    // req.user = { id, email };
    if (usr.email === undefined) {
        throw new UnauthorisedError('An email was not provided - user needs an email on record!');
    }
    req.user = await getOrCreateUser(usr.id, usr.email);

    next();
};