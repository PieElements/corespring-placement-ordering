import React, { Component, PropTypes } from 'react';
import { DragSource as dragSource } from 'react-dnd';


const choiceSource = {
  beginDrag(props) {
    return {
      id: props.choiceId,
      index: props.index,
      componentId: props.componentId
    };
  },

  canDrag(props) {
    return !props.disabled;
  },

  endDrag(props, monitor) {
    if (props.onDragInvalid && !monitor.didDrop()) {
      props.onDragInvalid(props.choiceId, props.index);
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class DraggableChoice extends Component {
  render() {
    const { connectDragSource, isDragging, text } = this.props;
    let className = "choice " + (isDragging ? 'dragging' : '') + (this.props.outcome || '');
    return connectDragSource(
      <div className={className} disabled={this.props.disabled}><div className="content">{text}</div></div>
    );
  }
}

DraggableChoice.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  index: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  outcome: PropTypes.string,
  choiceId: PropTypes.string.isRequired,
  componentId: PropTypes.string.isRequired,
  onDragInvalid: PropTypes.func
};

export default dragSource('CHOICE', choiceSource, collect)(DraggableChoice);