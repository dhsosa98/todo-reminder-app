import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'scheduleValidator', async: false })
export class ScheduleValidator implements ValidatorConstraintInterface {

    validate(schedule: string, args: ValidationArguments) {
        console.log(schedule);
        const everyMinutePattern = /^Every (\d+) minutes$/gi;
        const everyHourPattern = /^Every (\d+) hours$/gi;
        const everyDayPattern = /^Every (\d+) days at (\d{1,2}:\d{2})$/gi;
        const everyWeekPattern = /^Every (\d+) weeks at (\d{1,2}:\d{2}) on (\w+)$/gi;
        const everyMonthPattern = /^Every (\d+) months at (\d{1,2}:\d{2}) on (each (\d{1,2}) day|the (first|second|third|fourth|fifth|last) (Mon|Tue|Wed|Thu|Fri|Sat|Sun))$/gi;

        if (everyMinutePattern.exec(schedule)) {
            return true;
        }  
        if (everyHourPattern.exec(schedule)) {
            return true;
        }  
        if (everyDayPattern.exec(schedule)) {
            return true;
        }  
        if (everyWeekPattern.exec(schedule)) {
            return true;
        }  
        if (everyMonthPattern.exec(schedule)) {
            return true;
        } 
        return false;
        // Add your validation logic here
        // Return true if the schedule is valid, false otherwise
    }

    defaultMessage(args: ValidationArguments) {
        // You can customize the validation error message here
        return 'Schedule is not valid!';
    }
}