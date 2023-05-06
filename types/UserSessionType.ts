export type UserSessionType = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean | null;
    image: string;
    stripeCustomerId: string;
  };
  expires: string;
};
