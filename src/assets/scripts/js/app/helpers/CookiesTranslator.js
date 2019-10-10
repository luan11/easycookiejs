import {Validator, Debugger} from './Debugger';

/**
 * The helper class to translate cookies
 *
 * @export
 * @class CookiesTranslator
 */
export class CookiesTranslator {

    /**
     * Creates an instance of CookiesTranslator.
     * @memberof CookiesTranslator
     */
    constructor(){
        this._cookiesStorage = {};
    }    
    
    /**
     * Helper to translate cookies
     *
     * @static
     * @param {string|object} cookies
     * @param {string} [method='GET']
     * @returns {object|string}
     * @memberof CookiesTranslator
     */
    static translate(cookies, method = 'GET'){
        let translator = new CookiesTranslator;
        
        if(method === 'GET'){
            if(cookies.length === 0) return Debugger.setError('No cookies found');
            return translator._getTranslation(cookies);
        }
        
        if(method === 'SET'){
            return translator._setTranslation(cookies);
        }
    }

    /**
     * Store cookie in the storage
     *
     * @private
     * @param {string} cookieName
     * @param {string} cookieValue
     * @memberof CookiesTranslator
     */
    _storeCookie(cookieName, cookieValue){
        this._cookiesStorage[cookieName] = cookieValue;
    }

    /**
     * Get the stored cookies
     *
     * @private
     * @returns {object} Object of all cookies
     * @memberof CookiesTranslator
     */
    _getStorage(){
        return this._cookiesStorage;
    }
    
    /**
     * Translate all cookies from document.cookie to object
     *
     * @private
     * @param {string} cookies
     * @returns {object} Object of all cookies
     * @memberof CookiesTranslator
     */
    _getTranslation(cookies){
        let arrayOfCookies = decodeURIComponent(cookies).split('; ');

        for(let i = 0; i < arrayOfCookies.length; i++){
            let theCookie = arrayOfCookies[i].split('=');
            this._storeCookie(theCookie[0], theCookie[1]);
        }

        return this._getStorage();
    }

    /**
     * Transform cookie object to string
     *
     * @private
     * @param {object} cookies
     * @returns {string} String of salvable cookie
     * @memberof CookiesTranslator
     */
    _setTranslation(cookies){
        let cookiestr = "{name}={value}; expires={expires};";

        if(cookies.path !== null) cookiestr += " path={path};";
        if(cookies.domain !== null) cookiestr += " domain={domain};";
        if(cookies.maxage !== null) cookiestr += " max-age={maxage}";
        if(cookies.secure) cookiestr += " secure;";
        if(cookies.httponly) cookiestr += " HttpOnly;";
        if(cookies.samesite !== null) cookiestr += " SameSite={samesite};";

        for (const key in cookies){
            cookiestr = cookiestr.replace(new RegExp(`{${key}}`, "g"), cookies[key]);
        }

        return cookiestr;
    }

}