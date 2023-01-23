import React from "react";
import { WidgetDescriptor } from "startparts/WidgetDescriptor";

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
    }

    handleDragStart(event: React.DragEvent<HTMLDivElement>) {
        event.dataTransfer.setData("text/plain", this.props.data.toJson());
    }

    render() {
        return <div draggable>
            {this.props.data.buildStartpart()}
        </div>
    }
}