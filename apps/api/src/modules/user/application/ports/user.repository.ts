import { User } from '../user.types';

export interface UserRepository {
  upsertUser(data: { sub: string; email: string; name: string }): Promise<void>;
  getUser(sub: string): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
