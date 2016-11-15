import React from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

describe('CorespringPlacementOrdering', () => {

  let wrapper;
  let toggle;
  let sheet;
  let model, session;
  let CorespringPlacementOrdering;
  let CorespringShowCorrectAnswerToggle;

  let mkWrapper = (initialValue, msgs) => {
    //Note: I removed muiTheme - I can't see it in use in the component
    return shallow(<CorespringPlacementOrdering model={model} session={session} />, { });
  };

  beforeEach(() => {

    let toggle = (props) => {
      return <div>mocked-toggle</div>;
    }

    toggle['@noCallThru'] = true;

    CorespringPlacementOrdering = proxyquire('../src/corespring-placement-ordering', {
      'corespring-show-correct-answer-toggle-react': toggle 
    }).CorespringPlacementOrdering

    model = {
      choices: []
    }

    wrapper = mkWrapper();
  });

  describe('render', () => {

    it('has an corespring-placement-ordering class', () => {
      console.log(wrapper.debug());
      let holder = wrapper.find('.corespring-placement-ordering');
      expect(holder).to.have.length(1);
      //or: 
      expect(wrapper.hasClass('corespring-placement-ordering')).to.eql(true);
    });

  });

});