import { AnyAction } from 'redux';

import { LangActionTypes } from 'actions/lang-actions';

import {
    LangState,
    LangType,
} from './interfaces';

const defaultState: LangState = {
    lang: localStorage.language || navigator.language || LangType.ZH_CN,
};

export default (state = defaultState, action: AnyAction): LangState => {
    switch (action.type) {
        case LangActionTypes.CHANGE_LANG: {
            return {
                ...state,
                lang: action.payload.lang,
            };
        }
        default: {
            return state;
        }
    }    
}