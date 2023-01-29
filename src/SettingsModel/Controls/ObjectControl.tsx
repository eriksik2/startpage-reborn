import { BaseControl, BaseControlOptions } from 'SettingsModel/BaseControl';


type ObjectControlOptions<T> = {
    fields?: { [Property in keyof T]?: BaseControl<T[Property]> }
    customFields?: BaseControl<any>[];
};

export class ObjectControl<T> extends BaseControl<T> {
    fields: { [Property in keyof T]?: BaseControl<T[Property]> };
    customFields: BaseControl<any>[];

    constructor(label: string, options: ObjectControlOptions<T> & BaseControlOptions<T>) {
        super(label, { onChange: options.onChange });
        this.fields = options.fields ?? {};
        this.customFields = options.customFields ?? [];
    }

    render(value: T) {
        return (
            <div>
                {Object.entries(this.fields).map((entry, index) => {
                    const [key, subcontroluk] = entry;
                    const subcontrol = subcontroluk as BaseControl<any>;
                    const oldOnChange = subcontrol.onChange;
                    subcontrol.onChange = ((subValue: any) => {
                        oldOnChange?.(subValue);
                        this.invokeOnChange({ ...this, [key]: subValue } as T);
                    }).bind(value);
                    return subcontrol.render((value as any)[key]);
                })}
                {this.customFields.map((subcontrol, index) => {
                    return subcontrol.render(value);
                })}
            </div>
        );
    }
}