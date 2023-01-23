import React from "react";

const knownComponents: { [key: string]: EditableWidgetType<any> } = {};

export type EditablePropTypes<T = {}> = {
    [key in keyof Partial<T>]: 'bool';
};
export type EditableWidgetType<T = {}> = React.ComponentType<T> & {
    editablePropTypes: EditablePropTypes<T>;
};

export class WidgetDescriptor<T extends EditableWidgetType<any>> {
    public readonly componentType: EditableWidgetType<React.ComponentProps<T>>;
    public readonly props: React.ComponentProps<T>;

    constructor(componentType: EditableWidgetType<React.ComponentProps<T>>, props: Partial<React.ComponentProps<T>>) {
        this.componentType = componentType;
        const defaultProps = componentType.defaultProps;
        if(defaultProps == undefined) {
            this.props = props as React.ComponentProps<T>;
        } else {
            const asPartialIComplete = <P extends Partial<React.ComponentProps<T>>>(t: P) => t;
            this.props = { ...asPartialIComplete(defaultProps), ...asPartialIComplete(props) } as React.ComponentProps<T>;
        }
        knownComponents[componentType.name] = componentType;
    }

    public toJson(): string {
        return JSON.stringify({
            componentType: this.componentType.name,
            props: this.props,
        });
    }

    public static fromJson(json: string): WidgetDescriptor<any> {
        const obj = JSON.parse(json);
        const componentType = knownComponents[obj.componentType];
        const props = obj.props;
        return new WidgetDescriptor(componentType, props);
    }

    buildStartpart(): React.ReactElement<React.ComponentProps<T>> {
        return <this.componentType {...this.props}/>;
    }
}