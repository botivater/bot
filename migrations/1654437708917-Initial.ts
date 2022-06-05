import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1654437708917 implements MigrationInterface {
    name = 'Initial1654437708917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`report\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`channelId\` varchar(64) NULL,
                \`description\` text NULL,
                \`anonymous\` tinyint NOT NULL DEFAULT 1,
                \`resolved\` tinyint NOT NULL DEFAULT 0,
                \`guildMemberId\` int NULL,
                \`reportedGuildMemberId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`guild_member\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`snowflake\` varchar(64) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`identifier\` varchar(255) NOT NULL,
                \`birthday\` date NULL,
                \`lastInteraction\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
                \`isActive\` tinyint NOT NULL DEFAULT 1,
                \`guildId\` int NOT NULL,
                UNIQUE INDEX \`snowflake_guildId\` (\`snowflake\`, \`guildId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`command_invocation\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`commandName\` varchar(255) NOT NULL,
                \`guildId\` int NULL,
                \`guildMemberId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`command_list\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                \`options\` text NOT NULL,
                \`guildId\` int NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`event_flow_action\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`actionType\` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0',
                \`actionConfig\` text NOT NULL,
                \`eventFlowId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`event_flow_condition\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`checkType\` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0',
                \`checkComparator\` enum ('0', '1', '2', '3', '4') NOT NULL DEFAULT '0',
                \`checkValue\` varchar(255) NOT NULL,
                \`eventFlowId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`event_flow_trigger\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`eventType\` enum ('0', '1', '2', '3', '4', '5', '6', '7') NOT NULL DEFAULT '0',
                \`eventFlowId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`event_flow\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`shortDescription\` varchar(255) NOT NULL,
                \`guildId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`guild_config\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`systemChannelId\` varchar(64) NOT NULL,
                \`announcementChannelId\` varchar(64) NULL,
                \`pronounCheckEnabled\` tinyint NOT NULL DEFAULT 0,
                \`welcomeMessageEnabled\` tinyint NOT NULL DEFAULT 0,
                \`welcomeMessageConfig\` text NULL,
                \`inactivityCheckEnabled\` tinyint NOT NULL DEFAULT 0,
                \`inactivityCheckConfig\` text NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`guild\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`snowflake\` varchar(64) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`guildConfigId\` int NOT NULL,
                UNIQUE INDEX \`REL_df1fe69d8c4e027ee2715be1f8\` (\`guildConfigId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`command_flow_group\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                \`type\` tinyint NOT NULL,
                \`messageId\` varchar(64) NOT NULL,
                \`channelId\` varchar(64) NOT NULL,
                \`messageText\` text NOT NULL,
                \`reactions\` text NOT NULL,
                \`guildId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`command_flow\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`onType\` tinyint NOT NULL,
                \`buildingBlockType\` tinyint NOT NULL,
                \`checkType\` tinyint NULL,
                \`checkValue\` varchar(255) NULL,
                \`options\` text NOT NULL,
                \`order\` int NOT NULL,
                \`commandFlowGroupId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD CONSTRAINT \`FK_d553abba9a2c7508c670475e610\` FOREIGN KEY (\`guildMemberId\`) REFERENCES \`guild_member\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD CONSTRAINT \`FK_9cc2b0b97d87e07af64514396cd\` FOREIGN KEY (\`reportedGuildMemberId\`) REFERENCES \`guild_member\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild_member\`
            ADD CONSTRAINT \`FK_c6adfed3d6a7330d91a4f21ce1d\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`command_invocation\`
            ADD CONSTRAINT \`FK_dca63a4e7e36da7866d949593e9\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`command_invocation\`
            ADD CONSTRAINT \`FK_1270c014b684605197cbf673776\` FOREIGN KEY (\`guildMemberId\`) REFERENCES \`guild_member\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`command_list\`
            ADD CONSTRAINT \`FK_9c0559c8fa79b8f639dab7e073d\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_flow_action\`
            ADD CONSTRAINT \`FK_02ec8f1c9f8bd36f54121fbc73e\` FOREIGN KEY (\`eventFlowId\`) REFERENCES \`event_flow\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_flow_condition\`
            ADD CONSTRAINT \`FK_0ee92e59a003958456e65021298\` FOREIGN KEY (\`eventFlowId\`) REFERENCES \`event_flow\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_flow_trigger\`
            ADD CONSTRAINT \`FK_f66298800ddbfeb8c8b55ec624d\` FOREIGN KEY (\`eventFlowId\`) REFERENCES \`event_flow\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_flow\`
            ADD CONSTRAINT \`FK_dad42063440dc9a82795a56697b\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\`
            ADD CONSTRAINT \`FK_df1fe69d8c4e027ee2715be1f8b\` FOREIGN KEY (\`guildConfigId\`) REFERENCES \`guild_config\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`command_flow_group\`
            ADD CONSTRAINT \`FK_06437da4279f95bfe104e00fcf5\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`command_flow\`
            ADD CONSTRAINT \`FK_651648a1b4561b41d021a8c0ff8\` FOREIGN KEY (\`commandFlowGroupId\`) REFERENCES \`command_flow_group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`command_flow\` DROP FOREIGN KEY \`FK_651648a1b4561b41d021a8c0ff8\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`command_flow_group\` DROP FOREIGN KEY \`FK_06437da4279f95bfe104e00fcf5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild\` DROP FOREIGN KEY \`FK_df1fe69d8c4e027ee2715be1f8b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_flow\` DROP FOREIGN KEY \`FK_dad42063440dc9a82795a56697b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_flow_trigger\` DROP FOREIGN KEY \`FK_f66298800ddbfeb8c8b55ec624d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_flow_condition\` DROP FOREIGN KEY \`FK_0ee92e59a003958456e65021298\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_flow_action\` DROP FOREIGN KEY \`FK_02ec8f1c9f8bd36f54121fbc73e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`command_list\` DROP FOREIGN KEY \`FK_9c0559c8fa79b8f639dab7e073d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`command_invocation\` DROP FOREIGN KEY \`FK_1270c014b684605197cbf673776\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`command_invocation\` DROP FOREIGN KEY \`FK_dca63a4e7e36da7866d949593e9\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`guild_member\` DROP FOREIGN KEY \`FK_c6adfed3d6a7330d91a4f21ce1d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_9cc2b0b97d87e07af64514396cd\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_d553abba9a2c7508c670475e610\`
        `);
        await queryRunner.query(`
            DROP TABLE \`command_flow\`
        `);
        await queryRunner.query(`
            DROP TABLE \`command_flow_group\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_df1fe69d8c4e027ee2715be1f8\` ON \`guild\`
        `);
        await queryRunner.query(`
            DROP TABLE \`guild\`
        `);
        await queryRunner.query(`
            DROP TABLE \`guild_config\`
        `);
        await queryRunner.query(`
            DROP TABLE \`event_flow\`
        `);
        await queryRunner.query(`
            DROP TABLE \`event_flow_trigger\`
        `);
        await queryRunner.query(`
            DROP TABLE \`event_flow_condition\`
        `);
        await queryRunner.query(`
            DROP TABLE \`event_flow_action\`
        `);
        await queryRunner.query(`
            DROP TABLE \`command_list\`
        `);
        await queryRunner.query(`
            DROP TABLE \`command_invocation\`
        `);
        await queryRunner.query(`
            DROP INDEX \`snowflake_guildId\` ON \`guild_member\`
        `);
        await queryRunner.query(`
            DROP TABLE \`guild_member\`
        `);
        await queryRunner.query(`
            DROP TABLE \`report\`
        `);
    }

}
