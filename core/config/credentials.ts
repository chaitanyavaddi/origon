export interface UserCredentials {
  email: string;
  password: string;
  role: 'associate' | 'admin' | 'vendor';
}

export const users: Record<string, UserCredentials> = {
  associate: {
    email: process.env.ASSOCIATE_EMAIL || 'venugopal.gaddam@ext.getcerta.com',
    password: process.env.ASSOCIATE_PASSWORD || 'IfvpT=[fZ{|S',
    role: 'associate',
  },
};

export function getUser(role: string): UserCredentials {
  const user = users[role];
  if (!user) {
    throw new Error(`User with role "${role}" not found in credentials`);
  }
  return user;
}