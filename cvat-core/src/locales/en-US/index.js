const annotationsFilter = require('./annotations-filter');
const annotationsObjects = require('./annotations-objects');
const annotationsSaver = require('./annotations-saver');
const annotations = require('./annotations');
const apiImplementation = require('./api-implementation');
const common = require('./common');
const frames = require('./frames');
const labels = require('./labels');
const lambdaManager = require('./lambda-manager');
const log = require('./log');
const loggerStorage = require('./logger-storage');
const objectState = require('./object-state');
const plugins = require('./plugins');
const serverProxy = require('./server-proxy');
const session = require('./session');

module.exports = {
    ...annotationsFilter,
    ...annotationsObjects,
    ...annotationsSaver,
    ...annotations,
    ...apiImplementation,
    ...common,
    ...frames,
    ...labels,
    ...lambdaManager,
    ...log,
    ...loggerStorage,
    ...objectState,
    ...plugins,
    ...serverProxy,
    ...session
};