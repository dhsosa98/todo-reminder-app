import { Directory } from 'src/entities/directory.entity';

export const DirectoryProvider = [
  {
    provide: 'DIRECTORY_REPOSITORY',
    useValue: Directory,
  },
];
