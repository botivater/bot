import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDiscordRemovalToMessage1655362910007 implements MigrationInterface {
    name = 'AddDiscordRemovalToMessage1655362910007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`message\`
            ADD \`isRemovedOnDiscord\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`message\` DROP COLUMN \`isRemovedOnDiscord\`
        `);
    }

}
