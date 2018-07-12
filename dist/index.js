"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["RESOLVE"] = 0] = "RESOLVE";
    StatusCode[StatusCode["REJECT"] = 1] = "REJECT";
    StatusCode[StatusCode["TIMEOUT"] = -1] = "TIMEOUT";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
function ParallelPromise(promises, timeouts, onProgress) {
    if (timeouts === void 0) { timeouts = []; }
    if (onProgress === void 0) { onProgress = function (x) { return x; }; }
    var totalCount = promises.length;
    var resolveQueue = [];
    var rejectQueue = [];
    var timeoutQueue = [];
    var rets = promises.map(function (e, i) {
        var ret;
        if (timeouts[i]) {
            var timeoutHandler_1;
            var end_1 = false;
            ret = [
                new Promise(function (resolve) {
                    timeoutHandler_1 = setTimeout(function () {
                        if (!end_1) {
                            end_1 = true;
                            timeoutQueue.push(i);
                            onProgress({
                                total: totalCount,
                                resolve: resolveQueue.slice(0),
                                reject: rejectQueue.slice(0),
                                timeout: timeoutQueue.slice(0),
                            });
                            resolve({ status: StatusCode.TIMEOUT, timeout: timeouts[i] });
                        }
                    }, timeouts[i]);
                }),
                new Promise(function (resolve) {
                    e().then(function (d) {
                        if (!end_1) {
                            end_1 = true;
                            clearTimeout(timeoutHandler_1);
                            resolveQueue.push(i);
                            onProgress({
                                total: totalCount,
                                resolve: resolveQueue.slice(0),
                                reject: rejectQueue.slice(0),
                                timeout: timeoutQueue.slice(0),
                            });
                            resolve({ status: StatusCode.RESOLVE, data: d });
                        }
                    }).catch(function (d) {
                        if (!end_1) {
                            end_1 = true;
                            clearTimeout(timeoutHandler_1);
                            rejectQueue.push(i);
                            onProgress({
                                total: totalCount,
                                resolve: resolveQueue.slice(0),
                                reject: rejectQueue.slice(0),
                                timeout: timeoutQueue.slice(0),
                            });
                            resolve({ status: StatusCode.REJECT, error: d });
                        }
                    });
                }),
            ];
        }
        else {
            ret = [
                new Promise(function (resolve) {
                    e().then(function (d) {
                        resolveQueue.push(i);
                        onProgress({
                            total: totalCount,
                            resolve: resolveQueue.slice(0),
                            reject: rejectQueue.slice(0),
                            timeout: timeoutQueue.slice(0),
                        });
                        resolve({ status: StatusCode.RESOLVE, data: d });
                    }).catch(function (d) {
                        rejectQueue.push(i);
                        onProgress({
                            total: totalCount,
                            resolve: resolveQueue.slice(0),
                            reject: rejectQueue.slice(0),
                            timeout: timeoutQueue.slice(0),
                        });
                        resolve({ status: StatusCode.REJECT, error: d });
                    });
                })
            ];
        }
        return Promise.race(ret);
    });
    return Promise.all(rets);
}
exports.default = ParallelPromise;
//# sourceMappingURL=index.js.map