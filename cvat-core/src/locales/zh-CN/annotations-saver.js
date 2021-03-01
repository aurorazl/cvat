const annotationsSaver = {
  'Id of object is defined "${object.id}" but it absents in initial state': '对象的ID定义为“ $ {object.id}”，但在初始状态中不存在',
  "Number of indexes is differed by number of saved objects ${indexesLength} vs ${savedLength}": "索引数与保存对象数不同：分别是${indexesLength} 与 ${savedLength}",  
  "Created objects are being saved on the server": "新建的对象正在保存到服务器",
  "Updated objects are being saved on the server": "更新的对象正在被保存到服务器",
  "Deleted objects are being deleted from the server": "正在从服务器删除已删除的对象"
}

module.exports = annotationsSaver;  