import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsMobilePhone, Matches } from "class-validator";

import {
  FURIGANA_REGEX,
  JP_LONG_LOCALE,
  NAME_REGEX,
  OTP_REGEX,
  PASSWORD_REGEX,
  POSTCODE_REGEX,
} from "shared/constants/global.constants";
import { MESSAGES } from "shared/constants/messages.constants";
import { EmailField, StringField } from "shared/decorators/dto.decorator";
import { CommonHelpers } from "shared/helpers/common.helpers";

export class AuthResponseDTO {
  @ApiProperty()
  user: Partial<User>;
  accessToken: string;
}

export class PhoneDTO {
  @IsMobilePhone(JP_LONG_LOCALE, {}, { message: MESSAGES.EU_0000009 })
  @Transform(({ value }: { value: string }) => CommonHelpers.parseToPhoneNumberJPLocale(value))
  @StringField()
  phone: string;
}

export class VerifyPhoneDTO extends PhoneDTO {
  @Matches(OTP_REGEX, { message: MESSAGES.EU_0000012 })
  @StringField()
  otp: string;
}

export class RegisterUserDTO extends PhoneDTO {
  @Transform(({ value }: { value: string }) => value?.trim())
  @EmailField({}, { min: 1, max: 256 })
  email: string;

  @Matches(PASSWORD_REGEX, { message: MESSAGES.EU_0000010 })
  @StringField()
  password: string;

  @Matches(NAME_REGEX, { message: MESSAGES.EU_0000014 })
  @StringField()
  name: string;

  @Transform(({ value }: { value: string }) => value?.trim())
  @Matches(FURIGANA_REGEX)
  @StringField()
  furiganaName: string;

  @Matches(POSTCODE_REGEX, { message: MESSAGES.EU_0000011 })
  @StringField()
  postCode: string;

  @StringField()
  address: string;
 
}

export class LoginDTO {
  @EmailField({}, { min: 1, max: 256 })
  email: string;

  @Matches(PASSWORD_REGEX, { message: MESSAGES.EU_0000010 })
  @StringField()
  password: string;
}

export class ForgotPasswordDTO {
  @EmailField({}, { min: 1, max: 256 })
  email: string;
}

export class ResetPasswordDTO {
  @StringField()
  token: string;

  @Matches(PASSWORD_REGEX, { message: MESSAGES.EU_0000010 })
  @StringField()
  password: string;
}
