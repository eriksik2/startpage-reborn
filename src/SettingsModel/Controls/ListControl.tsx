import { BaseControl, BaseControlOptions } from 'SettingsModel/BaseControl';


type ListControlOptions<T> = {
    items: BaseControl<T>;
};

export class ListControl<T> extends BaseControl<T[]> {
    items: BaseControl<T>;

    constructor(label: string, options: ListControlOptions<T> & BaseControlOptions<T[]>) {
        super(label, { onChange: options.onChange });
        this.items = options.items;
    }

    render(value: T[]) {
        return (
            <div>
                {value.map((item, index) => {
                    const subcontrol = this.items;
                    const oldOnChange = subcontrol.onChange;
                    subcontrol.onChange = ((subValue: any) => {
                        oldOnChange?.(subValue);
                        const list = (this as unknown as T[]);
                        list[index] = subValue;
                        this.invokeOnChange(list);
                    }).bind(value);
                    return subcontrol.render((value as any)[index]);
                })}
            </div>
        );
    }
}