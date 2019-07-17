'use strict';

var easyCookieJS = {
    __validityDateTypes: ['d', 'm', 'y'],
    __date: new Date(),

    /**
     * Method to set a cookie
     * 
     * @param {string} name 
     * @param {string} content 
     * @param {string} [validityDateType="y"] Date types acceptable (`d`, `m`, `y`).
     * @param {number} [validityDate=1]
     */
    set: function(name, content, validityDateType, validityDate){
        name = (typeof name !== 'undefined') ? name : null;
        content = (typeof content !== 'undefined') ? content : null;
        validityDateType = (typeof validityDateType !== 'undefined') ? validityDateType : 'y';
        validityDate = (typeof validityDate !== 'undefined') ? validityDate : 1;

        if(this.__cookieExists(name)){
            console.warn('The cookie already exists, to modify this use the alterName(), alterContent() or alterValidity() methods.');
            return 'COOKIE_EXISTS';
        }

        if(this.__validityDateTypes.indexOf(validityDateType) !== -1){
            if(name !== null && content !== null){
                if(typeof validityDate !== 'number'){
                    console.warn('The parameter validityDate must be a number!');
                    return 'WRONG_VALIDITYDATE';
                }

                switch(validityDateType){
                    case 'd':
                        this.__date.setDate(this.__date.getDate() + validityDate);
                    break;

                    case 'm':
                        this.__date.setMonth(this.__date.getMonth() + validityDate);
                    break;

                    case 'y':
                        this.__date.setFullYear(this.__date.getFullYear() + validityDate);
                    break;
                }

                var cookie = name+'='+content+';expires='+this.__date.toUTCString()+';path=/';
                document.cookie = cookie;
            }else{
                console.warn('All parameters are required!');
            }
        }else{
            console.error('The validity date type is not acceptable!', 'Acceptable values are: ' + this.__validityDateTypes.join('; '));
        }
    },
    
    /**
     * Method to get a cookie by name
     * 
     * @param {string} name 
     * 
     * @returns cookie content on success | boolean(false) if not exists the cookie
     */
    get: function(name){
        var allCookies = this.getAll();
        return (!allCookies || typeof allCookies[name] === "undefined") ? false : allCookies[name];
    },
    
    /**
     * Method to get all cookies
     * 
     * @returns object of cookies on success | boolean(false) if not exists cookies
     */
    getAll: function(){
        var pureCookies = decodeURIComponent(document.cookie);
        if(pureCookies.length === 0)
            return false;

        var cookies = {};
        pureCookies.split(';').map(function(val){
            var cookie = val.split('=');
            cookies[cookie[0].replace(/\s/g, '')] = cookie[1];
        });
        return cookies;
    },
    
    /**
     * Method to delete a cookie
     * 
     * @param {string} name 
     * 
     * @returns void on success | console warn if is not possible delete a cookie
     */
    delete: function(name){
        if(this.__cookieExists(name)){
            document.cookie = name+'=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
        }else{
            console.warn('The cookie not exists, so it can not be deleted.')
        }
    },
    
    /**
     * Method to delete all cookies
     * 
     * @returns void on success | console warn if is not possible delete a cookie
     */
    deleteAll: function(){
        var cookies = this.getAll();
        for(var index in cookies){
            this.delete(index);
        }
    },
    
    /**
     * Method to alter cookie name
     * CAUTION - this method reset the validity date to the date now and add one more year
     * 
     * @param {string} oldName 
     * @param {string} newName 
     * 
     * @returns void on success | boolean(false) if cookie not exits
     */
    alterName: function(oldName, newName){
        if(!this.__cookieExists(oldName)){
            console.warn('The cookie not exists, please create this with set() method.');
            return false;
        }
        var oldContent = this.get(oldName);
        this.delete(oldName);
        this.set(newName, oldContent);
    },
    
    /**
     * Method to alter cookie content
     * CAUTION - this method reset the validity date to the date now and add one more year
     * 
     * @param {string} name 
     * @param {string} newContent 
     * 
     * @returns void on success | boolean(false) if cookie not exits
     */
    alterContent: function(name, newContent){
        if(!this.__cookieExists(name)){
            console.warn('The cookie not exists, please create this with set() method.');
            return false;
        } 
        this.delete(name);
        this.set(name, newContent);
    },
    
    /**
     * Method to alter cookie validity
     * CAUTION - if validityType and validity are empty, validity date is setted to the date now and add one more year
     * 
     * @param {string} name 
     * @param {string=} validityType 
     * @param {number=} validity 
     * 
     * @returns void on success | boolean(false) if cookie not exits
     */
    alterValidity: function(name, validityType, validity){
        if(!this.__cookieExists(name)){
            console.warn('The cookie not exists, please create this with set() method.');
            return false;
        }
        var oldContent = this.get(name);
        this.delete(name);
        if(typeof validityType !== 'undefined' && typeof validity !== 'undefined'){
            this.set(name, oldContent, validityType, validity);
        }else{
            this.set(name, oldContent);
        }
    },

    /**
     * Method helper to verify if cookie exists
     * 
     * @param {string} name 
     * 
     * @returns boolean(true) if cookie exists | boolean(false) if cookie not exists
     */
    __cookieExists: function(name){
        return (this.get(name) !== false) ? true : false;
    }
};

Object.freeze(easyCookieJS);