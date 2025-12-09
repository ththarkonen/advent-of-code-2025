
export class Timer {

    private startTime: number | null = null

    start() {
        this.startTime = performance.timeOrigin + performance.now()
    }

    stop(): number {
        if (this.startTime === null) throw new Error("Timer was not started.")
        
        const endTime = performance.timeOrigin + performance.now()
        const elapsed = endTime - this.startTime
        return Math.round( elapsed * 1000) / 1000
    }

    print(label: string = ""): void {
        console.log(`${label}${this.stop()} ms`);
    }
}