import { Device } from 'src/entities/device.entity';

export const DeviceProvider = [
  {
    provide: 'DEVICE_REPOSITORY',
    useValue: Device,
  },
];
