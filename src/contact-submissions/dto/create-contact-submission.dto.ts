import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsOptional,
    Length,
    Validate,
} from 'class-validator';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'isPhoneNumberValid', async: false })
export class IsPhoneNumberValidConstraint implements ValidatorConstraintInterface {
    validate(phone: string, args: ValidationArguments): boolean {
        if (!phone) return true; // campo opcional

        const country = (args.object as any).country;

        try {
            // Si no hay country y no empieza con +, lo rechazamos directamente
            if (!country && !phone.startsWith('+')) return false;

            // Parseamos con o sin país, dependiendo de si el número incluye código internacional
            const phoneNumber = phone.startsWith('+')
                ? parsePhoneNumberFromString(phone)
                : parsePhoneNumberFromString(phone, country);

            if (!phoneNumber?.isValid()) return false;

            // Si hay país, forzar que el número coincida con el país declarado
            if (country && phoneNumber.country !== country.toUpperCase()) {
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'El teléfono no tiene un formato válido para el código del país proporcionado o al menos debe tener prefijo.';
    }
}



export class CreateContactSubmissionDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre completo es obligatorio.' })
    fullName: string;

    @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
    email: string;

    @IsOptional()
    @IsString({ message: 'El país debe ser un texto.' })
    country?: string;

    @IsOptional()
    @Validate(IsPhoneNumberValidConstraint)
    phone?: string;

    @IsString()
    @IsNotEmpty({ message: 'El mensaje es obligatorio.' })
    @Length(10, 1000, {
        message: 'El mensaje debe tener entre 10 y 1000 caracteres.',
    })
    message: string;
}
