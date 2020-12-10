import i18n from "i18next";
import { Moment } from 'moment';

export const getLanguage = () => i18n.language || window.localStorage.language;

export function isZh(): boolean {
    return getLanguage() === 'zh-CN';
}

export function transShapeType(shapeType: string): string {
    return i18n.t(shapeType);
}

export function transStatesOrdering(statesOrdering: string): string {
    return i18n.t(statesOrdering);
}

export function transJobStatus(jobStatus: string): string {
    return i18n.t(jobStatus);
}

export function transMoment(date: Moment): string {
    return isZh() ? date.format('YYYY-MM-DD HH:mm') : date.format('MMMM Do YYYY HH:MM');
}