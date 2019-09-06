"use strict";
/* global process, module */


class Utility {

    static getPollingPromise(evalFunc, pollMs, resolveValue) {

        if (!this.isFunc(evalFunc) || !this.isNum(pollMs)) {

            throw new Error("getPollingPromise(evalFunc, pollMs [, resolveValue]) was not supplied with valid arguments");
        }

        const originalValue = evalFunc();

        let resolveFunc;

        if (typeof resolveValue === 'undefined') {

            //Resolve if evalFunc result is changed compared to oldValue (no resolveValue provided)
            resolveFunc = (resolve, intervalId) => {

                if (evalFunc() !== originalValue) {

                    clearInterval(intervalId);
                    resolve();
                }
            };
        }
        else if (typeof evalFunc() === typeof resolveValue) {

            //Resolve if evalFunc result is equal to resolveValue
            resolveFunc = (resolve, intervalId) => {

                if (evalFunc() === resolveValue) {

                    clearInterval(intervalId);
                    resolve();
                }
            };
        }
        else {

            throw new Error("getPollingPromise(evalFunc, pollMs [, resolveValue]) mismatched types between evalFunc and resolveValue");
        }

        return new Promise((resolve) => {

            const intervalId = setInterval(() => {

                resolveFunc(resolve, intervalId);

            }, pollMs);
        });
    }

    static setEvtEmitterRepeating(evalFunc, pollMs, eventName, emitOnValue) {

        return this.setEvtEmitter(evalFunc, pollMs, eventName, true, emitOnValue);
    }

    static setEvtEmitterNonRepeating(evalFunc, pollMs, eventName, emitOnValue) {

        return this.setEvtEmitter(evalFunc, pollMs, eventName, false, emitOnValue);
    }

    static setEvtEmitter(evalFunc, pollMs, eventName, isRepeating, emitOnValue) {

        if (!this.isFunc(evalFunc) || !this.isNum(pollMs) || !this.isStr(eventName) || !this.isBool(isRepeating) || eventName.length === 0) {

            throw new Error("setEvtEmitter(evalFunc, pollMs, eventName, isRepeating [, emitOnValue]) was not supplied with valid arguments");
        }

        let oldValue = evalFunc();

        let emitOnFunc;

        if (typeof emitOnValue === 'undefined') {
     
            //Emit event if evalFunc result is changed compared to oldValue (no emitOnValue provided)
            emitOnFunc = (intervalId) => {

                if (evalFunc() !== oldValue) {
              
                    oldValue = evalFunc();

                    if (!isRepeating) { clearInterval(intervalId); }

                    if (this.isNode) {

                        process.emit(eventName);
                    }
                    else {

                        dispatchEvent(new CustomEvent(eventName));
                    }
                }
            };
        }
        else if (typeof evalFunc() === typeof emitOnValue) {

            //Emit if evalFunc result is equal to emitOnValue
            emitOnFunc = (intervalId) => {

                if (evalFunc() === emitOnValue) {

                    if (!isRepeating) { clearInterval(intervalId); }

                    if (this.isNode) {

                        process.emit(eventName);
                    }
                    else {

                        dispatchEvent(new CustomEvent(eventName));
                    }
                }
            };
        }
        else {

            throw new Error("setEvtEmitter(evalFunc, pollMs, eventName, isRepeating [, emitOnValue]) mismatched types between evalFunc and emitOnValue");
        }

        const intervalId = setInterval(() => {

            emitOnFunc(intervalId);
 
        }, pollMs);

        return intervalId;
    }

    static isFunc(func) { return (typeof func === 'function'); }

    static isNum(num) { return (typeof num === 'number'); }

    static isStr(str) { return (typeof str === 'string'); }

    static isBool(bool) { return (typeof bool === 'boolean'); }

    static isObj(obj) { return (typeof obj === 'object'); }

    static isArr(arr) { return (Array.isArray(arr)); }

    // @ts-ignore
    static get isOpera() { return (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0); }
    // @ts-ignore
    static get isEdge() { return (navigator.userAgent.indexOf("Edge") > -1); }
    // @ts-ignore
    static get isChrome() { return (!!window.chrome && !Utility.isOpera && !Utility.isEdge); }
    // @ts-ignore
    static get isExplorer() { return (typeof document !== 'undefined' && !!document.documentMode && !Utility.isEdge); }
    // @ts-ignore
    static get isFirefox() { return (typeof window.InstallTrigger !== 'undefined'); }
    // @ts-ignore
    static get isSafari() { return (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)); }
    // @ts-ignore
    static get isNode() { return ((typeof window === 'undefined') && (typeof process !== 'undefined') && (process.release.name === 'node')); }
}


if (Utility.isNode) {

    module.exports = Utility;
}