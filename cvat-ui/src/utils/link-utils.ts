import { ShapeType } from 'reducers/interfaces';
import linkConsts from 'help-link-consts';

export const getShapeLinkUrl = (type: string, lang: string): string =>{
    let link = '';

    switch(type){
        case ShapeType.RECTANGLE:
            link = linkConsts[lang].ANNOTATION_WITH_RECTANGLE_BY_4_POINTS_URL;
            break;
        case ShapeType.POLYGON:
            link = linkConsts[lang].ANNOTATION_WITH_POLYGONS_URL;
            break;
        case ShapeType.POLYLINE:
            link = linkConsts[lang].ANNOTATION_WITH_POLYLINES_URL;
            break;
        case ShapeType.POINTS:
            link = linkConsts[lang].ANNOTATION_WITH_POINTS_URL;
            break;
        case ShapeType.CUBOID:
            link = linkConsts[lang].ANNOTATION_WITH_CUBOIDS_URL;
            break;
        default:
            break;
    }

    return link;
}