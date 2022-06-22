import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommandAlias1655904425584 implements MigrationInterface {
  name = 'AddCommandAlias1655904425584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`command_alias\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`commandName\` varchar(255) NOT NULL,
                \`internalName\` varchar(255) NOT NULL,
                \`guildId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`command_alias\`
            ADD CONSTRAINT \`FK_5a0df2e169a7757956564cddd0b\` FOREIGN KEY (\`guildId\`) REFERENCES \`guild\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`command_alias\` DROP FOREIGN KEY \`FK_5a0df2e169a7757956564cddd0b\`
        `);
    await queryRunner.query(`
            DROP TABLE \`command_alias\`
        `);
  }
}
