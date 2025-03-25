export class FetchFailedError extends Error {
    readonly status: number;
    readonly statusText: string;
    readonly data: unknown;

    constructor(status: number, statusText: string, data: unknown) {
        super(`Fetch failed with status ${status} - ${statusText}: ${data}`);
        this.name = "FetchFailedError";
        this.status = status;
        this.statusText = statusText;
        this.data = data;
    }
}
