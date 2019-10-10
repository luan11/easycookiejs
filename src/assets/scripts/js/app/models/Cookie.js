import {CookiesTranslator} from './../helpers/CookiesTranslator';
import {Debugger} from '../helpers/Debugger';

export class Cookie {

    constructor(){
        this.debugger = new Debugger();
        this.cookie = {
            name: '',
            value: '',
            path: null,
            domain: null,
            maxage: null,
            expires: 0,
            secure: false,
            httponly: false,
            samesite: null,
        };
        this._cached = CookiesTranslator.translate(document.cookie);
    }

    enableDebug(){
        this.debugger.debug = true;
    }

    all(){
        return this.debugger.check(this._cached);
    }

    set(cookie){
        document.cookie = CookiesTranslator.translate({ ...this.cookie, ...cookie }, 'SET');
        this._updateCache();
    }

    _updateCache(){
        this._cached = CookiesTranslator.translate(document.cookie);
    }

}