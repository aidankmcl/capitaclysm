export const playerCountOptions = [2, 3, 4] as const

export type PlayerCountOption = (typeof playerCountOptions)[number]
