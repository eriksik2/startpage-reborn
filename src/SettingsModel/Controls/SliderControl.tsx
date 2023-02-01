import { BaseControl, BaseControlOptions } from 'SettingsModel/BaseControl';


type SliderControlOptions = {
    min: number;
    max: number;
    step?: number;
};

export class SliderControl extends BaseControl<number> {
    min: number;
    max: number;
    step: number;

    constructor(label: string, options: SliderControlOptions & BaseControlOptions<number>) {
        super(label, { onChange: options.onChange });
        this.min = options.min;
        this.max = options.max;
        this.step = options.step || 1;
    }

    render(value: number) {
        return (
            <div>
                <label>{this.label}</label>
                <input
                    type="range"
                    value={value}
                    min={this.min}
                    max={this.max}
                    step={this.step}
                    onChange={e => this.invokeOnChange(parseInt(e.target.value))}
                />
            </div>
        );
    }
}