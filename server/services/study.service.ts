export type Difficulty = "easy" | "good" | "medium" | "hard";

export interface SRSResult {
    nextReviewDate: Date;
    interval: number;
}

/**
 * serviço para lidar com regras de negócio relacionadas a estudo e sistema de repetição espaçada (srs).
 */
export class StudyService {
    /**
     * calcula a próxima data de revisão e o intervalo com base na dificuldade.
     * atualmente usa intervalos fixos conforme a implementação atual no frontend.
     * 
     * tempos (em minutos):
     * - hard: 1m
     * - medium: 10m
     * - good: 2880m (2 dias)
     * - easy: 5760m (4 dias)
     */
    static calculateSRS(difficulty: Difficulty): SRSResult {
        const now = new Date();
        let factor: number;

        switch (difficulty) {
            case "hard":
                factor = 0;
                break;
            case "medium":
                factor = 10;
                break;
            case "good":
                factor = 2880;
                break;
            case "easy":
                factor = 5760;
                break;
            default:
                factor = 1;
        }

        const nextReviewDate = new Date(now.getTime() + factor * 60000);

        return {
            nextReviewDate,
            interval: factor,
        };
    }
}
