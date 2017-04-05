import React from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import MultiLangInput from './multi-lang-input';
import { DragSource as dragSource } from 'react-dnd';

const choiceSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
}

const choiceTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) {
      return;
    }
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    props.moveChoice(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
}

class ChoiceConfig extends React.Component {

  constructor(props) {
    super(props);
  }

  onLabelChanged(value, lang) {
    this.props.onLabelChanged(value, lang);
  }

  onMoveOnDragChanged(event, value) {
    this.props.onMoveOnDragChanged(!value);
  }

  render() {
    const { choice, connectDragSource, connectDropTarget, isDragging } = this.props;
    const opacity = isDragging ? 0 : 1;
    console.log(choice);
    return connectDragSource(connectDropTarget(<li className="choice-config" style={{opacity: opacity}}>
      <MultiLangInput
        style={{display: 'inline-block'}}
        placeholder="Enter a choice"
        value={choice.label}
        lang={this.props.activeLang}
        onChange={this.onLabelChanged.bind(this)} />
      <IconButton style={{flex: 1}} onClick={this.props.onDelete.bind(this)}><ActionDelete/></IconButton>
      <Checkbox label="Remove tile after placing" checked={choice.moveOnDrag === false} onCheck={this.onMoveOnDragChanged.bind(this)}/>
    </li>));
  }

}

export default DropTarget('CHOICECONFIG', choiceTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(DragSource('CHOICECONFIG', choiceSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(ChoiceConfig));