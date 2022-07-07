export class CheckMemberStatusApiResponseDto {
  values: { id: number; status_id: number }[];
  entity: string;
  action: string;
  debug?: boolean;
  version: number;
  count: number;
  countFetched: number;
}
