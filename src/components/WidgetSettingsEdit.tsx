import React from "react";
import { EditablePropType, EditablePropTypes, instantiateEditableProp, WidgetDescriptor } from "widgets/WidgetDescriptor";


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

    handleChange(value: any) {
        this.props.onChange(this.props.data);
    }

    render() {
        return <div>
            {Object.entries(this.props.data.componentType.editablePropTypes).map((entry) => {
                const [prop, propType] = entry;
                return <GenericPropEditor
                    key={prop}
                    data={this.props.data}
                    prop={propType}
                    onChange={this.handleChange}
                    loc={[{type: "deref", prop: prop}]}
                />
            })}
        </div>
    }
}

type GenericPropEditorPath = {
    type: "deref",
    prop: string,
} | {
    type: "index",
    index: number,
};
type GenericPropEditorProps = {
    data: WidgetDescriptor<any>,
    prop: EditablePropType,
    loc: GenericPropEditorPath[],
    onChange: (value: WidgetDescriptor<any>) => void,
}

class GenericPropEditor extends React.Component<GenericPropEditorProps> {

    handleChange(value: any) {
        let data: any = this.props.data.props;
        for(let i = 0; i < this.props.loc.length - 1; i++) {
            const step = this.props.loc[i];
            if(step.type == "deref") {
                data = data[step.prop];
            } else if(step.type == "index") {
                data = data[step.index];
            }
        }
        const lastStep = this.props.loc[this.props.loc.length - 1];
        if(lastStep.type == "deref") {
            data[lastStep.prop] = value;
        } else if(lastStep.type == "index") {
            data[lastStep.index] = value;
        }
        this.props.onChange(data);
    }

    handleListAdd() {
        const thisProp = this.props.prop;
        if(thisProp.type !== "list") return;
        let data: any = this.props.data.props;
        for(let i = 0; i < this.props.loc.length - 1; i++) {
            const step = this.props.loc[i];
            if(step.type == "deref") {
                data = data[step.prop];
            } else if(step.type == "index") {
                data = data[step.index];
            }
        }
        const lastStep = this.props.loc[this.props.loc.length - 1];
        if(lastStep.type == "deref") {
            data[lastStep.prop].push(instantiateEditableProp(thisProp.itemType));
        } else if(lastStep.type == "index") {
            data[lastStep.index].push(instantiateEditableProp(thisProp.itemType));
        }
        this.props.onChange(data);
    }

    handleListRemove(index: number) {
        const thisProp = this.props.prop;
        if(thisProp.type !== "list") return;
        let data: any = this.props.data.props;
        for(let i = 0; i < this.props.loc.length - 1; i++) {
            const step = this.props.loc[i];
            if(step.type == "deref") {
                data = data[step.prop];
            } else if(step.type == "index") {
                data = data[step.index];
            }
        }
        const lastStep = this.props.loc[this.props.loc.length - 1];
        if(lastStep.type == "deref") {
            data[lastStep.prop].splice(index, 1);
        } else if(lastStep.type == "index") {
            data[lastStep.index].splice(index, 1);
        }
        this.props.onChange(data);
    }

    getPropValue() {
        let data: any = this.props.data.props;
        for(let i = 0; i < this.props.loc.length; i++) {
            const step = this.props.loc[i];
            if(data == undefined) {
                return undefined;
            }
            if(step.type == "deref") {
                data = data[step.prop];
            } else if(step.type == "index") {
                data = data[step.index];
            }
        }
        return data;
    }

    getPath() {
        let path = "";
        for(let i = 0; i < this.props.loc.length; i++) {
            const step = this.props.loc[i];
            if(step.type == "deref") {
                path += "." + step.prop;
            } else if(step.type == "index") {
                path += "[" + step.index + "]";
            }
        }
        return path;
    }

    getName() {
        if(this.props.prop.displayName != undefined) {
            return this.props.prop.displayName;
        }
        const locTop = this.props.loc[this.props.loc.length - 1];
        if(locTop.type == "deref") {
            return locTop.prop;
        } else if(locTop.type == "index") {
            return `[${locTop.index.toString()}]`;
        }
        return "";
    }

