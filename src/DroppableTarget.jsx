import React, { Component, PropTypes } from 'react';
import { DropTarget as dropTarget } from 'react-dnd';

const choiceTarget = {
  drop(props, monitor, dropZone) {
    let draggedItem = monitor.getItem();
    props.onDropChoice(draggedItem.id, props.index, draggedItem.sourceId);
  },

  canDrop(props, monitor) {
    let draggedItem = monitor.getItem();
    return draggedItem.componentId == props.componentId;
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class DroppableTarget extends Component {
  render() {
    const { connectDropTarget, isOver } = this.props;
    let className = 'target ' + (isOver ? 'over' : '');
    return connectDropTarget(
      <div className={className}>
        {this.props.children}
      </div>
    );
  }
}

DroppableTarget.contextTypes = {
  store: PropTypes.object
};

DroppableTarget.propTypes = {
  isOver: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  targetId: PropTypes.string.isRequired,
  componentId: PropTypes.string.isRequired,
  onDropChoice: PropTypes.func
};

export default dropTarget('CHOICE', choiceTarget, collect)(DroppableTarget);