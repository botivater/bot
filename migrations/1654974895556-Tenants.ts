import { MigrationInterface, QueryRunner } from "typeorm";

export class Tenants1654974895556 implements MigrationInterface {
    name = 'Tenants1654974895556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`tenant\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`tenant_users_user\` (
                \`tenantId\` int NOT NULL,
                \`userId\` int NOT NULL,
                INDEX \`IDX_0437d48406f588873ce6274d93\` (\`tenantId\`),
                INDEX \`IDX_b8eae51a1991321212c01b8078\` (\`userId\`),
                PRIMARY KEY (\`tenantId\`, \`userId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\`
            ADD \`tenantId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\` DROP FOREIGN KEY \`FK_df1fe69d8c4e027ee2715be1f8b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\` CHANGE \`guildConfigId\` \`guildConfigId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\`
            ADD CONSTRAINT \`FK_df1fe69d8c4e027ee2715be1f8b\` FOREIGN KEY (\`guildConfigId\`) REFERENCES \`guild_config\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\`
            ADD CONSTRAINT \`FK_837bf2006a11113f428a1c11176\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`tenant_users_user\`
            ADD CONSTRAINT \`FK_0437d48406f588873ce6274d935\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenant\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`tenant_users_user\`
            ADD CONSTRAINT \`FK_b8eae51a1991321212c01b80783\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`tenant_users_user\` DROP FOREIGN KEY \`FK_b8eae51a1991321212c01b80783\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`tenant_users_user\` DROP FOREIGN KEY \`FK_0437d48406f588873ce6274d935\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\` DROP FOREIGN KEY \`FK_837bf2006a11113f428a1c11176\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\` DROP FOREIGN KEY \`FK_df1fe69d8c4e027ee2715be1f8b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\` CHANGE \`guildConfigId\` \`guildConfigId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\`
            ADD CONSTRAINT \`FK_df1fe69d8c4e027ee2715be1f8b\` FOREIGN KEY (\`guildConfigId\`) REFERENCES \`guild_config\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\` DROP COLUMN \`tenantId\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_b8eae51a1991321212c01b8078\` ON \`tenant_users_user\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_0437d48406f588873ce6274d93\` ON \`tenant_users_user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`tenant_users_user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`tenant\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    }

}
