import jwtAxios from './axiosConfig'

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
