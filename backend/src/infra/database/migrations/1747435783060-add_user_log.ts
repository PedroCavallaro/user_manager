import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserLog1747435783060 implements MigrationInterface {
    name = 'AddUserLog1747435783060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`action\` enum ('UPDATE', 'CREATE', 'DELETE') NOT NULL, \`user_id\` int NOT NULL, \`requestor_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`profile_image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`logged_at\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`last_ip_used\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_065d4d8f3b5adb4a08841eae3c\` ON \`user\` (\`name\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`user_log\` ADD CONSTRAINT \`FK_458f3e0288c68d59472b4ed92a6\` FOREIGN KEY (\`requestor_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_log\` ADD CONSTRAINT \`FK_86d86e827a8e203ef7d390e081e\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_log\` DROP FOREIGN KEY \`FK_86d86e827a8e203ef7d390e081e\``);
        await queryRunner.query(`ALTER TABLE \`user_log\` DROP FOREIGN KEY \`FK_458f3e0288c68d59472b4ed92a6\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_065d4d8f3b5adb4a08841eae3c\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`last_ip_used\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`logged_at\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`profile_image\``);
        await queryRunner.query(`DROP TABLE \`user_log\``);
    }

}
