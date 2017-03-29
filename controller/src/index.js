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

  function getLabel(arr, lang, fallbackLang) {
    let label = arr.find(l => l.lang === lang);

    if (label && !_.isEmpty(label.value)) {
      return label.value;
    } else {
      let out = arr.find(l => l.lang === fallbackLang);
      if (!out) {
        console.warn(`can't find translation for: ${fallbackLang} in ${JSON.stringify(arr)}`);
      }
      return out && !_.isEmpty(out.value) ? out.value : undefined;
    }
  }

  var base = _.assign({}, _.cloneDeep(question.model));
  base.prompt = getLabel(base.prompt, env.locale, question.defaultLang);
  base.outcomes = [];
  base.choices = _.map(base.choices, (c) => {
    c.label = getLabel(c.label, env.locale, question.defaultLang);
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
