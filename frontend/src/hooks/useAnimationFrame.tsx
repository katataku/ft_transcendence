import { useEffect, useRef } from 'react'

/**
 * @param callback - browserの次のrepaintをする前に呼び出したい関数
 */
export const useAnimationFrame = (
  callback: (time: number, deltaTime: number) => void,
  useFrameFinished: boolean
): void => {
  // useRefは変更してもコンポーネントの再描画が発生しない可変変数
  // https://beta.reactjs.org/reference/react/useRef
  const requestIDRef = useRef<number>(0)
  const previousTimeRef = useRef<number>(performance.now())

  if (useFrameFinished) {
    cancelAnimationFrame(requestIDRef.current)
  }

  // requestAnimationFrameのためcallback
  // https://developer.mozilla.org/ja/docs/Web/API/window/requestAnimationFrame
  const loop = (time: number): void => {
    if (time !== previousTimeRef.current) {
      const deltaTime = (time - previousTimeRef.current) / 1000
      callback(time, deltaTime)
    }
    previousTimeRef.current = time
    requestIDRef.current = requestAnimationFrame(loop)
  }

  // コンポーネントが最初にDOMに接続された後、RequestAnimationFrameの最初のループを開始
  // https://ja.reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    requestIDRef.current = requestAnimationFrame(loop)
    return (): void => {
      cancelAnimationFrame(requestIDRef.current)
    }
  }, [])
}
