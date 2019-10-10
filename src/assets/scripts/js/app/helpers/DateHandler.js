import {Debugger} from './Debugger';

export class DateHandler {

    static parse(date){
        if(typeof date !== 'object' && Array.isArray(date) && !(date instanceof Date)){
            return Debugger.setError("Ops, the date must be passed as an object or Date object.");
        }

        return Debugger.setMessage(date, date);   
    }

}