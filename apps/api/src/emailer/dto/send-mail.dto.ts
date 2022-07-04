export class SendMailDto {
  tenantId: number;
  to: string[];
  subject: string;
  body: string;
  bodyHtml: string;
}
