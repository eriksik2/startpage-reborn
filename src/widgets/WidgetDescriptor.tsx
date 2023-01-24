import React from "react";

const knownComponents: { [key: string]: EditableWidgetType<any> } = {};

export function instantiateEditableProp(prop: EditablePropType) {
    switch (prop.type) {
        case 'boolean':
            return false;
        case 'string':
            return "";
        case 'list':
            return [];
        case 'selection':
            return prop.options[0];
        case 'object':
            let obj: any = {};
            for (let key in prop.props) {
                obj[key] = instantiateEditableProp(prop.props[key]);
            }
            return obj;
    }
}

type EditablePropObjectType<T = any> = {
    type: 'object',
    props: EditablePropTypes<T>,
}
export function editableObject<T>(props: EditablePropTypes<T>, args?: EditablePropBase): EditablePropType {
    return {
        type: 'object',
        props: props,
        ...args,
    }
}

type EditablePropListType = {
    type: 'list',
    itemType: EditablePropType,
}
export const editableList = (itemType: EditablePropType, args?: EditablePropBase): EditablePropType => ({
    type: 'list',
    itemType: itemType,
    ...args,
})

type EditablePropStringType = {
    type: 'string',
    validator?: (value: string) => boolean,
}
export const editableString = (validator?: (value: string) => boolean, args?: EditablePropBase): EditablePropType => ({
    type: 'string',
    validator: validator,
    ...args,
})


type EditablePropSelectionType = {
    type: 'selection',
    options: string[],
}
export const editableSelection = (options: string[], args?: EditablePropBase): EditablePropType => ({
    type: 'selection',
    options: options,
    ...args,
})

type EditablePropBooleanType = {
    type: 'boolean',
}
export const editableBoolean = (args?: EditablePropBase): EditablePropType => ({
    type: 'boolean',
    ...args,
})

type EditablePropBase<T = any> = {
    category?: string,
    displayName?: string,
    showInSettings?: boolean | ((props: T) => boolean),
}

export type EditablePropType<T = any> =
    ( EditablePropBooleanType
    | EditablePropSelectionType
    | EditablePropStringType
    | EditablePropListType
    | EditablePropObjectType
    )
    & EditablePropBase<T>;

export type EditablePropTypes<T = {}> = {
    [key in keyof Partial<T>]: EditablePropType;
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

    buildWidget(): React.ReactElement<React.ComponentProps<T>> {
        return <this.componentType {...this.props}/>;
    }
}