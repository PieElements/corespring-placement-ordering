import { maxScore, flattenCorrect, score } from '../src/scoring';
import _ from 'lodash';
import chai from 'chai';

const expect = chai.expect;

describe('flattenCorrect', () => {
  let correctResponseIds = ['c1', 'c2', 'c3', 'c4'];

  describe('correctResponse is an array of identifiers', () => {
    let question = {
      correctResponse: correctResponseIds
    };

    it('returns correctResponse field value', () => {
      expect(flattenCorrect(question)).to.eql(question.correctResponse);
    });

  });

  describe('correctResponse contains weight definitions', () => {
    let question = {
      correctResponse: correctResponseIds.map((id) => {
        return {
          id: id,
          weight: Math.random()
        };
      })
    }
    
    it('return correctResponse identifiers', () => {
      expect(flattenCorrect(question)).to.eql(correctResponseIds);
    });
  });

});

describe('score', () => {
  let correctResponse = ['c1', 'c2', 'c3', 'c4'];

  let baseQuestion = {
    correctResponse: correctResponse
  };

  describe('default scoring', () => {
    let question = _.cloneDeep(baseQuestion);
    
    describe('all correct', () => {
      let session = {
        value: _.cloneDeep(correctResponse)
      };

      it('should return 1', () => {
        expect(score(question, session)).to.eql(1);
      });

    });

    describe('some correct', () => {
      let session = {
        value: (() => {
          let response = _.cloneDeep(correctResponse);
          response[1] = undefined;
          return response;
        })()
      };

      it('should return 0', () => {
        expect(score(question, session)).to.eql(0);
      });
      
    });

    describe('none correct', () => {
      let session = {
        value: [null, null, null, null]
      };

      it('should return 0', () => {
        expect(score(question, session)).to.eql(0);
      });

    });
    
  });

  describe('partial scoring', () => {
    let question = _.merge(_.cloneDeep(baseQuestion), {
      partialScoring: [
        {
          correctCount: 1,
          weight: 0.2
        }
      ]
    });

    let weightFor = (count) => {
      return question.partialScoring.find(({correctCount}) => count === correctCount).weight;
    }

    describe('all correct', () => {
      let session = {
        value: _.cloneDeep(correctResponse)
      };

      it('should return 1', () => {
        expect(score(question, session)).to.eql(1);
      });

    });

    describe('some correct', () => {
      let numberCorrect = 1;

      let session = {
        value: (() => {
          let response = _.cloneDeep(correctResponse);
          for (var i = 0; i < response.length - numberCorrect; i++) {
            response[i] = undefined;
          }
          return response;
        })()
      };
      
      it('should return corresponding weight * maxScore', () => {
        expect(score(question, session)).to.eql(maxScore * weightFor(numberCorrect));
      });

    });

    describe('none correct', () => {
      let session = {
        value: [null, null, null, null]
      };

      it('should return 0', () => {
        expect(score(question, session)).to.eql(0);
      });

    });

  });
  
  describe('weighted scoring', () => {
    let question = _.merge(_.cloneDeep(baseQuestion), {
      correctResponse: correctResponse.map((value, id) => {
        return {
          id: value,
          weight: Math.random()
        };
      })
    });

    describe('some correct', () => {
      let session = {};
      
      function sessionForCorrect(correct) {
        return {
          value: correctResponse.map((id) => {
            return correct.includes(id) ? id : null
          })
        };
      }

      it ('should return the sum of weights for correct choices', () => {
        const correctChoices = ['c1', 'c3'];
        let session = sessionForCorrect(correctChoices);
        let expectedScore = correctChoices.map((choice) => {
          return question.correctResponse.find(({id}) => id === choice).weight;
        }).reduce((a, b) => a + b, 0);

        expect(score(question, session)).to.eql(expectedScore);
      });

    });

    describe('none correct', () => {
      let session = {
        value: [null, null, null, null]
      };

      it('should return 0', () => {
        expect(score(question, session)).to.eql(0);
      });

    });

  });

});