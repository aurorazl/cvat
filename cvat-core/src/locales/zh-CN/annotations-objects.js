const annotationsObjects = {
    "Rectangle must have 2 points, but got ${points.length / 2}": "矩形必须有2个点，目前有${points.length / 2}个",
    "Polygon must have at least 3 points, but got ${points.length / 2}": "多边形至少需要3个点，目前有${points.length / 2}个",
    "Polyline must have at least 2 points, but got ${points.length / 2}": "多段线至少需要2个点，目前有${points.length / 2}个",
    "Points must have at least 1 points, but got ${points.length / 2}": "必须有1个点，目前有${points.length / 2}个",
    "Points must have exact 8 points, but got ${points.length / 2}": "必须有8个点，目前有${points.length / 2}个",
    "Unknown value of shapeType has been recieved ${shapeType}": "未知的shapeType值：${shapeType}",
    "Attribute value is expected to be string, but got ${typeof (value)}": "属性值应该是字符串，目前是${typeof (value)}",
    "Trying to save an attribute attribute with id ${attrID} and invalid value ${value}": "尝试保存ID为{{attrID}}且值为无效值{{value}}的attribute属性",
    "The label of the shape doesn't have the attribute with id ${attrID} and value ${value}": "形状标注没有id为 ${attrID} value为 ${value}的属性",
    'Got invalid color value: "${data.color}"': '无效颜色值："${data.color}"',
    "Can not remove the latest keyframe of an object. Consider removing the object instead": "无法删除对象的最新关键帧。可以考虑删除该对象",
    "Is not implemented": "未实现",
    "Got frame is not equal to the frame of the shape": "得到的帧与形状帧不相同",
    "No one left position or right position was found. ": "左位置和右位置均未找到。",
    "Interpolation impossible. Client ID: ${this.clientID}": "无法插值。Client ID: ${this.clientID}",
    "Got frame is not equal to the frame of the tag": "得到的帧与标记帧不相同"
  }

  module.exports = annotationsObjects;