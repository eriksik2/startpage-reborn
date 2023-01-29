import { BoardModel } from 'DataModel/BoardModel';
import React from "react";



type BoardDisplayProps = {
  boardModel: BoardModel<any>,
};

type BoardDisplayState = {
};

export class BoardDisplay extends React.Component<BoardDisplayProps, BoardDisplayState> {
  rootRef: React.RefObject<HTMLDivElement>;

  constructor(props: BoardDisplayProps) {
    super(props);
    this.rootRef = React.createRef();
  }

  renderPart(index: number) {
    const positionedWidget = this.props.boardModel.widgets[index];
    if(positionedWidget === undefined) return null;
    const widget = positionedWidget.widget;
    const position = this.props.boardModel.toFractionalPosition(positionedWidget.position);
    if(widget === undefined) return null;
    return <div
      key={index}
      style={{
        position: "absolute",
        left: position.left * 100 + "%",
        top: position.top * 100 + "%",
        width: position.width * 100 + "%",
        height: position.height * 100 + "%",
      }}
    >
        {widget.buildWidget()}
    </div>
  }

  render() {
    return (
      <div
        className="h-full w-full relative"
        ref={this.rootRef}
      >
        {this.props.boardModel.widgets.map((item, index) => this.renderPart(index))}
      </div>
    );
  }
}