import {CookiesTranslator} from './../helpers/CookiesTranslator';
import {Validator} from './../helpers/Validator';

export class Cookie {

    constructor(){
        this.validator = new Validator();
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

    enableLogs(){
        this.validator.logs = true;
    }

    all(){
        return this.validator.validate(this._cached);
    }

    set(cookie){
        document.cookie = CookiesTranslator.translate({ ...this.cookie, ...cookie }, 'SET');
        this._updateCache();
    }

    _updateCache(){
        this._cached = CookiesTranslator.translate(document.cookie);
    }

}