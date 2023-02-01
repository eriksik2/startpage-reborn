import { BaseControl, BaseControlOptions } from 'SettingsModel/BaseControl';


type NumberControlOptions = {
    validator?: (value: number) => boolean;
};

export class NumberControl extends BaseControl<number> {
    validator: (value: number) => boolean;

    constructor(label: string, options: NumberControlOptions & BaseControlOptions<number>) {
        super(label, { onChange: options.onChange });
        this.validator = options.validator ?? (() => true);
    }

    render(value: number) {
        return (
            <div>
                <label>{this.label}</label>
                <input
                    type="number"
                    value={value}
                    onChange={e => this.invokeOnChange(parseInt(e.target.value))}
                />
            </div>
        );
    }
}