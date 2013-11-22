var fs = require('fs');

var removeIndention = function(line) {
  // TODO: To do this correctly we need to know the scope of the context, or hold a
  // prev indation count.
  return line;
};

var buildContext = function(ln, lines) {
  var context = '';
  if (ln - 1 >= 0) context += lines[ln-1] + '\n';
  context += lines[ln] + '\n';
  if (ln + 1 < lines.length) context += lines[ln+1];
  return context;
};

module.exports = function(content) {
  var todos = [];
  var lines = content.split('\n');
  var linesWithTodo = [];
  var todo = [], continued = '';

  for (var i=0; i<lines.length; i++) {
    todo = lines[i].match(/(?:\/\/|\*) TODO(?:\:|)(.+)/);

    if (linesWithTodo.indexOf(i-1) > -1) {
      continued = lines[i].match(/\/\/(.+)/);
      if (continued) {
        todos[todos.length-1].todo += continued[1];
        todos[todos.length-1].continued = true;
      }
    }

    if (todo) {
      linesWithTodo.push(i);
      todos.push({
        text: todo[0].trim(),
        todo: todo[1].trim(),
        ln: i+1,
        context: buildContext(i, lines)
      });
    }
  }

  return todos;
};
