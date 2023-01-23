import React from "react";
import { WidgetDescriptor } from "startparts/WidgetDescriptor";


type WidgetSettingsEditProps = {
    data: WidgetDescriptor<any>,
    onChange: (data: WidgetDescriptor<any>) => void,
}

type WidgetSettingsEditState = {
}

export class WidgetSettingsEdit extends React.Component<WidgetSettingsEditProps, WidgetSettingsEditState> {
    constructor(props: WidgetSettingsEditProps) {
        super(props);
        this.state = {
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(prop: string, value: any) {
        const newProps = { ...this.props.data.props, [prop]: value };
        this.props.onChange(new WidgetDescriptor(this.props.data.componentType, newProps));
    }

    render() {
        return <div>
            {Object.entries(this.props.data.componentType.editablePropTypes).map((entry) => {
                const [prop, propType] = entry;
                if(propType == "bool") {
                    return <BoolPropEditor
                        key={prop}
                        value={this.props.data.props[prop]}
                        onChange={(value) => this.handleChange(prop, value)}
                        name={prop}
                    />
                } else {
                    return <div key={prop}>Unknown prop type: {propType}</div>
                }
            })}
        </div>
    }
}


type PropEditorProps<T> = {
    name: string,
    value: T,
    onChange: (value: T) => void,
}
class BoolPropEditor extends React.Component<PropEditorProps<boolean>> {
    render() {
        return <div>
            <label htmlFor={"propeditor"+this.props.name}>{this.props.name}</label>
            <input
                id={"propeditor"+this.props.name}
                type="checkbox"
                checked={this.props.value}
                onChange={(event) => this.props.onChange(event.target.checked)}/>
        </div>
    }
}