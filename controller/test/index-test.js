import chai from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import shallowDeepEqual from 'chai-shallow-deep-equal';
import _ from 'lodash';

chai.use(shallowDeepEqual);

const expect = chai.expect;

var controller;

beforeEach(() => {
  controller = proxyquire('../src/index', {'lodash': {
    shuffle: function(args) {
      return [args[1], args[0]];
    }
  }});
});

describe('index', () => {

  let base = (o) => {
    o = _.merge({
      model: {
        prompt: 'hi',
        choices: []
      },
      correctResponse: []
    }, o);
    return o;
  };


  before(() => {
    console.debug = () => {
    } //console.log.bind(console);
  });

  describe('model', () => {

    let assertModel = (q, s, e, partialExpected) => {
      return (done) => {

        if (_.isFunction(partialExpected) && partialExpected.name === 'Error') {
          expect(() => controller.model(q, s, e)).to.throw(Error);
          done();
        } else {
          controller.model(q, s, e)
            .then(m => {

              if (_.isFunction(partialExpected)) {
                partialExpected(m);
              } else {
                expect(m).to.shallowDeepEqual(partialExpected);
              }
              done();
            })
            .catch(done);
        }
      }
    };

    it('throws an error for an empty model', assertModel({}, {}, {}, Error));
    it('returns prompt', assertModel(base(), {}, {}, {prompt: 'hi'}));
    it('returns empty config for mode=gather', assertModel(base(), {}, {mode: 'gather'}, {}));
    it('returns empty config for mode=view', assertModel(base(), {}, {mode: 'view'}, {disabled: true}));
    it('returns config.disabled=true for mode=evaluate', assertModel(base(), {}, {mode: 'evaluate'}, {disabled: true}));
    it('returns className for colorContrast:black_on_rose', assertModel(base(), {}, {accessibility: {colorContrast: 'black_on_rose'}}, {className: 'black-on-rose'}));
    it('returns className for colorContrast:white_on_black', assertModel(base(), {}, {accessibility: {colorContrast: 'white_on_black'}}, {className: 'white-on-black'}));
    it('returns className for colorContrast:black_on_white', assertModel(base(), {}, {accessibility: {colorContrast: 'black_on_white'}}, {className: 'default'}));
    it('returns env', assertModel(base(), {}, {env: true}, {env: {env: true}}));


    describe('choices and outcomes', () => {
      let model, session, env;

      model = base({
        correctResponse: ['a', 'b'],
        model: {
          choices: [
            {label: 'a', id: 'a'},
            {label: 'b', id: 'b'}
          ]
        }
      });
      session = {value: ['a', 'b']};
      env = {mode: 'evaluate'};

      it('choices', assertModel(model, {}, {}, {
        choices: [
          {label: 'a', id: 'a'},
          {label: 'b', id: 'b'}
        ]
      }));

      it('returns outcomes - 1 correct', assertModel(model, session, env, {
        outcomes: [{id: 'a', outcome: 'correct'}]
      }));


      it('does not return config.correctResponse - 1 correct', assertModel(model, session, env, {disabled: true}));

      it('returns outcomes - 2 incorrect', assertModel(model, {value: ['b', 'a']}, env, {
        outcomes: [
          {id: 'b', outcome: 'incorrect'},
          {id: 'a', outcome: 'incorrect'}]
      }));

      it('returns config.correctResponse - 2 - incorrect', assertModel(model, {value: ['b', 'a']}, env, {
        correctResponse: ['a']
      }));
    });

    describe('with translations', () => {
      let model = {
        correctResponse: ['a', 'b'],
        translations: {
          "default_locale": "en-US",
          "en-US": {
            PROMPT: 'hi',
            LABEL: 'Apple',
            A_FEEDBACK: 'Feedback'
          },
          "es-ES": {
            PROMPT: 'hola',
            LABEL: 'Ahoy',
            A_FEEDBACK: 'Fuego'
          }
        },
        model: {
          prompt: '$PROMPT',
          choices: [
            {label: '$LABEL', id: 'a'}
          ]
        }
      };

      let session = {};
      let env = {};

      it('looks up translations for prompt', assertModel(model, session, env, {prompt: 'hi'}));
      it('looks up translations for label', assertModel(model, session, env, {choices: [{label: 'Apple'}]}));
      it('looks up translations for prompt in spanish', assertModel(model, session, {locale: 'es-ES'}, {prompt: 'hola'}));
      it('looks up translations for label in spanish', assertModel(model, session, {locale: 'es-ES'}, {choices: [{label: 'Ahoy'}]}));
    });

    describe('shuffle', () => {
      let model = {
        correctResponse: ['a', 'b'],
        model: {
          prompt: "this is a prmopt",
          choices: [
            {label: 'one', id: '1', shuffle: false},
            {label: 'two', id: '2'},
            {label: 'three', id: '3'}
          ]
        },
        config: {
          shuffle: true
        }
      };

      let session = {};
      let env = {};

      it('does not shuffle choice marked "shuffle": false', (done) => {
        controller.model(model, session, env).then((result) => {
          expect(result.choices[0]).to.eql(model.model.choices[0]);
          done();
        }).catch(done);
      });

      it('shuffles choices not marked "shuffle": false', (done) => {
        controller.model(model, session, env).then((result) => {
          expect(result.choices[1]).to.eql(model.model.choices[2]);
          expect(result.choices[2]).to.eql(model.model.choices[1]);
          done();
        }).catch(done);
      });

    });

  });

  describe('outcome', () => {
    let outcome = (q, s, e, handler) => {
      return (done) => {
        controller.outcome(q, s, e)
          .then(o => {
            handler(o);
            done();
          })
          .catch(e => {
            handler(e);
            done();
          });
      }
    }

    it('returns an error if the question is null', outcome(null, {}, {}, (result) => {
      expect(result.message).to.eql('Question is missing required array: correctResponse');
    }));

    it('returns an error if the question.correctResponse', outcome({}, {}, {}, (result) => {
      expect(result.message).to.eql('Question is missing required array: correctResponse');
    }));

    it('returns an error if the question.correctResponse is empty', outcome({correctResponse: []}, {}, {}, (result) => {
      expect(result.message).to.eql('Question is missing required array: correctResponse');
    }));

    it('returns score.scaled: 1 for a correct response', outcome({
      correctResponse: ['a']
    }, {value: ['a']}, null, (result) => {
      expect(result).to.eql({
        score: {
          scaled: 1
        }
      })
    }));

    it('returns score.scaled: 0 for an incorrect response', outcome({
      correctResponse: ['a']
    }, {value: ['b']}, null, (result) => {
      expect(result).to.eql({
        score: {
          scaled: 0
        }
      })
    }));
  });
});