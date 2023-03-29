import axios from 'axios'
import { localStorageKey } from '../constants'

// 42APIはjwt tokenではなく別のheaderを使いそうなので今のところdefaultのaxios
// 変更される可能性
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

// Axiosのインスタンスを作成
const jwtAxios = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_HTTP_BASE_URL
})

// リクエストインターセプターを設定
jwtAxios.interceptors.request.use(
  function (config) {
    // リクエストが送信される前の処理
    const token = localStorage.getItem(localStorageKey)

    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  async function (error) {
    // リクエスト エラーの処理
    return await Promise.reject(error)
  }
)

export default jwtAxios
