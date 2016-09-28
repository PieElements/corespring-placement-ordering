const _ = require('lodash');

exports.model = function(question, session, env) {

  console.debug('[state] question:', JSON.stringify(question, null, '  '));
  console.debug('[state] session:', JSON.stringify(session, null, '  '));
  console.debug('[state] env:', JSON.stringify(env, null, '  '));

  var lookup = _.identity;

  var base = _.assign({}, question.model);
  base.prompt = lookup(base.prompt);
  base.outcomes = [];

  if (env.mode !== 'gather') {
    base.disabled = true;
  }

  if (env.mode === 'evaluate') {
    base.outcomes = _.map(session.value, function(c, idx) {
      return {
        id: c,
        outcome: question.correctResponse[idx] === c ? 'correct' : 'incorrect'
      }
    });
    var allCorrect = _.isEqual(question.correctResponse, session.value);
    if (!allCorrect) {
      base.correctResponse = question.correctResponse;
    }
  }

  base.env = env;

  var map = {
    black_on_rose: 'black-on-rose',
    white_on_black: 'white-on-black',
    black_on_white: 'default'
  };

  if (env.accessibility && env.accessibility.colorContrast && map[env.accessibility.colorContrast]){
    base.className = map[env.accessibility.colorContrast];
  }

  console.debug('[state] return: ' + JSON.stringify(base, null, '  '));
  return base;
};