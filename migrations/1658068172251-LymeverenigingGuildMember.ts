import { MigrationInterface, QueryRunner } from "typeorm";

export class LymeverenigingGuildMember1658068172251 implements MigrationInterface {
    name = 'LymeverenigingGuildMember1658068172251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`lymevereniging_guild_member\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`guildMemberId\` int NOT NULL,
                \`registeredEmail\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`lymevereniging_guild_member\`
        `);
    }

}
