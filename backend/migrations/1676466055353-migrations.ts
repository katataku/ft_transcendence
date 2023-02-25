import { SHA256 } from 'crypto-js';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1676466055353 implements MigrationInterface {
  makeInsertUserSQL = (user: string, pass: string) =>
    `INSERT INTO public.users(name, password) VALUES('` +
    user +
    `', '` +
    pass +
    `');`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const passHash = SHA256('password').toString();
    await queryRunner.query(this.makeInsertUserSQL('guest1', passHash));
    await queryRunner.query(this.makeInsertUserSQL('guest2', passHash));
    await queryRunner.query(this.makeInsertUserSQL('guest3', passHash));
    await queryRunner.query(this.makeInsertUserSQL('guest4', passHash));
    await queryRunner.commitTransaction();
    await queryRunner.startTransaction();
    const users = await queryRunner.query(
      "SELECT id FROM users WHERE name = 'guest1' LIMIT 1",
    );
    await queryRunner.query(
      `INSERT INTO public.chat_room(name, created_by, created_by_user_id, public_id) VALUES('room1',` +
        users[0].id +
        `,` +
        users[0].id +
        `,0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE from public.chat_room WHERE name = 'room1';`,
    );
    await queryRunner.query(`DELETE from public.users WHERE name = 'guest1';`);
    await queryRunner.query(`DELETE from public.users WHERE name = 'guest2';`);
    await queryRunner.query(`DELETE from public.users WHERE name = 'guest3';`);
    await queryRunner.query(`DELETE from public.users WHERE name = 'guest4';`);
  }
}
