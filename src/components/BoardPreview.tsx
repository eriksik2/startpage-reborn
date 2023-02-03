import { BoardModel } from 'DataModel/BoardModel';
import React from "react";
import ViewportAspectRatio from './ViewportAspectRatio';



type BoardPreviewProps = {
  boardModel?: BoardModel<any> | null,
  children?: React.ReactNode | React.ReactNode[],
};


export class BoardPreview extends React.Component<BoardPreviewProps> {
  static defaultProps = {
    boardModel: null,
    children: null,
  };

  rootRef: React.RefObject<HTMLDivElement>;

  constructor(props: BoardPreviewProps) {
    super(props);
    this.rootRef = React.createRef();

    this.onBoardModelUpdate = this.onBoardModelUpdate.bind(this);
  }

  onBoardModelUpdate() {
    this.forceUpdate();
}

rebindBoardModel(oldModel: BoardModel<any> | null, newModel: BoardModel<any> | null) {
    if (oldModel) {
        oldModel.removeListener(this.onBoardModelUpdate);
    }
    if (newModel) {
        newModel.addListener(this.onBoardModelUpdate);
    }
}

componentDidMount(): void {
    this.rebindBoardModel(null, this.props.boardModel ?? null);
}

componentDidUpdate(prevProps: Readonly<BoardPreviewProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (prevProps.boardModel !== this.props.boardModel) {
        this.rebindBoardModel(prevProps.boardModel ?? null, this.props.boardModel ?? null);
    }
}

componentWillUnmount(): void {
    this.rebindBoardModel(this.props.boardModel ?? null, null);
}

  renderPart(index: number) {
    if(this.props.boardModel === null) return null;
    const positionedWidget = this.props.boardModel!.widgets[index];
    if(positionedWidget === undefined) return null;
    const widget = positionedWidget.widget;
    const position = this.props.boardModel!.toFractionalPosition(positionedWidget.position);
    if(widget === undefined) return null;
    return <div
      key={index}
      className="bg-slate-200 rounded"
      style={{
        position: "absolute",
        left: position.left * 100 + "%",
        top: position.top * 100 + "%",
        width: position.width * 100 + "%",
        height: position.height * 100 + "%",
      }}
    >
        {widget.componentType.displayName}
    </div>
  }

  render() {
    return (
      <ViewportAspectRatio>
        <div
          className="h-full w-full relative"
          ref={this.rootRef}
        >
          {(this.props.boardModel?.widgets ?? []).map((item, index) => this.renderPart(index))}
          <div
            className="h-full w-full flex items-center justify-center"
          >
            {this.props.children}
          </div>
        </div>
      </ViewportAspectRatio>
    );
  }
}