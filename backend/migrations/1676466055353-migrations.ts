import { SHA256 } from 'crypto-js';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1676466055353 implements MigrationInterface {
  makeInsertUserSQL = (user: string, pass: string) =>
    `INSERT INTO public.users(name, password) VALUES('` +
    user +
    `', '` +
    pass +
    `');`;

  makeInsertAvatarSQL = (id: number) =>
    `INSERT INTO public.user_avatars(user_id, data) VALUES(` +
    id +
    `, 'DEFAULT_AVATAR');`;

  makeInsertMatchSQL = (p1: number, p2: number) =>
    `INSERT INTO public.match(p1, p2, winner) VALUES(` + p1 + `,` + p2 + `,0)`;

  makeInsertUsrMatchHistSQL = (wins: number, losses: number) =>
    `INSERT INTO public.user_match_history(wins, losses) VALUES(` +
    wins +
    `,` +
    losses +
    `)`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const passHash = SHA256('password').toString();
    await queryRunner.query(this.makeInsertUserSQL('guest1', passHash));
    await queryRunner.query(this.makeInsertUserSQL('guest2', passHash));
    await queryRunner.query(this.makeInsertUserSQL('guest3', passHash));
    await queryRunner.query(this.makeInsertUserSQL('guest4', passHash));
    await queryRunner.query(this.makeInsertUsrMatchHistSQL(14, 35));
    await queryRunner.query(this.makeInsertUsrMatchHistSQL(0, 0));
    await queryRunner.query(this.makeInsertUsrMatchHistSQL(1, 1));
    await queryRunner.query(this.makeInsertUsrMatchHistSQL(7777, 0));
    // await queryRunner.query(this.makeInsertMatchSQL(1, 2));
    // await queryRunner.query(this.makeInsertMatchSQL(3, 4));

    await queryRunner.query(this.makeInsertAvatarSQL(1));
    await queryRunner.query(this.makeInsertAvatarSQL(2));
    await queryRunner.query(this.makeInsertAvatarSQL(3));
    await queryRunner.query(this.makeInsertAvatarSQL(4));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE from public.users WHERE name = 'guest1';`);
    await queryRunner.query(`DELETE from public.users WHERE name = 'guest2';`);
    await queryRunner.query(`DELETE from public.users WHERE name = 'guest3';`);
    await queryRunner.query(`DELETE from public.users WHERE name = 'guest4';`);
    await queryRunner.query(
      `DELETE from public.user_match_history WHERE id = 1;`,
    );
    await queryRunner.query(
      `DELETE from public.user_match_history WHERE id = 2;`,
    );
    await queryRunner.query(
      `DELETE from public.user_match_history WHERE id = 3;`,
    );
    await queryRunner.query(
      `DELETE from public.user_match_history WHERE id = 4;`,
    );
    await queryRunner.query(`DELETE from public.match WHERE p1 = 1;`);
    await queryRunner.query(`DELETE from public.match WHERE p1 = 3;`);
  }
}
