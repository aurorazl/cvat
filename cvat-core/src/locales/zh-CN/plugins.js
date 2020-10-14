module.exports = {
    'Exception in plugin ${plugin.name}: ${exception.toString()}': 'plugin {{pluginname}}发生异常: {{exceptiontoString}}',
    'Plugin should be an object, but got "${typeof (plug)}"': 'Plugin应该是一个对象，当前是"{{typeofplug}}"',
    'Plugin must contain a "name" field and it must be a string': 'Plugin必须包含"name"字段，该字段必须是字符串',
    'Plugin must contain a "description" field and it must be a string': 'Plugin必须包含"description"字段，该字段必须是字符串',
    'Plugin must not contain a "functions" field': 'Plugin不能包含"functions"字段',
}