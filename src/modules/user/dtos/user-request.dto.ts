import { StringField } from "shared/decorators/dto.decorator";
import { BasePaginationRequestDTO } from "shared/dtos/base-pagination-request.dto";

export class UserListRequestDTO extends BasePaginationRequestDTO {
  @StringField({ optional: true })
  search: string;
}
