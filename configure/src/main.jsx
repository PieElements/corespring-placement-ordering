import { blue500, green500, green700, grey400, grey500, red500 } from 'material-ui/styles/colors';

import Checkbox from 'material-ui/Checkbox';
import ChoiceConfig from './choice-config';
import Langs from './langs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MultiLangInput from './multi-lang-input';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import TextField from 'material-ui/TextField';
import getDndManager from 'corespring-placement-ordering/src/dnd-global-context';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./main.less');

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: grey400,
  }
});

class Main extends React.Component {

  constructor(props, context) {
    super(props, context);
    console.log('context: ', context);
    this.state = {
      activeLang: props.model.defaultLang,
      allMoveOnDrag: this._moveAllOnDrag()
    };
    console.log('test', this._moveAllOnDrag());
  }

  componentWillReceiveProps(props) {
    this.setState({
      allMoveOnDrag: this._moveAllOnDrag(props)
    });
  }

  _moveAllOnDrag(props) {
    props = props || this.props;
    return props.model.model.choices.find(({ moveOnDrag }) => moveOnDrag !== false) === undefined;
  }

  toggleAllOnDrag() {
    this.props.model.model.choices.forEach((choice) => choice.moveOnDrag = this.state.allMoveOnDrag);
    this.props.onChoicesChanged(this.props.model.model.choices);
  }

  onLabelChanged(choiceId, value, targetLang) {
    let translation = this.props.model.model.choices.find(({ id }) => id === choiceId).label.find(({ lang }) => lang === targetLang);
    translation.value = value;
    this.props.onChoicesChanged(this.props.model.model.choices);
  }

  onMoveOnDragChanged(choiceId, value) {
    let choice = this.props.model.model.choices.find(({ id }) => id === choiceId);
    choice.moveOnDrag = value;
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
      let ids = props.model.model.choices.map(({ id }) => id);
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
    let choiceForId = choiceId => {
      let choice = this.props.model.model.choices.find(({id}) => choiceId === id);
      return choice;
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
          <Checkbox label="Remove all tiles after placing" checked={this.state.allMoveOnDrag} onCheck={this.toggleAllOnDrag.bind(this)} />
          <ul className="choices-config-list">{
            this.props.model.correctResponse.map((response, index) => {
              let id = response instanceof Object ? response.id : response;
              let choice = choiceForId(id);
              return <ChoiceConfig
                moveChoice={this.moveChoice.bind(this)}
                index={index}
                onLabelChanged={this.onLabelChanged.bind(this, id)}
                onMoveOnDragChanged={this.onMoveOnDragChanged.bind(this, id)}
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

class MainWithContext extends React.Component {

  getChildContext() {
    return {
      dragDropManager: getDndManager()
    }
  }

  render() {
    return <Main {... this.props} />
  }
}


MainWithContext.childContextTypes = {
  dragDropManager: React.PropTypes.object.isRequired
}

export default MainWithContext;