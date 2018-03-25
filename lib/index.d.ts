export interface PromiseGenerator {
    (): Promise<any>;
}
export declare type Progress = {
    total: number;
    resolve: number[];
    reject: number[];
    timeout: number[];
};
export interface IOnProgress {
    (value: Progress): void;
}
export declare enum StatusCode {
    RESOLVE = 0,
    REJECT = 1,
    TIMEOUT = -1,
}
export default function ParallelPromise(promises: PromiseGenerator[], timeouts?: number[], onProgress?: IOnProgress): Promise<any>;
