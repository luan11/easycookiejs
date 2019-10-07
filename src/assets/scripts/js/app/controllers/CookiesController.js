import {Cookie} from '../models/Cookie';

const theCookie = new Cookie();

export default class CookiesController {

    static getAll(){
        return theCookie.all();
    }

    static set(cookie){
        theCookie.set(cookie);
    }

    static enableLogs(){
        theCookie.enableLogs();
    }

}