import React from "react";


export class WidgetDescriptor<T extends React.ComponentType<any>> {
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

    public toJson(): string {
        return JSON.stringify({
            componentType: this.componentType.name,
            props: this.props,
        });
    }

    public static fromJson(json: string): WidgetDescriptor<any> {
        const obj = JSON.parse(json);
        const componentType = obj.componentType;
        const props = obj.props;
        return new WidgetDescriptor(componentType, props);
    }

    buildStartpart(): React.ReactElement {
        return React.createElement<React.ComponentProps<T>>(this.componentType, this.props);
    }
}