    shouldShow() {
        const propType = this.props.prop;
        if(propType.showInSettings == false) return false;
        if(propType.showInSettings == undefined) return true;
        if(propType.showInSettings == true) return true;
        return propType.showInSettings(this.props.data.props);
    }

    render() {
        if(!this.shouldShow()) return null;
        const propType = this.props.prop;
        const prop = this.getPath();
        const name = this.getName();
        if(propType.type == "boolean") {
            return <BoolPropEditor
                key={prop}
                value={this.getPropValue()}
                onChange={(value) => this.handleChange(value)}
                name={name}
            />
        } else if(propType.type == "selection") {
            return <DropdownPropEditor
                key={prop}
                value={this.getPropValue()}
                onChange={(value) => this.handleChange(value)}
                name={name}
                options={propType.options}
            />
        } else if(propType.type == "string") {
            return <StringPropEditor
                key={prop}
                value={this.getPropValue()}
                onChange={(value) => this.handleChange(value)}
                name={name}
            />
        } else if(propType.type == "list") {
            return <div className="grow">
                <h1 className="mb-1">{name}</h1>
                {this.getPropValue().map((item: any, index: number) => {
                    return <div className="flex flex-row flex-nowrap items-start">
                        <button
                            className="bg-slate-500 hover:bg-slate-700 text-white font-bold w-6 h-6 rounded"
                            onClick={() => this.handleListRemove(index)}
                        >-</button>
                        <div className="w-2"></div>
                        <GenericPropEditor
                            key={prop}
                            data={this.props.data}
                            prop={propType.itemType}
                            loc={[...this.props.loc, { type: "index", index: index }]}
                            onChange={(value) => this.handleChange(value)}
                        />
                    </div>
                })}
                <button
                    className="bg-slate-500 hover:bg-slate-700 text-white font-bold w-6 h-6 rounded"
                    onClick={() => this.handleListAdd()}
                >+</button>
            </div>;
        } else if(propType.type == "object") {
            return <div className="grow">
                {Object.entries(propType.props).map((entry) => {
                    const [propName, newPropType] = entry;
                    return <GenericPropEditor
                        key={prop}
                        data={this.props.data}
                        prop={newPropType}
                        loc={[...this.props.loc, { type: "deref", prop: propName }]}
                        onChange={(value) => this.handleChange(value)}
                    />
                })}
            </div>;
        }
    }
}

type PropEditorProps<T> = {
    name: string,
    value: T,
    onChange: (value: T) => void,
}
class BoolPropEditor extends React.Component<PropEditorProps<boolean>> {
    render() {
        return <div className="flex flex-row flex-nowrap justify-between grow">
            <label htmlFor={"propeditor"+this.props.name}>{this.props.name}</label>
            <input
                id={"propeditor"+this.props.name}
                type="checkbox"
                checked={this.props.value}
                onChange={(event) => this.props.onChange(event.target.checked)}/>
        </div>
    }
}

type DropdownPropEditorProps = PropEditorProps<string> & {
    options: string[],
}

class DropdownPropEditor extends React.Component<DropdownPropEditorProps> {
    render() {
        return <div className="flex flex-row flex-nowrap justify-between grow">
            <label htmlFor={"propeditor"+this.props.name}>{this.props.name}</label>
            <select
                id={"propeditor"+this.props.name}
                value={this.props.value}
                onChange={(event) => this.props.onChange(event.target.value)}
            >
                {this.props.options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
        </div>
    }
}

type StringPropEditorProps = PropEditorProps<string> & {
    validator?: (value: string) => boolean,
}

class StringPropEditor extends React.Component<StringPropEditorProps> {
    render() {
        return <div className="flex flex-row flex-nowrap justify-between grow">
            <label htmlFor={"propeditor"+this.props.name}>{this.props.name}</label>
            <input
                className={`
                    mb-1 pl-1 rounded
                `}
                id={"propeditor"+this.props.name}
                type="text"
                value={this.props.value}
                onChange={(event) => this.props.onChange(event.target.value)}
            />
        </div>
    }
}
