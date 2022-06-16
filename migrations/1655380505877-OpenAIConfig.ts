import { MigrationInterface, QueryRunner } from "typeorm";

export class OpenAIConfig1655380505877 implements MigrationInterface {
    name = 'OpenAIConfig1655380505877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`guild_config\`
            ADD \`isOpenAIEnabled\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`guild_config\` DROP COLUMN \`isOpenAIEnabled\`
        `);
    }

}
