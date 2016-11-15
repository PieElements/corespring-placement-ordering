import React from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

describe('CorespringPlacementOrdering', () => {

  let wrapper;
  let sheet;
  let model, session;
  let CorespringPlacementOrdering;
  let CorespringShowCorrectAnswerToggle;

  let mkWrapper = (initialValue, msgs) => {

    return shallow(<CorespringPlacementOrdering
      model={model}
      session={session}
      sheet={sheet}/>, {
      context: {muiTheme: {palette: {}}}
    });
  };

  beforeEach(() => {
    sheet = {
      classes: {
        root: 'root',
        label: 'label'
      }
    };

    // CorespringShowCorrectAnswerToggle = proxyquire('corespring-show-correct-answer-toggle-react', {
    //   "!style!css!less!./index.less": {
    //     '@noCallThru': true
    //   }
    // }).CorespringShowCorrectAnswerToggle;

    CorespringPlacementOrdering = proxyquire('../src/corespring-placement-ordering', {
      'corespring-show-correct-answer-toggle-react': (props) => { type: 'div' }
    }).CorespringPlacementOrdering;

    wrapper = mkWrapper();
  });

  describe('render', () => {

    it('has an svg-holder', () => {
      let holder = wrapper.find('.svg-holder');
      console.log(holder);
      expect(holder).to.have.length(1);
    });

  });

});