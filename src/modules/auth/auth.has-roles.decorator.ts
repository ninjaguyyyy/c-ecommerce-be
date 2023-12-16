import { SetMetadata } from "@nestjs/common";

import { Role } from "shared/constants/global.constants";

export const HasRoles = (...roles: Role[]) => {
  return SetMetadata("roles", roles);
};
