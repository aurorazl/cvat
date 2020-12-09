// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT
import { getLanguage, isZh } from './utils/lang-utils';

const LANG = `${getLanguage()}`;
const IS_ZH = `${isZh()}`;
const CREATING_AN_ANNOTATION_TASK_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#13-创建标注任务' : '#creating-an-annotation-task'}`;
const MODELS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#14-模型页' : '#models'}`;
const SEARCH_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#15-搜索' : '#search'}`;
const BASIC_NAVIGATION_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#21-基本导航' : '#basic-navigation'}`;
const TYPES_OF_SHAPES_BASICS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#22-形状类型' : '#types-of-shapes-basics'}`;
const SHAPE_MODE_BASICS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#23-形状模式基础' : '#shape-mode-basics'}`;
const TRACK_MODE_BASICS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#24-轨迹模式基础' : '#track-mode-basics'}`;
const ATTRIBUTE_ANNOTATION_MODE_BASICS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#25-属性标注模式基础' : '#attribute-annotation-mode-basics'}`;
const DOWNLOADING_ANNOTATIONS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#26-导出标注' : '#downloading-annotations'}`;
// const TASK_SYNCHRONIZATION_WITH_A_REPOSITORY_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#21-基本导航' : '#task-synchronization-with-a-repository'}`;
const WORKSPACE_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#28-工作空间' : '#workspace'}`;
const SETTINGS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#29-设置' : '#settings'}`;
const TOP_PANEL_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#210-顶部面板' : '#top-panel'}`;
const CONTROLS_SIDEBAR_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '##211-侧边栏控件' : '#controls-sidebar'}`;
const OBJECTS_SIDEBAR_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#212-对象侧边栏' : '#objects-sidebar'}`;
const SHAPE_MODE_ADVANCED_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#3-形状模式高级' : '#shape-mode-advanced'}`;
const TRACK_MODE_ADVANCED_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#4-轨迹模式高级' : '#track-mode-advanced'}`;
const ATTRIBUTE_ANNOTATION_MODE_ADVANCED_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#5-属性标注模式高级' : '#attribute-annotation-mode-advanced'}`;
const AI_TOOLS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#6-ai工具' : '#ai-tools'}`;
const ANNOTATION_WITH_RECTANGLE_BY_4_POINTS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#7-矩形四点标注' : '#annotation-with-rectangle-by-4-points'}`;
const ANNOTATION_WITH_POLYGONS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#8-多边形标注' : '#annotation-with-polygons'}`;
const ANNOTATION_WITH_POLYLINES_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#9-多段线标注' : '#annotation-with-polylines'}`;
const ANNOTATION_WITH_POINTS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#10-点标注' : '#annotation-with-points'}`;
const POINTS_IN_SHAPE_MODE_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#101-点标注形状模式' : '#points-in-shape-mode'}`;
const LINEAR_INTERPOLATION_WITH_ONE_POINT_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#102-点标注线性插值' : '#linear-interpolation-with-one-point'}`;
const ANNOTATION_WITH_CUBOIDS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#11-长方体标注' : '#annotation-with-cuboids'}`;
const ANNOTATION_WITH_TAGS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#12-标记标注' : '#annotation-with-tags'}`;
const TRACK_MODE_WITH_POLYGONS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#13-多边形轨迹模式' : '#track-mode-with-polygons'}`;
const AUTOMATIC_ANNOTATION_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#14-自动标注' : '#automatic-annotation'}`;
const SHAPE_GROUPING_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#15-形状分组' : '#shape-grouping'}`;
const FILTER_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#16-条件筛选' : '#filter'}`;
const SHORTCUTS_URL = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#17-快捷键' : '#shortcuts'}`;
const PLAYER = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#2104-播放器' : '#player'}`;
const SAVE_WORK = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#2102-保存' : '#save-work'}`;
const UNDO_REDO_BUTTONS = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#2103-撤销重做' : '#undo-redo-buttons'}`;
const OBJECTS = `documentation/user_guide.html?language=${LANG}${IS_ZH ? '#2131-对象' : '#objects'}`;

export default {
    CREATING_AN_ANNOTATION_TASK_URL,
    MODELS_URL,
    SEARCH_URL,
    BASIC_NAVIGATION_URL,
    TYPES_OF_SHAPES_BASICS_URL,
    SHAPE_MODE_BASICS_URL,
    TRACK_MODE_BASICS_URL,
    ATTRIBUTE_ANNOTATION_MODE_BASICS_URL,
    DOWNLOADING_ANNOTATIONS_URL,
    // TASK_SYNCHRONIZATION_WITH_A_REPOSITORY_URL,
    WORKSPACE_URL,
    SETTINGS_URL,
    TOP_PANEL_URL,
    CONTROLS_SIDEBAR_URL,
    OBJECTS_SIDEBAR_URL,
    SHAPE_MODE_ADVANCED_URL,
    TRACK_MODE_ADVANCED_URL,
    ATTRIBUTE_ANNOTATION_MODE_ADVANCED_URL,
    AI_TOOLS_URL,
    ANNOTATION_WITH_RECTANGLE_BY_4_POINTS_URL,
    ANNOTATION_WITH_POLYGONS_URL,
    ANNOTATION_WITH_POLYLINES_URL,
    ANNOTATION_WITH_POINTS_URL,
    POINTS_IN_SHAPE_MODE_URL,
    LINEAR_INTERPOLATION_WITH_ONE_POINT_URL,
    ANNOTATION_WITH_CUBOIDS_URL,
    ANNOTATION_WITH_TAGS_URL,
    TRACK_MODE_WITH_POLYGONS_URL,
    AUTOMATIC_ANNOTATION_URL,
    SHAPE_GROUPING_URL,
    FILTER_URL,
    SHORTCUTS_URL,
    PLAYER,
    SAVE_WORK,
    UNDO_REDO_BUTTONS,
    OBJECTS,
};
