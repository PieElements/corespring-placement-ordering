import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { blue500, green500, green700, grey400, grey500, red500 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import ChoiceConfig from './choice-config';
import Langs from './langs';
import MultiLangInput from './multi-lang-input';
import RaisedButton from 'material-ui/RaisedButton';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';

require('./main.less');

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: grey400,
  }
});

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeLang: props.model.defaultLang
    };
  }

  onLabelChanged(choiceId, value, targetLang) {
    let translation = this.props.model.model.choices.find(({id}) => id === choiceId).label.find(({lang}) => lang === targetLang);
    translation.value = value;
    this.props.onChoicesChanged(this.props.model.model.choices);
  }

  moveChoice(dragIndex, hoverIndex) {
    const choices = this.props.model.correctResponse;
    const dragId = choices[dragIndex];
    choices.splice(dragIndex, 1);
    choices.splice(hoverIndex, 0, dragId);
    this.props.onCorrectResponseChanged(this.props.model.correctResponse);
  }

  onDeleteChoice(choice) {
    let { id } = choice;
    this.props.model.model.choices = this.props.model.model.choices.filter((choice) => {
      return choice.id !== id;
    });
    this.props.model.correctResponse = this.props.model.correctResponse.filter((choiceId) => { return id !== choiceId; });
    this.props.onChoicesChanged(this.props.model.model.choices);
    this.props.onCorrectResponseChanged(this.props.model.correctResponse);
  }

  onAddChoice() {
    function findFreeChoiceSlot(props) {
      let slot = 1;
      let ids = props.model.model.choices.map(({id}) => id);
      while (ids.includes(`c${slot}`)) {
        slot++;
      }
      return slot;
    }
    let id = `c${findFreeChoiceSlot(this.props)}`;
    this.props.model.model.choices.push({
      id: id,
      label: [{ lang: this.state.activeLang, value: '' }],
    });
    this.props.model.correctResponse.push(id);
    this.props.onChoicesChanged(this.props.model.model.choices);
    this.props.onCorrectResponseChanged(this.props.model.correctResponse);
  }

  render() {
    let choiceForId = id => {
      return this.props.model.model.choices.find((choice) => {
        return choice.id === id;
      });
    };
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="corespring-placement-ordering-configure-root">
          <p>In Ordering, a student is asked to sequence events or inputs in a specific order.</p>
          <p>After setting up the choices, drag and drop them into the correct order. Students will see a shuffled version of the choices.</p>
          <h2>Choices</h2>
          <p>Add a label to choice area</p>
          <div className="language-controls">
            <Langs
              label="Choose language to edit"
              langs={this.props.model.langs}
              selected={this.state.activeLang}
              onChange={(e, index, l) => this.setState({ activeLang: l })} />
            <Langs
              label="Default language"
              langs={this.props.model.langs}
              selected={this.props.model.defaultLang}
              onChange={(e, index, l) => this.props.onDefaultLangChanged(l)} />
          </div>
          <MultiLangInput
            textFieldLabel="Prompt"
            value={this.props.model.model.prompt}
            lang={this.state.activeLang}
            onChange={this.onPromptChanged} />
          <ul className="choices-config-list">{
            this.props.model.correctResponse.map((id, index) => {
              let choice = choiceForId(id);
              return <ChoiceConfig 
                moveChoice={this.moveChoice.bind(this)}
                index={index}
                onLabelChanged={this.onLabelChanged.bind(this, id)} 
                onDelete={this.onDeleteChoice.bind(this, choice)}
                activeLang={this.state.activeLang} 
                key={index} 
                choice={choice} />;
            })
          }</ul>
          <RaisedButton label="Add a choice" onClick={this.onAddChoice.bind(this)} />
        </div>
      </MuiThemeProvider>
    )
  }

}

export default Main;