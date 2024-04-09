import { Inject, Injectable } from "@nestjs/common";
import { Device } from "src/entities/device.entity";


@Injectable()
export class DeviceService {
    constructor(
        @Inject('DEVICE_REPOSITORY')
        private deviceRepository: typeof Device,
    ) {}

    async registerFdcToken(userId: number, token: string): Promise<Device> {
        const dbDevice = await this.deviceRepository.findOne({ where: { userId, fdcToken: token } });
        if (dbDevice) {
            return dbDevice;
        }
        const newDevice = new Device({ userId, fdcToken: token });
        await newDevice.save();
        return newDevice;
    }
}
