import { User } from '@/types/database.types.js';

// tells ts that every express request can have a usr property

// declaration merging --> merging our stuff w 3rd party def
declare global {
  namespace Express {
    interface Request {
      // your new field goes here
      user: User
    }
  }
}

export {};