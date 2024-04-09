import { IsBoolean, IsIn, IsString, Validate, IsArray } from "class-validator";
import { ScheduleValidator } from "src/validators/Schedule";


export class NotificationDto {
    @IsBoolean()
    active?: boolean;

    @IsArray()
    providers: string[];

    @Validate(ScheduleValidator)
    schedule: string;
}