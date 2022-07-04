import { MigrationInterface, QueryRunner } from "typeorm";

export class Feature1656961927570 implements MigrationInterface {
    name = 'Feature1656961927570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_fafe4b806746c94aa058a1e77c\` ON \`tenant\`
        `);
        await queryRunner.query(`
            CREATE TABLE \`feature\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`type\` enum ('none', 'lymevereniging-member-checker') NOT NULL DEFAULT 'none',
                \`tenantId\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`feature_guilds_guild\` (
                \`featureId\` int NOT NULL,
                \`guildId\` int NOT NULL,
                INDEX \`IDX_da3a4c88e8f4c3e4518c87d8a5\` (\`featureId\`),
                INDEX \`IDX_329ab66692b5f3701ed71e2516\` (\`guildId\`),
                PRIMARY KEY (\`featureId\`, \`guildId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`email_config\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`feature\`
            ADD CONSTRAINT \`FK_1dc4c05ad7be213d4f623ce41e6\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`feature_guilds_guild\`
            ADD CONSTRAINT \`FK_da3a4c88e8f4c3e4518c87d8a5e\` FOREIGN KEY (\`featureId\`) REFERENCES \`feature\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`feature_guilds_guild\`
            ADD CONSTRAINT \`FK_329ab66692b5f3701ed71e25161\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`feature_guilds_guild\` DROP FOREIGN KEY \`FK_329ab66692b5f3701ed71e25161\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`feature_guilds_guild\` DROP FOREIGN KEY \`FK_da3a4c88e8f4c3e4518c87d8a5e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`feature\` DROP FOREIGN KEY \`FK_1dc4c05ad7be213d4f623ce41e6\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`email_config\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_329ab66692b5f3701ed71e2516\` ON \`feature_guilds_guild\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_da3a4c88e8f4c3e4518c87d8a5\` ON \`feature_guilds_guild\`
        `);
        await queryRunner.query(`
            DROP TABLE \`feature_guilds_guild\`
        `);
        await queryRunner.query(`
            DROP TABLE \`feature\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_fafe4b806746c94aa058a1e77c\` ON \`tenant\` (\`emailConfigId\`)
        `);
    }

}
