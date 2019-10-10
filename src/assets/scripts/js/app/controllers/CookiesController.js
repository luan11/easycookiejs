import {Cookie} from '../models/Cookie';
import {Debugger} from '../helpers/Debugger';
import {DateHandler} from '../helpers/DateHandler';

const theCookie = new Cookie();
const theDebugger = new Debugger();

export default class CookiesController {

    static getAll(){
        return theCookie.all();
    }

    static set(cookie){
        theCookie.set(cookie);
    }

    static enableDebug(){
        theDebugger.debug = true;
        theCookie.enableDebug();
    }

    static parseDate(date){
        theDebugger.check(DateHandler.parse(date));
    }

}