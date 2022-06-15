import { MigrationInterface, QueryRunner } from "typeorm";

export class GuildChannelsType1655307531715 implements MigrationInterface {
    name = 'GuildChannelsType1655307531715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`guild_channel\`
            ADD \`type\` varchar(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`guild_channel\` DROP COLUMN \`type\`
        `);
    }

}
