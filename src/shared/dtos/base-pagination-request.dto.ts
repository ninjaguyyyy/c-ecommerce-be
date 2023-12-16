import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";

import { EnumField, IntField, StringField } from "shared/decorators/dto.decorator";

export class IdParamDTO {
  @Type(() => Number)
  @IntField()
  id: number;
}

export class BasePaginationRequestDTO {
  @Type(() => Number)
  @IntField({ optional: true })
  limit: number;

  @Type(() => Number)
  @IntField({ optional: true })
  page: number;

  @StringField({ optional: true })
  sortBy: string;

  @EnumField(Prisma.SortOrder, { optional: true })
  direction: Prisma.SortOrder;
}
