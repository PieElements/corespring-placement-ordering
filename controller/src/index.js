import _ from 'lodash';


export function outcome(question, session, env) {

  session.value = session.value || [];
  return new Promise((resolve, reject) => {
    if (!question || !question.correctResponse || _.isEmpty(question.correctResponse)) {
      reject(new Error('Question is missing required array: correctResponse'));
    } else {
      const allCorrect = _.isEqual(_.cloneDeep(session.value).sort(), _.cloneDeep(question.correctResponse).sort());
      resolve({
        score: {
          scaled: allCorrect ? 1 : 0
        }
      });
    }
  });

}

export function model(question, session, env) {
  console.log('[state] question:', JSON.stringify(question, null, '  '));
  console.log('[state] session:', JSON.stringify(session, null, '  '));
  console.log('[state] env:', JSON.stringify(env, null, '  '));

  function lookup(value) {
    var localeKey = env.locale || (question.translations || {}).default_locale || 'en_US';
    var map = ((question.translations || {})[localeKey] || {});
    if (value.indexOf('$') === 0) {
      var key = value.substring(1);
      var out = map[key];
      if (!out) {
        console.warn('not able to find translation for: ' + key);
      }
      return out || value;
    } else {
      return value;
    }
  }

  var base = _.assign({}, _.cloneDeep(question.model));
  base.prompt = lookup(base.prompt);
  base.outcomes = [];
  base.choices = _.map(base.choices, (c) => {
    c.label = lookup(c.label);
    return c;
  });

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

  console.log('[state] return: ' + JSON.stringify(base, null, '  '));
  return Promise.resolve(base);
}
