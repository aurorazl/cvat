// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

// interface Item {
//     [key: string]: string
// }
interface ItemColl {
    [key: string]: Record<string, string>
}

const PREFIX_EN = 'documentation/user_guide.html?language=en-US';
const PREFIX_CN = 'documentation/user_guide.html?language=zh-CN';

const linkMap: ItemColl = {
    ['en-US']: {
        CREATING_AN_ANNOTATION_TASK_URL: `${PREFIX_EN}#creating-an-annotation-task`,
        MODELS_URL: `${PREFIX_EN}#models`,
        SEARCH_URL: `${PREFIX_EN}#search`,
        BASIC_NAVIGATION_URL: `${PREFIX_EN}#basic-navigation`,
        TYPES_OF_SHAPES_BASICS_URL: `${PREFIX_EN}#types-of-shapes-basics`,
        SHAPE_MODE_BASICS_URL: `${PREFIX_EN}#shape-mode-basics`,
        TRACK_MODE_BASICS_URL: `${PREFIX_EN}#track-mode-basics`,
        ATTRIBUTE_ANNOTATION_MODE_BASICS_URL: `${PREFIX_EN}#attribute-annotation-mode-basics`,
        DOWNLOADING_ANNOTATIONS_URL: `${PREFIX_EN}#downloading-annotations`,
        // TASK_SYNCHRONIZATION_WITH_A_REPOSITORY_URL: `${PREFIX_EN}#task-synchronization-with-a-repository`,
        WORKSPACE_URL: `${PREFIX_EN}#workspace`,
        SETTINGS_URL: `${PREFIX_EN}#settings`,
        TOP_PANEL_URL: `${PREFIX_EN}#top-panel`,
        CONTROLS_SIDEBAR_URL: `${PREFIX_EN}#controls-sidebar`,
        OBJECTS_SIDEBAR_URL: `${PREFIX_EN}#objects-sidebar`,
        SHAPE_MODE_ADVANCED_URL: `${PREFIX_EN}#shape-mode-advanced`,
        TRACK_MODE_ADVANCED_URL: `${PREFIX_EN}#track-mode-advanced'`,
        ATTRIBUTE_ANNOTATION_MODE_ADVANCED_URL: `${PREFIX_EN}#attribute-annotation-mode-advanced`,
        AI_TOOLS_URL: `${PREFIX_EN}#ai-tools`,
        ANNOTATION_WITH_RECTANGLE_BY_4_POINTS_URL: `${PREFIX_EN}#annotation-with-rectangle-by-4-points`,
        ANNOTATION_WITH_POLYGONS_URL: `${PREFIX_EN}#annotation-with-polygons`,
        ANNOTATION_WITH_POLYLINES_URL: `${PREFIX_EN}#annotation-with-polylines`,
        ANNOTATION_WITH_POINTS_URL: `${PREFIX_EN}#annotation-with-points`,
        POINTS_IN_SHAPE_MODE_URL: `${PREFIX_EN}#points-in-shape-mode`,
        LINEAR_INTERPOLATION_WITH_ONE_POINT_URL: `${PREFIX_EN}#linear-interpolation-with-one-point`,
        ANNOTATION_WITH_CUBOIDS_URL: `${PREFIX_EN}#annotation-with-cuboids`,
        ANNOTATION_WITH_TAGS_URL: `${PREFIX_EN}#annotation-with-tags`,
        TRACK_MODE_WITH_POLYGONS_URL: `${PREFIX_EN}#track-mode-with-polygons`,
        AUTOMATIC_ANNOTATION_URL: `${PREFIX_EN}#automatic-annotation`,
        SHAPE_GROUPING_URL: `${PREFIX_EN}#shape-grouping`,
        FILTER_URL: `${PREFIX_EN}#filter`,
        SHORTCUTS_URL: `${PREFIX_EN}#shortcuts`,
        PLAYER: `${PREFIX_EN}#player`,
        SAVE_WORK: `${PREFIX_EN}#save-work`,
        UNDO_REDO_BUTTONS: `${PREFIX_EN}#undo-redo-buttons`,
        OBJECTS: `${PREFIX_EN}#objects`,
    },
    ['zh-CN']: {
        CREATING_AN_ANNOTATION_TASK_URL: `${PREFIX_CN}#13-??????????????????`,
        MODELS_URL: `${PREFIX_CN}#14-?????????`,
        SEARCH_URL: `${PREFIX_CN}#15-??????`,
        BASIC_NAVIGATION_URL: `${PREFIX_CN}#21-????????????`,
        TYPES_OF_SHAPES_BASICS_URL: `${PREFIX_CN}#22-????????????`,
        SHAPE_MODE_BASICS_URL: `${PREFIX_CN}#23-??????????????????`,
        TRACK_MODE_BASICS_URL: `${PREFIX_CN}#24-??????????????????`,
        ATTRIBUTE_ANNOTATION_MODE_BASICS_URL: `${PREFIX_CN}#25-????????????????????????`,
        DOWNLOADING_ANNOTATIONS_URL: `${PREFIX_CN}#26-????????????`,
        // TASK_SYNCHRONIZATION_WITH_A_REPOSITORY_URL: `${PREFIX_CN}#task-synchronization-with-a-repository`,
        WORKSPACE_URL: `${PREFIX_CN}#28-????????????`,
        SETTINGS_URL: `${PREFIX_CN}#29-??????`,
        TOP_PANEL_URL: `${PREFIX_CN}#210-????????????`,
        CONTROLS_SIDEBAR_URL: `${PREFIX_CN}##211-???????????????`,
        OBJECTS_SIDEBAR_URL: `${PREFIX_CN}#212-???????????????`,
        SHAPE_MODE_ADVANCED_URL: `${PREFIX_CN}#3-??????????????????`,
        TRACK_MODE_ADVANCED_URL: `${PREFIX_CN}#4-??????????????????'`,
        ATTRIBUTE_ANNOTATION_MODE_ADVANCED_URL: `${PREFIX_CN}#5-????????????????????????`,
        AI_TOOLS_URL: `${PREFIX_CN}#6-ai??????`,
        ANNOTATION_WITH_RECTANGLE_BY_4_POINTS_URL: `${PREFIX_CN}#7-??????????????????`,
        ANNOTATION_WITH_POLYGONS_URL: `${PREFIX_CN}#8-???????????????`,
        ANNOTATION_WITH_POLYLINES_URL: `${PREFIX_CN}#9-???????????????`,
        ANNOTATION_WITH_POINTS_URL: `${PREFIX_CN}#10-?????????`,
        POINTS_IN_SHAPE_MODE_URL: `${PREFIX_CN}#101-?????????????????????`,
        LINEAR_INTERPOLATION_WITH_ONE_POINT_URL: `${PREFIX_CN}#102-?????????????????????`,
        ANNOTATION_WITH_CUBOIDS_URL: `${PREFIX_CN}#11-???????????????`,
        ANNOTATION_WITH_TAGS_URL: `${PREFIX_CN}#12-????????????`,
        TRACK_MODE_WITH_POLYGONS_URL: `${PREFIX_CN}#13-?????????????????????`,
        AUTOMATIC_ANNOTATION_URL: `${PREFIX_CN}#14-????????????`,
        SHAPE_GROUPING_URL: `${PREFIX_CN}#15-????????????`,
        FILTER_URL: `${PREFIX_CN}#16-????????????`,
        SHORTCUTS_URL: `${PREFIX_CN}#17-?????????`,
        PLAYER: `${PREFIX_CN}#2104-?????????`,
        SAVE_WORK: `${PREFIX_CN}#2102-??????`,
        UNDO_REDO_BUTTONS: `${PREFIX_CN}#2103-????????????`,
        OBJECTS: `${PREFIX_CN}#2131-??????`,
    },
};

export default linkMap;
