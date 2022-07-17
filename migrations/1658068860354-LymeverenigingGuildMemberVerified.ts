import { MigrationInterface, QueryRunner } from "typeorm";

export class LymeverenigingGuildMemberVerified1658068860354 implements MigrationInterface {
    name = 'LymeverenigingGuildMemberVerified1658068860354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`lymevereniging_guild_member\`
            ADD \`registeredEmailVerified\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`lymevereniging_guild_member\` DROP COLUMN \`registeredEmailVerified\`
        `);
    }

}
