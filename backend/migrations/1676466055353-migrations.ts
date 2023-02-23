import { SHA256 } from 'crypto-js';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1676466055353 implements MigrationInterface {
  makeInsertUserSQL = (user: string, pass: string) =>
    `INSERT INTO public.users(name, password) VALUES('` +
    user +
    `', '` +
    pass +
    `');`;

  makeInsertMatchSQL = (p1: number, p2: number) =>
    `INSERT INTO public.match(p1, p2, winner, powerup) VALUES(` +
    p1 +
    `,` +
    p2 +
    `, 0, false)`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const passHash = SHA256('password').toString();
    await queryRunner.query(this.makeInsertUserSQL('guest1', passHash));
    await queryRunner.query(this.makeInsertUserSQL('guest2', passHash));
    await queryRunner.query(this.makeInsertUserSQL('guest3', passHash));
    await queryRunner.query(this.makeInsertUserSQL('guest4', passHash));
    await queryRunner.query(this.makeInsertMatchSQL(1, 2));
    await queryRunner.query(this.makeInsertMatchSQL(3, 4));
    await queryRunner.query(this.makeInsertMatchSQL(5, 6));
    await queryRunner.commitTransaction();
    await queryRunner.startTransaction();
    const users = await queryRunner.query(
      "SELECT id FROM users WHERE name = 'guest1' LIMIT 1",
    );
    await queryRunner.query(
      `INSERT INTO public.chat_room(name, is_public, created_by, created_by_user_id) VALUES('room1',true,` +
        users[0].id +
        `,` +
        users[0].id +
        `)`,
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
    await queryRunner.query(`DELETE from public.match WHERE p1 = 1;`);
    await queryRunner.query(`DELETE from public.match WHERE p1 = 3;`);
    await queryRunner.query(`DELETE from public.match WHERE p1 = 5;`);
  }
}
