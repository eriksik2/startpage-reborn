
import React from 'react';

type ResizableColumnsProps = {
    children: React.ReactNode | React.ReactNode[];
    separator: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

type ResizableColumnsState = {
    lastWidthsForNumberOfChildren: Map<number, number[]>;
    widths: number[];
    activeDragData: {
        index: number,
        startX: number,
    } | null;
}

export default class ResizableColumns extends React.Component<ResizableColumnsProps, ResizableColumnsState> {
    static defaultProps = {
        children: null,
        separator: <div
            className="w-2 bg-slate-400"
        >

        </div>,
    };

    rootRef: React.RefObject<HTMLDivElement>;

    constructor(props: ResizableColumnsProps) {
        super(props);

        this.state = {
            lastWidthsForNumberOfChildren: new Map(),
            widths: [],
            activeDragData: null,
        }

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.rootRef = React.createRef();
    }

    componentDidMount(): void {
        this.recalculateWidths();
    }

    componentDidUpdate(prevProps: Readonly<ResizableColumnsProps>, prevState: Readonly<ResizableColumnsState>, snapshot?: any): void {
        if(prevProps.children !== this.props.children) {
            this.recalculateWidths(prevProps, prevState);
        }
    }

    recalculateWidths(prevProps?: Readonly<ResizableColumnsProps>, prevState?: Readonly<ResizableColumnsState>): void {
        if(prevProps != null && prevState != null) {
            const prevChildren = React.Children.toArray(prevProps.children);
            this.setState({
                lastWidthsForNumberOfChildren: this.state.lastWidthsForNumberOfChildren.set(prevChildren.length, prevState.widths),
            });
        }
        const children = React.Children.toArray(this.props.children);
        const lastWidths = this.state.lastWidthsForNumberOfChildren.get(children.length);
        if(lastWidths != null) {
            this.setState({
                widths: lastWidths,
            });
            
            return;
        }
        const widths = React.Children.map(children, (child) => 1 / children.length);
        if(widths == null) {
            this.setState({
                widths: [],
            });
            return;
        }
        widths[widths.length - 1] = 1 - widths.slice(0, widths.length - 1).reduce((a, b) => a + b, 0);
        this.setState({
            lastWidthsForNumberOfChildren: this.state.lastWidthsForNumberOfChildren.set(children.length, widths),
            widths: widths,
        });
    }

    handleMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) {
        const localX = event.clientX - this.rootRef.current!.getBoundingClientRect().left;
        this.setState({
            activeDragData: {
                index: index,
                startX: localX,
            }
        });
    }

    handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if(this.state.activeDragData == null) return;
        const widths = this.state.widths.slice();
        const localX = event.clientX - this.rootRef.current!.getBoundingClientRect().left;
        const localPercent = localX / this.rootRef.current!.getBoundingClientRect().width;
        const newPercentForIndex = localPercent - widths.slice(0, this.state.activeDragData.index).reduce((a, b) => a + b, 0);
        const newPercentForNextIndex = 1 - newPercentForIndex;
        widths[this.state.activeDragData.index] = newPercentForIndex;
        widths[this.state.activeDragData.index + 1] = newPercentForNextIndex;
        this.setState({
            widths: widths,
        });
    }

    handleMouseUp() {
        this.setState({
            activeDragData: null,
        });
    }


    public render() {
        const divProps: any = { ...this.props };
        delete divProps.children;
        delete divProps.separator;
        divProps.className = (divProps.className ?? "") + " flex flex-row items-stretch";
        const oldOnMouseMove = divProps.onMouseMove;
        divProps.onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            this.handleMouseMove(event);
            if(oldOnMouseMove != null) oldOnMouseMove(event);
        };
        const oldOnMouseUp = divProps.onMouseUp;
        divProps.onMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            this.handleMouseUp();
            if(oldOnMouseUp != null) oldOnMouseUp(event);
        };

        const children = React.Children.toArray(this.props.children);
        return (
            <div
                ref={this.rootRef}
                {...divProps}
            >
                {React.Children.map(children, (child, index) => {
                    return <>
                        <div
                            style={{
                                width: this.state.widths[index]! * 100 + "%",
                            }}
                        >
                            {child}
                        </div>
                        {index < children.length - 1
                            ? <div
                                className="flex flex-row items-stretch"
                                onMouseDown={(event) => this.handleMouseDown(event, index)}
                            >
                                {this.props.separator}
                            </div>
                            : null
                        }
                    </>
                })}
            </div>
        );
    }
}
