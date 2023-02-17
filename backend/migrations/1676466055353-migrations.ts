import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1676466055353 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.chat_room(name, created_by, "isPublic") VALUES('room1', 'aa', false);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE from public.chat_room WHERE name = 'room1' AND created_by = 'aa' AND "isPublic" = false;`,
    );
  }
}
