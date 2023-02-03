
import React from 'react';

type ResizablePanelsProps = {
    direction?: 'horizontal' | 'vertical';
    separator?: React.ReactNode;
    separatorWidth?: string;
    children: React.ReactNode | React.ReactNode[];
};

type ResizablePanelsState = {
    lastWidthsForNumberOfChildren: Map<number, number[]>;
    widths: number[];
    activeDragData: {
        index: number,
        startXY: number,
    } | null;
}

export default class ResizablePanels extends React.Component<ResizablePanelsProps, ResizablePanelsState> {
    static defaultProps = {
        direction: 'horizontal',
        separator: <div
            className="w-full h-full bg-slate-400"
        />,
        separatorWidth: "0.5rem",
        children: null,
    };

    rootRef: React.RefObject<HTMLDivElement>;

    constructor(props: ResizablePanelsProps) {
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

    componentDidUpdate(prevProps: Readonly<ResizablePanelsProps>, prevState: Readonly<ResizablePanelsState>, snapshot?: any): void {
        if(prevProps.children !== this.props.children) {
            this.recalculateWidths(prevProps, prevState);
        }
    }

    recalculateWidths(prevProps?: Readonly<ResizablePanelsProps>, prevState?: Readonly<ResizablePanelsState>): void {
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
        const localXY = this.props.direction === 'horizontal'
            ? event.clientX - this.rootRef.current!.getBoundingClientRect().left
            : event.clientY - this.rootRef.current!.getBoundingClientRect().top;
        this.setState({
            activeDragData: {
                index: index,
                startXY: localXY,
            }
        });
    }

    handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if(this.state.activeDragData == null) return;
        const widths = this.state.widths.slice();
        const localXY = this.props.direction === 'horizontal'
            ? event.clientX - this.rootRef.current!.getBoundingClientRect().left
            : event.clientY - this.rootRef.current!.getBoundingClientRect().top;

        const localPercent = this.props.direction === 'horizontal'
            ? localXY / this.rootRef.current!.getBoundingClientRect().width
            : localXY / this.rootRef.current!.getBoundingClientRect().height;

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

        const children = React.Children.toArray(this.props.children);
        return (
            <div
                ref={this.rootRef}
                className="w-full h-full flex items-stretch"
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
                style={{
                    flexDirection: this.props.direction === 'horizontal' ? 'row' : 'column',
                }}
            >
                {React.Children.map(children, (child, index) => {
                    return <>
                        <div
                            style={{
                                width: this.props.direction === 'horizontal' ? this.state.widths[index]! * 100 + "%" : '100%',
                                height: this.props.direction === 'horizontal' ? '100%' : this.state.widths[index]! * 100 + "%",
                            }}
                        >
                            {child}
                        </div>
                        {index < children.length - 1
                            ? <div
                                className="flex flex-row items-stretch"
                                onMouseDown={(event) => this.handleMouseDown(event, index)}
                            >
                                <div
                                    style={{
                                        width: this.props.direction === 'horizontal' ? this.props.separatorWidth : '100%',
                                        height: this.props.direction === 'horizontal' ? '100%' : this.props.separatorWidth,
                                    }}
                                >
                                    {this.props.separator}
                                </div>
                            </div>
                            : null
                        }
                    </>
                })}
            </div>
        );
    }
}
