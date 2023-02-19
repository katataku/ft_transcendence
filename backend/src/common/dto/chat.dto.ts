export interface messageEventDto {
  key: number;
  user: User;
  room: string;
  msg: string;
}
interface User {
  id: number;
  name: string;
}
