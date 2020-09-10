import i18n from "i18next";
import { Moment } from 'moment';

const getLanguage = () => i18n.language || window.localStorage.i18nextLng;

export function isZh(): boolean {
    return getLanguage() === 'zh-CN';
}

export function transShapeType(shapeType: string): string {
    return i18n.t(shapeType);
}

export function transMoment(date: Moment): string {
    return isZh() ? date.format('YYYY-MM-DD HH:mm') : date.format('MMMM Do YYYY HH:MM');
}