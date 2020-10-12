const annotationsObjects = require('./annotations-objects');
const annotationsSaver = require('./annotations-saver');
const serverProxy = require('./server-proxy');

module.exports = {
    ...annotationsObjects,
    ...annotationsSaver,
    ...serverProxy
};