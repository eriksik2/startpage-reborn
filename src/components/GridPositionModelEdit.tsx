import { GridPosition, GridPositionModel } from 'DataModel/GridPositionModel';
import { FractionalPosition, PositionModel } from 'DataModel/PositionModel';
import React from 'react';
import { WidgetDescriptor } from 'widgets/WidgetDescriptor';
import { FractionalPositioned } from './FractionalPositioned';

type GridPositionModelEditProps = {
    positionModel: GridPositionModel,
    onMoveWidget: (widget: WidgetDescriptor<any>, position: GridPosition) => void,
    onSelect?: (widget: WidgetDescriptor<any>) => void,
};

type GridPositionModelEditState = {
    activeDragData: {
        index: number,
        dragPixelOffset: { x: number, y: number },
        mouseClientOffset: { x: number, y: number },
    } | null,
    activeResizeData: {
        index: number,
        corner: "top-left" | "top-right" | "bottom-left" | "bottom-right",
        dragPixelOffset: { x: number, y: number },
        mouseClientOffset: { x: number, y: number },
    } | null,
};


export class GridPositionModelEdit extends React.Component<GridPositionModelEditProps, GridPositionModelEditState> {
    rootRef: React.RefObject<HTMLDivElement>;

    static defaultProps = {
        onMoveWidget: (widget: WidgetDescriptor<any>, position: FractionalPosition) => {},
        onSelect: (widget: WidgetDescriptor<any>) => {},
    };

    constructor(props: GridPositionModelEditProps) {
        super(props);
        this.state = {
            activeDragData: null,
            activeResizeData: null,
        };
        this.rootRef = React.createRef();
        this.onPositionModelUpdate = this.onPositionModelUpdate.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    componentDidMount(): void {
        this.props.positionModel.addListener(this.onPositionModelUpdate);
    }

    componentDidUpdate(prevProps: Readonly<GridPositionModelEditProps>, prevState: Readonly<GridPositionModelEditState>, snapshot?: any): void {
        if(prevProps.positionModel !== this.props.positionModel) {
            prevProps.positionModel.removeListener(this.onPositionModelUpdate);
            this.props.positionModel.addListener(this.onPositionModelUpdate);
        }
    }

    componentWillUnmount(): void {
        this.props.positionModel.removeListener(this.onPositionModelUpdate);
    }

    onPositionModelUpdate() {
        this.forceUpdate();
    }

    onClick(widget: WidgetDescriptor<any>, position: FractionalPosition, index: number) {
        const onSelect = this.props.onSelect!;
        onSelect(widget);
    }

    onDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        console.log("drop");
        const data = event.dataTransfer.getData("json/startpage-widget");
        if(data === null) return;
        const widget = WidgetDescriptor.fromJson(data);
        if(widget === null) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const position = {
            left: (event.clientX - rect.left) / rect.width,
            top: (event.clientY - rect.top) / rect.height,
            width: 1 / this.props.positionModel.num_cols,
            height: 1 / this.props.positionModel.num_rows,
        };
        this.props.positionModel.addWidget(widget, this.props.positionModel.fromFractionalPosition(position));
        this.props.onMoveWidget(widget, this.props.positionModel.fromFractionalPosition(position));
    }

    onDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    onDragEnter(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.preventDefault();
        const rootRect = this.rootRef.current!.getBoundingClientRect();

        if(this.state?.activeDragData !== null) {
            this.setState({
                activeDragData: {
                    ...this.state.activeDragData,
                    mouseClientOffset: { x: event.clientX - rootRect.left, y: event.clientY - rootRect.top },
                }
            });
        }
        if(this.state?.activeResizeData !== null) {
            this.setState({
                activeResizeData: {
                    ...this.state.activeResizeData,
                    mouseClientOffset: { x: event.clientX - rootRect.left, y: event.clientY - rootRect.top },
                }
            });
        }
    }

    onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>, widget: WidgetDescriptor<any>, position: FractionalPosition, index: number) {
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        const rootRect = this.rootRef.current!.getBoundingClientRect();
        
        const dragPixelOffset = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        this.setState({ activeDragData: {
            index: index,
            dragPixelOffset: dragPixelOffset,
            mouseClientOffset: { x: event.clientX - rootRect.left, y: event.clientY - rootRect.top },
        } });
    }

    onMouseDownResize(event: React.MouseEvent<HTMLDivElement, MouseEvent>, widget: WidgetDescriptor<any>, position: FractionalPosition, index: number, corner: "top-left" | "top-right" | "bottom-left" | "bottom-right") {
        const rect = event.currentTarget.getBoundingClientRect();
        const dragPixelOffset = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        this.setState({ activeResizeData: {
            index: index,
            corner: corner,
            dragPixelOffset: dragPixelOffset,
            mouseClientOffset: { x: event.clientX, y: event.clientY },
        } });
    }

    onMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if(this.state.activeDragData !== null) {
            const x = this.state.activeDragData.mouseClientOffset.x - this.state.activeDragData.dragPixelOffset.x;
            const y = this.state.activeDragData.mouseClientOffset.y - this.state.activeDragData.dragPixelOffset.y;
            const position = this.props.positionModel.toFractionalPosition(this.props.positionModel.widgets[this.state.activeDragData.index]!.position);
            const newPosition = this.props.positionModel.fromFractionalPosition({
                left: x / this.rootRef.current!.clientWidth,
                top: y / this.rootRef.current!.clientHeight,
                width: position.width,
                height: position.height,
            });
            this.props.positionModel.widgets[this.state.activeDragData.index]!.position = newPosition;
            this.setState({ activeDragData: null });
            this.props.onMoveWidget(this.props.positionModel.widgets[this.state.activeDragData.index]!.widget, newPosition);
        }
        if(this.state.activeResizeData !== null) {
            const x = this.state.activeResizeData.mouseClientOffset.x - this.state.activeResizeData.dragPixelOffset.x;
            const y = this.state.activeResizeData.mouseClientOffset.y - this.state.activeResizeData.dragPixelOffset.y;
            const position = this.props.positionModel.toFractionalPosition(this.props.positionModel.widgets[this.state.activeResizeData.index]!.position);
            const newPosition = this.props.positionModel.fromFractionalPosition({
                left: position.left,
                top: position.top,
                width: x / this.rootRef.current!.clientWidth - position.left,
                height: y / this.rootRef.current!.clientHeight - position.top,
            });
            this.props.positionModel.widgets[this.state.activeResizeData.index]!.position = newPosition;
            this.setState({ activeResizeData: null });
            this.props.onMoveWidget(this.props.positionModel.widgets[this.state.activeResizeData.index]!.widget, newPosition);
        }
    }

    renderPart(widget: WidgetDescriptor<any>, position: FractionalPosition, index: number) {
        const positionStyle: any = {
            left: position.left * 100 + "%",
            top: position.top * 100 + "%",
            width: position.width * 100 + "%",
            height: position.height * 100 + "%",
        };
        if(this.state.activeDragData !== null && this.state.activeDragData.index === index) {
            positionStyle.left = this.state.activeDragData.mouseClientOffset.x - this.state.activeDragData.dragPixelOffset.x;
            positionStyle.top = this.state.activeDragData.mouseClientOffset.y - this.state.activeDragData.dragPixelOffset.y;
        }
        return <div
            key={index}
            style={{
                position: "absolute",
                left: positionStyle.left,
                top: positionStyle.top,
                width: positionStyle.width,
                height: positionStyle.height,
            }}
        >
            <div
                onMouseDown={(e) => this.onMouseDown(e, widget, position, index)}
                onClick={(e) => this.onClick(widget, position, index)}
                className="w-full h-full absolute top-0 left-0"
                style={{background: "#a4bfff84"}}
            >
                {widget.buildWidget()}
            </div>
            <div className="w-full h-full absolute top-0 left-0 flex flex-col justify-between pointer-events-none">
                <div className="flex flex-row justify-between">
                    <div
                        className="w-4 h-4 border-t-4 border-l-4 border-slate-600 pointer-events-auto"
                        onMouseDown={(e) => this.onMouseDownResize(e, widget, position, index, "top-left")}
                    />
                    <div
                        className="w-4 h-4 border-t-4 border-r-4 border-slate-600 pointer-events-auto"
                        onMouseDown={(e) => this.onMouseDownResize(e, widget, position, index, "top-right")}
                    />
                </div>
                <div className="flex flex-row justify-between">
                    <div
                        className="w-4 h-4 border-b-4 border-l-4 border-slate-600 pointer-events-auto"
                        onMouseDown={(e) => this.onMouseDownResize(e, widget, position, index, "bottom-left")}
                    />
                    <div
                        className="w-4 h-4 border-b-4 border-r-4 border-slate-600 pointer-events-auto"
                        onMouseDown={(e) => this.onMouseDownResize(e, widget, position, index, "bottom-right")}
                    />
                </div>
            </div>
        </div>
    }

    getActiveDragData() {
        if(this.state.activeDragData !== null) {
            const x = this.state.activeDragData.mouseClientOffset.x - this.state.activeDragData.dragPixelOffset.x;
            const y = this.state.activeDragData.mouseClientOffset.y - this.state.activeDragData.dragPixelOffset.y;
            return {
                type: 'drag' as const,
                x: x / this.rootRef.current!.clientWidth,
                y: y / this.rootRef.current!.clientHeight,
                index: this.state.activeDragData.index,
            };
        }
        if(this.state.activeResizeData !== null) {
            const x = this.state.activeResizeData.mouseClientOffset.x - this.state.activeResizeData.dragPixelOffset.x;
            const y = this.state.activeResizeData.mouseClientOffset.y - this.state.activeResizeData.dragPixelOffset.y;
            return {
                type: 'resize' as const,
                x: x / this.rootRef.current!.clientWidth,
                y: y / this.rootRef.current!.clientHeight,
                index: this.state.activeResizeData.index,
            };
        }
        return null;
    }

    renderDragPreview() {
        const dragData = this.getActiveDragData();
        if(dragData === null) return null;
        const position = this.props.positionModel.toFractionalPosition(this.props.positionModel.widgets[dragData.index]!.position);
        let gridPosition = this.props.positionModel.fromFractionalPosition({
            left: dragData.x,
            top: dragData.y,
            width: position.width,
            height: position.height,
        });
        if(dragData.type === 'resize') {
            gridPosition = this.props.positionModel.fromFractionalPosition({
                left: position.left,
                top: position.top,
                width: dragData.x - position.left,
                height: dragData.y - position.top,
            });
        }
        return <FractionalPositioned
            className='bg-gray-200'
            fractionalPosition={this.props.positionModel.toFractionalPosition(gridPosition)}
        />;
    }

    render() {
        const cellHeightFraction = `${100 / this.props.positionModel.num_rows}%`;
        const cellWidthFraction = `${100 / this.props.positionModel.num_cols}%`;
        return (
            <div
                style={{
                    background: `linear-gradient(180deg, rgba(0,0,0,1) 0px, transparent 1px, transparent ${cellHeightFraction}),
                        repeating-linear-gradient(0deg, rgba(0,0,0,1) 0px, transparent 1px, transparent ${cellHeightFraction}),
                        linear-gradient(270deg, rgba(0,0,0,1) 0px, transparent 1px, transparent ${cellHeightFraction}),
                        repeating-linear-gradient(90deg, rgba(0,0,0,1) 0px, transparent 1px, transparent ${cellWidthFraction})`
                }}
                ref={this.rootRef}
                className="h-full w-full relative"
                onMouseUp={(e) => this.onMouseUp(e)}
                onMouseMove={(e) => this.onMouseMove(e)}
                onDrop={this.onDrop}
                onDragOver={this.onDragOver}
                onDragEnter={this.onDragEnter}
            >
                {this.renderDragPreview()}
                {this.props.positionModel.widgets.map((item, index) => this.renderPart(item.widget, this.props.positionModel.toFractionalPosition(item.position), index))}
            </div>
          );
    }

}