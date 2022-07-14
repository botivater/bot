export class SendVerificationEmailDto {
  tenantId: number;
  to: string[];
  subject: string;
  body: string;
  bodyHtml: string;
  verification: {
    reference: string;
    verificationToken: string;
  };
}
