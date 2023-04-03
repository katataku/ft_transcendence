export const PowerUP = {
  Speed: 'Ball Speed',
  Paddle: 'Paddle Size',
  Score: 'End Score'
}

export const SpeedOpts = {
  Easy: { desc: 'Ball Speed: Slow', value: 300 },
  Medium: { desc: 'Ball Speed: Medium', value: 500 },
  Hard: { desc: 'Ball Speed: Fast', value: 700 }
}

export const PaddleOpts = {
  Easy: { desc: 'Paddle Size: Large', value: { x: 8, y: 120 } },
  Medium: { desc: 'Paddle Size: Medium', value: { x: 8, y: 80 } },
  Hard: { desc: 'PaddleSize: Small', value: { x: 8, y: 40 } }
}

export const EndScoreOpts = {
  Easy: { desc: 'End Score: 11', value: 11 },
  Medium: { desc: 'End Score: 7', value: 7 },
  Hard: { desc: 'End Score: 3', value: 3 }
}
