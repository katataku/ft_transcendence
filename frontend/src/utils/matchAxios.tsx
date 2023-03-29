import jwtAxios from './axiosConfig'

export function createMatch(
  match: MatchDto,
  callback: (id: number | undefined) => void
): void {
  jwtAxios
    .post<MatchDto>('/match', match)
    .then((response) => {
      callback(response.data.id)
    })
    .catch((err) => {
      alert(err)
    })
}

export function getMatches(callback: (matches: MatchDto[]) => void): void {
  jwtAxios
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
  jwtAxios
    .get<MatchDto>('/match/' + String(id))
    .then((response) => {
      callback(response.data)
    })
    .catch((err) => {
      alert(err)
    })
}

export function postMatchResult(matchResult: MatchResultDto): void {
  jwtAxios
    .post<MatchDto>('/match/result/' + String(matchResult.id), matchResult)
    .then((_response) => {})
    .catch((err) => {
      alert(err)
    })
}
