import { FractionalPosition } from 'DataModel/BoardModel';
import React from 'react';


type FractionalPositionedProps = {
    fractionalPosition: FractionalPosition,
    children: React.ReactNode | React.ReactNode[],
} & React.HTMLAttributes<HTMLDivElement>;

export class FractionalPositioned extends React.Component<FractionalPositionedProps> {
    static defaultProps = {
        className: "",
        children: null,
    };

    render() {
        const divProps: any = { ...this.props };
        delete divProps.fractionalPosition;
        delete divProps.children;
        return (
            <div
                {...divProps}
                style={{
                    position: "absolute",
                    left: this.props.fractionalPosition.left * 100 + "%",
                    top: this.props.fractionalPosition.top * 100 + "%",
                    width: this.props.fractionalPosition.width * 100 + "%",
                    height: this.props.fractionalPosition.height * 100 + "%",
                }}
            >
                {this.props.children}
            </div>
        );
    }
}