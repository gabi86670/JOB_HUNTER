

// tells ts that every express request can have a usr property
// declaration merging --> merging our stuff w 3rd party def
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- required by Express's own type-augmentation pattern
  namespace Express {
    interface Request {
      // your new field goes here
      user: {
        id: string;
        email: string | undefined;
      };
    }
  }
}

export {};