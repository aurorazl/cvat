module.exports = {
    'Exception in plugin ${plugin.name}: ${exception.toString()}': 'Exception in plugin {{pluginname}}: {{exceptiontoString}}',
    'Plugin should be an object, but got "${typeof (plug)}"': 'Plugin should be an object, but got "{{typeofplug}}"',
    'Plugin must contain a "name" field and it must be a string': 'Plugin must contain a "name" field and it must be a string',
    'Plugin must contain a "description" field and it must be a string': 'Plugin must contain a "description" field and it must be a string',
    'Plugin must not contain a "functions" field': 'Plugin must not contain a "functions" field',
}