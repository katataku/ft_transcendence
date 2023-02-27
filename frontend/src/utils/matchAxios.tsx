import axios from "axios";

export function createMatch(
  match: MatchDto,
  callback: (id: number | undefined) => void
): void {
  axios
    .post<MatchDto>('/match', match)
    .then((response) => {
      callback(response.data.id)
    })
    .catch((err) => {
      alert(err)
    })
}

export function getMatches(
  callback: (matches: MatchDto[]) => void
): void {
  axios
    .get<MatchDto[]>('/match/matches')
    .then((response) => {
      callback(response.data)
    })
    .catch((err) => {
      alert(err)
    })
}

export function getMatchById(
  id: number,
  callback: (match: MatchDto) => void
): void {
  axios
    .get<MatchDto>('/match/' + String(id))
    .then((response) => {
      callback(response.data)
    })
    .catch((err) => {
      alert(err)
    })
}

export function postMatchResult(matchResult: MatchResultDto): void {
  axios
    .post<MatchDto>('/match/result/' + String(matchResult.id), matchResult)
    .then((_response) => {})
    .catch((err) => {
      alert(err)
    })
}