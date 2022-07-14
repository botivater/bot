export class SendEmailDto {
  tenantId: number;
  to: string[];
  subject: string;
  body: string;
  bodyHtml: string;
}
