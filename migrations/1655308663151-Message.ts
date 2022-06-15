import { MigrationInterface, QueryRunner } from "typeorm";

export class Message1655308663151 implements MigrationInterface {
    name = 'Message1655308663151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`message\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`snowflake\` varchar(64) NOT NULL,
                \`content\` text NOT NULL,
                \`guildChannelId\` int NOT NULL,
                UNIQUE INDEX \`IDX_f462bb5b62824a49b2a525fe17\` (\`snowflake\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`message\`
            ADD CONSTRAINT \`FK_6565624fcdb3ba85979437f6fd3\` FOREIGN KEY (\`guildChannelId\`) REFERENCES \`guild_channel\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_6565624fcdb3ba85979437f6fd3\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_f462bb5b62824a49b2a525fe17\` ON \`message\`
        `);
        await queryRunner.query(`
            DROP TABLE \`message\`
        `);
    }

}
