import { Squadra } from "src/app/formation/model/squadra";
import { UtenteLogin } from "src/app/login/model/utenteLogin";

export class UtenteAggiornato {
    utente:UtenteLogin | undefined
    squadra : Squadra | undefined
}