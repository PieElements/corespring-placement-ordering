import React from 'react';
import _ from 'lodash';
import CorespringShowCorrectAnswerToggle from 'corespring-show-correct-answer-toggle-react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import DraggableChoice from './DraggableChoice.jsx'
import DroppableTarget from './DroppableTarget.jsx'
import { DragDropContext as ddContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class CorespringPlacementOrdering extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      order: _.isEmpty(props.session.value) ? _.map(props.model.choices, 'id') : props.session.value,
      showingCorrect: false
    };
  }

  toggleCorrect(val) {
    this.setState({showingCorrect: val});
  }

  onDropChoice(choiceId,index) {
    this.state.order[index] = choiceId;
    for (var i = 0; i < this.state.order.length; i++) {
      if (i !== index && this.state.order[i] === choiceId) {
        this.state.order[i] = null;
      }
    }
    this.setState({order: this.state.order});
  }

  onDragInvalid(choiceId, index) {
    console.log("Invalid",choiceId,index);
    this.state.order[index] = null;
    this.setState({order: this.state.order});
  }

  render() {

    const choices = this.props.model.choices.map(
      (choice, idx) => {
        let isDroppedAlready = _.find(this.state.order, (t) => { return t === choice.id; });
        const placeholder = <div className="choice placeholder" key={idx} />;
        return isDroppedAlready ? placeholder : <DraggableChoice
          text={choice.label}
          key={idx}
          index={idx}
          choiceId={choice.id}
        ></DraggableChoice>;
      }
    );

    const targets = this.props.model.choices.map(
      (val, idx) => {
        let targetClass = 'target ';
        let choiceId = this.state.order[idx];
        let choice = _.find(this.props.model.choices, (c) => {
          return c.id === choiceId
        });
        let maybeChoice = choice ? <DraggableChoice
          text={choice.label}
          key={idx}
          index={idx}
          choiceId={choiceId}
          onDragInvalid={this.onDragInvalid.bind(this)}
        ></DraggableChoice> : <div className="choice placeholder" key={idx} />;

        return <DroppableTarget
          key={idx}
          index={idx}
          targetId={val.id}
          onDropChoice={this.onDropChoice.bind(this)}
        >
          {maybeChoice}
        </DroppableTarget>;
      }
    );

    const toggler = this.props.model.correctResponse ? <CorespringShowCorrectAnswerToggle initialValue={false} onToggle={this.toggleCorrect.bind(this)}/> : null;
    const className = "corespring-placement-ordering " //+ this.props.model.env.mode;
    let myAnswer = (className) => {
      return <div className={className} key={1}>
        <table>
          <tbody>
            <tr>
              <td>
                <ul>{choices}</ul>
              </td>
              <td>
                <ul>{targets}</ul>
              </td>
            </tr>
          </tbody>
        </table>

      </div>;
    };
    const maybeMyAnswer = this.state.showingCorrect ? '' : myAnswer('choices-wrapper');

    const correctAnswer = this.state.showingCorrect ? <div className="choices-wrapper" key={2}>
        {choices}
    </div> : '';

    return (
      <div className={className}>
        {toggler}
        <div className="choices-container">
          {myAnswer('place-holder-choices')}

          <ReactCSSTransitionGroup
            transitionName="choice-holder-transition"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>

            {maybeMyAnswer}
            {correctAnswer}

          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

CorespringPlacementOrdering.propTypes = {
  model: React.PropTypes.object,
  session: React.PropTypes.object
};

CorespringPlacementOrdering.defaultProps = {
  session: {
    value: []
  }
};

export default ddContext(HTML5Backend)(CorespringPlacementOrdering);