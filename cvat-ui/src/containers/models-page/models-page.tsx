// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { connect } from 'react-redux';

import ModelsPageComponent from 'components/models-page/models-page';
import { Model, CombinedState } from 'reducers/interfaces';

interface StateToProps {
    interactors: Model[];
    detectors: Model[];
    trackers: Model[];
    reid: Model[];
    lang: string;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const { models } = state;
    const { interactors, detectors, trackers, reid } = models;
    const { lang } = state.lang;

    return {
        interactors,
        detectors,
        trackers,
        reid,
        lang,
    };
}

export default connect(mapStateToProps, {})(ModelsPageComponent);
