import { applyDecorators } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidationArguments,
} from "class-validator";

import { MESSAGES } from "shared/constants/messages.constants";
import { CommonHelpers } from "shared/helpers/common.helpers";

interface IDtoDecoratorOption {
  optional?: boolean;
}

function initializeDecorators(
  options: IDtoDecoratorOption,
  additionMiddle: (decorators: PropertyDecorator[]) => unknown
) {
  const ApiPropertyOpts = {} as ApiPropertyOptions;

  if (options?.optional) {
    ApiPropertyOpts.required = false;
  }

  const decorators = [ApiProperty(ApiPropertyOpts)];
  additionMiddle(decorators);

  if (options?.optional) {
    decorators.push(IsOptional());
  } else {
    decorators.push(
      IsNotEmpty({
        message: (args: ValidationArguments) => CommonHelpers.formatMessageString(MESSAGES.EC_0000004, args.property),
      })
    );
  }

  return applyDecorators(...decorators);
}

export function EnumField(entity: object, options?: IDtoDecoratorOption) {
  return initializeDecorators(options, (decorators: PropertyDecorator[]) =>
    decorators.push(
      IsEnum(entity, {
        message: (args: ValidationArguments) =>
          CommonHelpers.formatMessageString(MESSAGES.EC_0000008, args.property, args.constraints[1].join(", ")),
      }),
      ApiProperty({ enum: entity })
    )
  );
}

export function StringField(options?: IDtoDecoratorOption, length?: { min: number; max: number }) {
  return initializeDecorators(options, (decorators: PropertyDecorator[]) => {
    if (length) {
      decorators.push(
        Length(length.min, length.max, {
          message: (args: ValidationArguments) =>
            CommonHelpers.formatMessageString(
              MESSAGES.EC_0000005,
              args.property,
              args.constraints[0],
              args.constraints[1]
            ),
        })
      );
    }

    decorators.push(
      IsString({
        message: (args: ValidationArguments) => CommonHelpers.formatMessageString(MESSAGES.EC_0000005, args.property),
      })
    );
  });
}

export function NumberField(options?: IDtoDecoratorOption) {
  return initializeDecorators(options, (decorators: PropertyDecorator[]) =>
    decorators.push(
      IsNumber(
        {},
        {
          message: (args: ValidationArguments) => CommonHelpers.formatMessageString(MESSAGES.EC_0000006, args.property),
        }
      )
    )
  );
}

export function EmailField(options?: IDtoDecoratorOption, length?: { min: number; max: number }) {
  return initializeDecorators(options, (decorators: PropertyDecorator[]) => {
    if (length) {
      decorators.push(
        Length(length.min, length.max, {
          message: (args: ValidationArguments) =>
            CommonHelpers.formatMessageString(
              MESSAGES.EC_0000007,
              args.property,
              args.constraints[0],
              args.constraints[1]
            ),
        })
      );
    }

    decorators.push(
      IsEmail(
        {},
        {
          message: (args: ValidationArguments) => CommonHelpers.formatMessageString(MESSAGES.EU_0000006, args.property),
        }
      )
    );
  });
}

export function IntField(options?: IDtoDecoratorOption) {
  return initializeDecorators(options, (decorators: PropertyDecorator[]) => {
    const messageCustom = {
      message: (args: ValidationArguments) => CommonHelpers.formatMessageString(MESSAGES.EC_0000009, args.property),
    };

    decorators.push(IsInt(messageCustom), Min(1, messageCustom));
  });
}

export function ResField(options?: ApiPropertyOptions) {
  return applyDecorators(ApiProperty(options), Expose());
}
