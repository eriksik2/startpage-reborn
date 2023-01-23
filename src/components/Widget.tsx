import React from "react";
import { WidgetDescriptor } from "widgets/WidgetDescriptor";

type WidgetProps = {
    data: WidgetDescriptor<any>,
}

type WidgetState = {
}

export class Widget extends React.Component<WidgetProps, WidgetState> {
    constructor(props: WidgetProps) {
        super(props);
        this.state = {
        };

        this.handleDragStart = this.handleDragStart.bind(this);
    }

    handleDragStart(event: React.DragEvent<HTMLDivElement>) {
        const text = this.props.data.toJson();
        event.dataTransfer.setData("text/plain", text);
    }

    render() {
        return <div draggable onDragStart={this.handleDragStart}>
            {this.props.data.buildWidget()}
        </div>
    }
}