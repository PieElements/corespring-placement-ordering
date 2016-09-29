import Main from './main.jsx';
import React from 'react';
import {render} from 'react-dom';

var model = {
  prompt: "Pie Chart ",
  choices: [
    {
      id: 'c1',
      label: 'Apple'
    },
    {
      id: 'c2',
      label: 'Pear'
    },
    {
      id: 'c3',
      label: 'Orange'
    },
    {
      id: 'c4',
      label: 'Banana'
    }
  ]
};

var session = {
  value: [
    'c2', 'c1', 'c3'
  ]
};

var modelWithSession = _.extend(_.cloneDeep(model), {
  prompt: 'Pie Chart with Session'
});

var modelWithOutcomes = _.extend(_.cloneDeep(model), {
  prompt: 'Pie Chart with Outcomes',
  outcomes: [
    {
      id: 'c1',
      outcome: 'correct'
    },
    {
      id: 'c2',
      outcome: 'correct'
    },
    {
      id: 'c3',
      outcome: 'incorrect'
    },
    {
      id: 'c4',
      outcome: 'correct'
    }
  ],
  disabled: true
});
var modelWithOutcomesAndCorrectResponse = _.extend(_.cloneDeep(modelWithOutcomes), {
  prompt: 'Pie Chart with Outcomes and Correct Response',
  correctResponse: ['c3','c2','c4','c1']
});


render(
  <div>
    <Main model={modelWithOutcomesAndCorrectResponse} session={session} />
    <Main model={model} session={session} />
  </div>
  , document.getElementById('app'));