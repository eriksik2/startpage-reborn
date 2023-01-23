import React from "react";


export class StartpartDescriptor<T extends React.ComponentType<any>> {
    public readonly componentType: React.ComponentType<React.ComponentProps<T>>;
    public readonly props: React.ComponentProps<T>;

    constructor(componentType: React.ComponentType<React.ComponentProps<T>>, props: Partial<React.ComponentProps<T>>) {
        this.componentType = componentType;
        const defaultProps = componentType.defaultProps;
        if(defaultProps == undefined) {
            this.props = props as React.ComponentProps<T>;
        } else {
            const asPartialIComplete = <P extends Partial<React.ComponentProps<T>>>(t: P) => t;
            this.props = { ...asPartialIComplete(defaultProps), ...asPartialIComplete(props) } as React.ComponentProps<T>;
        }
    }

    buildStartpart(): React.ReactElement {
        return React.createElement<React.ComponentProps<T>>(this.componentType, this.props);
    }
}