import { User } from "src/entities/user.entity";

export const UserProvider = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];
