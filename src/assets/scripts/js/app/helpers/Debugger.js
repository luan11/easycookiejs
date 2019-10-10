export class Debugger {

    check(response){
        if(response.hasOwnProperty('ok') && !response.ok){
            if(this.debug) console.error(`EasyCookieJS@Debugger says: ${response.message}`);
            return false;
        }else if(response.ok){
            if(this.debug){
                if(typeof response.message === 'object'){
                    console.log("EasyCookieJS@Debugger says:", response.message);
                }else{
                    console.log(`EasyCookieJS@Debugger says: ${response.message}`);
                }
            }
            return response.response;
        }else{
            return response;
        }
    }

    static setError(message){
        return {
            ok: false,
            message: message
        };
    }

    static setMessage(message, response){
        return {
            ok: true,
            message: message,
            response: response
        };
    }

}