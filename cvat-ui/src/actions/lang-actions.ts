import { AnyAction } from 'redux';

export enum LangActionTypes {
    CHANGE_LANG = 'CHANGE_LANG',
}

export function changeLang(lang: string): AnyAction {
    return {
        type: LangActionTypes.CHANGE_LANG,
        payload: {
            lang,
        },
    };
}