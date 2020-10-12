const annotationsObjects = {
    "Rectangle must have 2 points, but got ${points.length / 2}": "Rectangle must have 2 points, but got ${points.length / 2}",
    "Polygon must have at least 3 points, but got ${points.length / 2}": "Polygon must have at least 3 points, but got ${points.length / 2}",
    "Polyline must have at least 2 points, but got ${points.length / 2}": "Polyline must have at least 2 points, but got ${points.length / 2}",
    "Points must have at least 1 points, but got ${points.length / 2}": "Points must have at least 1 points, but got ${points.length / 2}",
    "Points must have exact 8 points, but got ${points.length / 2}": "Points must have exact 8 points, but got ${points.length / 2}",
    "Unknown value of shapeType has been recieved ${shapeType}": "Unknown value of shapeType has been recieved ${shapeType}",
    "Attribute value is expected to be string, but got ${typeof (value)}": "Attribute value is expected to be string, but got ${typeof (value)}",
    "Trying to save an attribute attribute with id ${attrID} and invalid value ${value}": "Trying to save an attribute attribute with id ${attrID} and invalid value ${value}",
    "The label of the shape doesn't have the attribute with id ${attrID} and value ${value}": "The label of the shape doesn't have the attribute with id ${attrID} and value ${value}",
    "Got invalid color value: ": "Got invalid color value: ",
    "Can not remove the latest keyframe of an object. Consider removing the object instead": "Can not remove the latest keyframe of an object. Consider removing the object instead",
    "Is not implemented": "Is not implemented",
    "Got frame is not equal to the frame of the shape": "Got frame is not equal to the frame of the shape",
    "No one left position or right position was found. Interpolation impossible. Client ID: ${this.clientID}": "No one left position or right position was found. Interpolation impossible. Client ID: ${this.clientID}",
    "Got frame is not equal to the frame of the tag": "Got frame is not equal to the frame of the tag"
  }

  module.exports = annotationsObjects;