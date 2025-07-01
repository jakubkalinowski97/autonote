import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface WorkspacePayload {
  id: string;
  name: string;
  owner_id: string;
}

export const Workspace = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): WorkspacePayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.workspace;
  },
); 