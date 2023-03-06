import axios from 'axios';
import { MatchDto, MatchResultDto } from 'src/common/dto/match.dto';
import { IUserQueue } from './types/game.model';

const baseUrl = 'http://localhost:3001';

export function createMatch(
  leftUser: IUserQueue,
  rightUser: IUserQueue,
  callback: (id: number, leftUser: IUserQueue, rightUser: IUserQueue) => void,
) {
  const url = baseUrl + '/match';
  console.log('createMatch');
  axios
    .post<MatchDto>(url, {
      id: 0,
      p1: leftUser.userId,
      p2: rightUser.userId,
      winner: 0,
    })
    .then((res) => {
      callback(res.data.id, leftUser, rightUser);
    })
    .catch((err) => {
      console.log(err);
    });
}

export function postMatchResult(matchResult: MatchResultDto): void {
  const url = baseUrl + '/match/result/';
  axios
    .post<MatchDto>(url + String(matchResult.id), matchResult)
    .then((_response) => {
      return;
    })
    .catch((err) => {
      console.log(err);
    });
}
