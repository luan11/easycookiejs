export class Validator {

    validate(response){
        if(response.hasOwnProperty('ok') && !response.ok){
            if(this.logs) console.warn(response.message);
            return false;
        }else{
            return response;
        }
    }

    static invalid(message){
        return {
            ok: false,
            message: message
        };
    }

}