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
      order: _.isEmpty(props.session.value) ? [] : props.session.value,
      showingCorrect: false
    };
    this.componentId = _.uniqueId();
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
    this.props.session.value = this.state.order;
  }

  onDragInvalid(choiceId, index) {
    this.state.order[index] = null;
    this.setState({order: this.state.order});
    this.props.session.value = this.state.order;
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
          componentId={this.componentId}
          disabled={this.props.model.disabled}
        ></DraggableChoice>;
      }
    );

    const targets = this.props.model.choices.map(
      (val, idx) => {
        let targetClass = 'target ';
        let choiceId = this.state.showingCorrect ? this.props.model.correctResponse[idx] : this.state.order[idx];
        let choice = _.find(this.props.model.choices, (c) => {
          return c.id === choiceId
        });
        let outcome = this.state.showingCorrect ? {outcome: 'correct'} : (_.find(this.props.model.outcomes, (c) => { return c.id === choiceId }) || {});
        let maybeChoice = choice ? <DraggableChoice
          disabled={this.props.model.disabled}
          text={choice.label}
          key={idx}
          index={idx}
          choiceId={choiceId}
          outcome={outcome.outcome}
          componentId={this.componentId}
          onDragInvalid={this.onDragInvalid.bind(this)}
        ></DraggableChoice> : <div className="choice placeholder" key={idx} />;

        return <DroppableTarget
          key={idx}
          index={idx}
          targetId={val.id}
          componentId={this.componentId}
          onDropChoice={this.onDropChoice.bind(this)}
        >
          {maybeChoice}
        </DroppableTarget>;
      }
    );


    const toggler = this.props.model.correctResponse ? <CorespringShowCorrectAnswerToggle initialValue={false} onToggle={this.toggleCorrect.bind(this)}/> : null;
    const className = "corespring-placement-ordering " + _.get(this, 'props.model.env.mode');

    let maybeChoices = this.props.model.correctResponse ? null : <td className="choice-column">
      {choices}
    </td>;

    let answerTable = (className, key = 1) => {
      return <div className={className} key={key}>
        <table className="choices-and-targets-table">
          <tbody>
            <tr>
              {maybeChoices}
              <td>
                {targets}
              </td>
            </tr>
          </tbody>
        </table>

      </div>;
    };

    const maybeMyAnswer = this.state.showingCorrect ? '' : answerTable('choices-wrapper', 1);

    const correctAnswer = this.state.showingCorrect ? answerTable('choices-wrapper', 2) : '';

    return (
      <div className={className}>

        <div className="prompt">{this.props.model.prompt}</div>

        {toggler}

        <div className="choices-container">
          {answerTable('place-holder-choices')}

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