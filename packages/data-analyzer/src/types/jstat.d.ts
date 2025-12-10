declare module 'jstat' {
  const jStat: {
    chisquare: {
      cdf(x: number, df: number): number
    }
    normal: {
      cdf(x: number, mean: number, std: number): number
      inv(p: number, mean: number, std: number): number
    }
  }
  export default jStat
}
