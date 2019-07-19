'use strict';

var easyCookieJS = {
    useAlterMethods: true,
    defaultValidityDateType: 'y',
    defaultValidityDateInterval: 1,
   
    start: function(useAlterMethods, defaultValidityDateType, defaultValidityDateInterval){
        useAlterMethods = (typeof useAlterMethods !== 'undefined' && typeof useAlterMethods === 'boolean') ? useAlterMethods : this.useAlterMethods;
        
        defaultValidityDateType = (typeof defaultValidityDateType !== 'undefined' && typeof defaultValidityDateType === 'string') ? defaultValidityDateType : this.defaultValidityDateType;
        
        defaultValidityDateInterval = (typeof defaultValidityDateInterval !== 'undefined' && typeof defaultValidityDateInterval === 'number') ? defaultValidityDateInterval : this.defaultValidityDateInterval;

        var theEasyCookieJS = {
            __forceOverwrite: (useAlterMethods) ? false : true,
            __validityDateTypes: ['d', 'm', 'y'],
            __validityDateDefaultType: defaultValidityDateType,
            __validityDateDefaultInterval: defaultValidityDateInterval,
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
                validityDateType = (typeof validityDateType !== 'undefined') ? validityDateType : this.__validityDateDefaultType;
                validityDate = (typeof validityDate !== 'undefined') ? validityDate : this.__validityDateDefaultInterval;

                if(this.cookieExists(name) && !this.__forceOverwrite){
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
                        if(!this.__forceOverwrite){
                            localStorage.setItem(name, this.__date);
                        }
                        document.cookie = cookie;
                        this.__date = new Date();
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
                if(this.cookieExists(name)){
                    document.cookie = name+'=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
                    if(!this.__forceOverwrite){
                        localStorage.removeItem(name);
                    }
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
                if(cookies === false){            
                    console.warn('No cookie found!');  
                    return false;
                }  

                for(var index in cookies){
                    this.delete(index);
                }
            },
            
            /**
             * Method to alter cookie name
             * 
             * @param {string} oldName 
             * @param {string} newName 
             * 
             * @returns void on success | boolean(false) if cookie not exits
             */
            alterName: function(oldName, newName){
                if(!this.cookieExists(oldName)){
                    console.warn('The cookie not exists, please create this with set() method.');
                    return false;
                }
                var oldContent = this.get(oldName);
                var preservedDate = new Date(localStorage.getItem(oldName));
                this.delete(oldName);
                document.cookie = newName+'='+oldContent+';expires='+preservedDate.toUTCString()+';path=/';
                localStorage.setItem(newName, preservedDate);
            },
            
            /**
             * Method to alter cookie content
             * 
             * @param {string} name 
             * @param {string} newContent 
             * 
             * @returns void on success | boolean(false) if cookie not exits
             */
            alterContent: function(name, newContent){
                if(!this.cookieExists(name)){
                    console.warn('The cookie not exists, please create this with set() method.');
                    return false;
                } 
                var preservedDate = new Date(localStorage.getItem(name));
                this.delete(name);
                document.cookie = name+'='+newContent+';expires='+preservedDate.toUTCString()+';path=/';
                localStorage.setItem(name, preservedDate);
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
                if(!this.cookieExists(name)){
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
            cookieExists: function(name){
                return (this.get(name) !== false) ? true : false;
            }
        };

        if(!useAlterMethods){
            delete theEasyCookieJS.alterName;
            delete theEasyCookieJS.alterContent;
            delete theEasyCookieJS.alterValidity;
        }
        
        Object.freeze(easyCookieJS);
        
        return theEasyCookieJS;
    }
};