import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageMember1655308762656 implements MigrationInterface {
    name = 'MessageMember1655308762656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`message\`
            ADD \`guildMemberId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`message\`
            ADD CONSTRAINT \`FK_a809e11895eed4f4331cd463a17\` FOREIGN KEY (\`guildMemberId\`) REFERENCES \`guild_member\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_a809e11895eed4f4331cd463a17\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`message\` DROP COLUMN \`guildMemberId\`
        `);
    }

}
