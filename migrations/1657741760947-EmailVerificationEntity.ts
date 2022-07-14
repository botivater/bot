import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmailVerificationEntity1657741760947
  implements MigrationInterface
{
  name = 'EmailVerificationEntity1657741760947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`email_verification\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`reference\` varchar(255) NOT NULL,
                \`verificationToken\` varchar(255) NOT NULL,
                INDEX \`IDX_679884e382a3c70742dd817f03\` (\`reference\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`IDX_679884e382a3c70742dd817f03\` ON \`email_verification\`
        `);
    await queryRunner.query(`
            DROP TABLE \`email_verification\`
        `);
  }
}
