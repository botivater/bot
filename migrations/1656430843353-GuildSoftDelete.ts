import { MigrationInterface, QueryRunner } from "typeorm";

export class GuildSoftDelete1656430843353 implements MigrationInterface {
    name = 'GuildSoftDelete1656430843353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`guild_member\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`guild\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild_member\` DROP COLUMN \`deletedAt\`
        `);
    }

}
