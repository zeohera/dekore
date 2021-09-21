import { IsNotEmpty } from 'class-validator';
import { IsIn, IsOptional } from 'class-validator';
import { TaskStatus } from './../task-status.enum';
export class GetTaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.DONE, TaskStatus.IN_PROCESS])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
