import { MigrationInterface, QueryRunner } from "typeorm";

export class OpenAIUsage1656155220402 implements MigrationInterface {
    name = 'OpenAIUsage1656155220402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`open_ai_usage\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`totalTokens\` int NOT NULL DEFAULT '0',
                \`guildId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`open_ai_usage\`
            ADD CONSTRAINT \`FK_4841093cb36a2b3045936ade8af\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`open_ai_usage\` DROP FOREIGN KEY \`FK_4841093cb36a2b3045936ade8af\`
        `);
        await queryRunner.query(`
            DROP TABLE \`open_ai_usage\`
        `);
    }

}
