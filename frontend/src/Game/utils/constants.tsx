export const PowerUP = {
  Speed: 'Speed',
  Paddle: 'Paddle',
  Score: 'Score'
}

export const SpeedOpts = {
  Easy: { desc: 'Speed-Slow', value: 300 },
  Medium: { desc: 'Speed-Medium', value: 500 },
  Hard: { desc: 'Speed-Fast', value: 700 }
}

export const PaddleOpts = {
  Easy: { desc: 'Paddle-Large', value: { x: 8, y: 120 } },
  Medium: { desc: 'Paddle-Medium', value: { x: 8, y: 80 } },
  Hard: { desc: 'Paddle-Small', value: { x: 8, y: 40 } }
}

export const EndScoreOpts = {
  Easy: { desc: 'End Score-3', value: 3 },
  Medium: { desc: 'End Score-7', value: 7 },
  Hard: { desc: 'End Score-10', value: 10 }
}