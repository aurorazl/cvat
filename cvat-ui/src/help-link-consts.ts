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
        CREATING_AN_ANNOTATION_TASK_URL: `${PREFIX_CN}#13-创建标注任务`,
        MODELS_URL: `${PREFIX_CN}#14-模型页`,
        SEARCH_URL: `${PREFIX_CN}#15-搜索`,
        BASIC_NAVIGATION_URL: `${PREFIX_CN}#21-基本导航`,
        TYPES_OF_SHAPES_BASICS_URL: `${PREFIX_CN}#22-形状类型`,
        SHAPE_MODE_BASICS_URL: `${PREFIX_CN}#23-形状模式基础`,
        TRACK_MODE_BASICS_URL: `${PREFIX_CN}#24-轨迹模式基础`,
        ATTRIBUTE_ANNOTATION_MODE_BASICS_URL: `${PREFIX_CN}#25-属性标注模式基础`,
        DOWNLOADING_ANNOTATIONS_URL: `${PREFIX_CN}#26-导出标注`,
        // TASK_SYNCHRONIZATION_WITH_A_REPOSITORY_URL: `${PREFIX_CN}#task-synchronization-with-a-repository`,
        WORKSPACE_URL: `${PREFIX_CN}#28-工作空间`,
        SETTINGS_URL: `${PREFIX_CN}#29-设置`,
        TOP_PANEL_URL: `${PREFIX_CN}#210-顶部面板`,
        CONTROLS_SIDEBAR_URL: `${PREFIX_CN}##211-侧边栏控件`,
        OBJECTS_SIDEBAR_URL: `${PREFIX_CN}#212-对象侧边栏`,
        SHAPE_MODE_ADVANCED_URL: `${PREFIX_CN}#3-形状模式高级`,
        TRACK_MODE_ADVANCED_URL: `${PREFIX_CN}#4-轨迹模式高级'`,
        ATTRIBUTE_ANNOTATION_MODE_ADVANCED_URL: `${PREFIX_CN}#5-属性标注模式高级`,
        AI_TOOLS_URL: `${PREFIX_CN}#6-ai工具`,
        ANNOTATION_WITH_RECTANGLE_BY_4_POINTS_URL: `${PREFIX_CN}#7-矩形四点标注`,
        ANNOTATION_WITH_POLYGONS_URL: `${PREFIX_CN}#8-多边形标注`,
        ANNOTATION_WITH_POLYLINES_URL: `${PREFIX_CN}#9-多段线标注`,
        ANNOTATION_WITH_POINTS_URL: `${PREFIX_CN}#10-点标注`,
        POINTS_IN_SHAPE_MODE_URL: `${PREFIX_CN}#101-点标注形状模式`,
        LINEAR_INTERPOLATION_WITH_ONE_POINT_URL: `${PREFIX_CN}#102-点标注线性插值`,
        ANNOTATION_WITH_CUBOIDS_URL: `${PREFIX_CN}#11-长方体标注`,
        ANNOTATION_WITH_TAGS_URL: `${PREFIX_CN}#12-标记标注`,
        TRACK_MODE_WITH_POLYGONS_URL: `${PREFIX_CN}#13-多边形轨迹模式`,
        AUTOMATIC_ANNOTATION_URL: `${PREFIX_CN}#14-自动标注`,
        SHAPE_GROUPING_URL: `${PREFIX_CN}#15-形状分组`,
        FILTER_URL: `${PREFIX_CN}#16-条件筛选`,
        SHORTCUTS_URL: `${PREFIX_CN}#17-快捷键`,
        PLAYER: `${PREFIX_CN}#2104-播放器`,
        SAVE_WORK: `${PREFIX_CN}#2102-保存`,
        UNDO_REDO_BUTTONS: `${PREFIX_CN}#2103-撤销重做`,
        OBJECTS: `${PREFIX_CN}#2131-对象`,
    },
};

export default linkMap;
