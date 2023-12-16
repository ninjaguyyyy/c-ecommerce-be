import { ApiProperty } from "@nestjs/swagger";

export class BasePaginationResponseDTO {
  @ApiProperty()
  total: number;

  static convertToPaginationResponse(total: number) {
    return {
      total,
    } as BasePaginationResponseDTO;
  }
}
