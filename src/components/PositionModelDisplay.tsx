import { PositionModel } from 'DataModel/PositionModel';
import React from "react";



type PositionModelDisplayProps = {
  positionModel: PositionModel<any>,
};

type PositionModelDisplayState = {
};

export class PositionModelDisplay extends React.Component<PositionModelDisplayProps, PositionModelDisplayState> {
  rootRef: React.RefObject<HTMLDivElement>;

  constructor(props: PositionModelDisplayProps) {
    super(props);
    this.rootRef = React.createRef();
  }

  renderPart(index: number) {
    const positionedWidget = this.props.positionModel.widgets[index];
    if(positionedWidget === undefined) return null;
    const widget = positionedWidget.widget;
    const position = this.props.positionModel.toFractionalPosition(positionedWidget.position);
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
        {this.props.positionModel.widgets.map((item, index) => this.renderPart(index))}
      </div>
    );
  }
}