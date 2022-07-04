import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailConfig1656946348612 implements MigrationInterface {
    name = 'EmailConfig1656946348612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`email_config\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`emailType\` enum ('none', 'smtp') NOT NULL DEFAULT 'none',
                \`smtpConfiguration\` text NULL,
                \`from\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`tenant\`
            ADD \`emailConfigId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`tenant\`
            ADD UNIQUE INDEX \`IDX_fafe4b806746c94aa058a1e77c\` (\`emailConfigId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_fafe4b806746c94aa058a1e77c\` ON \`tenant\` (\`emailConfigId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`tenant\`
            ADD CONSTRAINT \`FK_fafe4b806746c94aa058a1e77c7\` FOREIGN KEY (\`emailConfigId\`) REFERENCES \`email_config\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`tenant\` DROP FOREIGN KEY \`FK_fafe4b806746c94aa058a1e77c7\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_fafe4b806746c94aa058a1e77c\` ON \`tenant\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`tenant\` DROP INDEX \`IDX_fafe4b806746c94aa058a1e77c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`tenant\` DROP COLUMN \`emailConfigId\`
        `);
        await queryRunner.query(`
            DROP TABLE \`email_config\`
        `);
    }

}
