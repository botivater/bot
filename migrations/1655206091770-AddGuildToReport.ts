import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGuildToReport1655206091770 implements MigrationInterface {
    name = 'AddGuildToReport1655206091770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD \`guildId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD CONSTRAINT \`FK_4392c3591acdf1fcc1969ee8aaf\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_4392c3591acdf1fcc1969ee8aaf\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP COLUMN \`guildId\`
        `);
    }

}
