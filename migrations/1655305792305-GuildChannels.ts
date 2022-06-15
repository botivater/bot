import { MigrationInterface, QueryRunner } from "typeorm";

export class GuildChannels1655305792305 implements MigrationInterface {
    name = 'GuildChannels1655305792305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`guild_channel\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`snowflake\` varchar(64) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`guildId\` int NOT NULL,
                UNIQUE INDEX \`snowflake_guild\` (\`snowflake\`, \`guildId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild_channel\`
            ADD CONSTRAINT \`FK_76ed7d622d40efc269c65bd1bf5\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`guild_channel\` DROP FOREIGN KEY \`FK_76ed7d622d40efc269c65bd1bf5\`
        `);
        await queryRunner.query(`
            DROP INDEX \`snowflake_guild\` ON \`guild_channel\`
        `);
        await queryRunner.query(`
            DROP TABLE \`guild_channel\`
        `);
    }

}
