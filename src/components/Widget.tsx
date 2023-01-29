import React from "react";
import { WidgetDescriptor } from "widgets/WidgetDescriptor";

type WidgetProps = {
    data: WidgetDescriptor<any>,
}

type WidgetState = {
}

export class WidgetPreview extends React.Component<WidgetProps, WidgetState> {
    constructor(props: WidgetProps) {
        super(props);
        this.state = {
        };

        this.handleDragStart = this.handleDragStart.bind(this);
    }

    handleDragStart(event: React.DragEvent<HTMLDivElement>) {
        const text = this.props.data.toJson();
        event.dataTransfer.setData("json/startpage-widget", text);
    }

    render() {
        return <div
            draggable
            onDragStart={this.handleDragStart}
            className="p-2 border border-gray-300 m-2 bg-white"
        >
            {this.props.data.buildWidget()}
        </div>
    }
}