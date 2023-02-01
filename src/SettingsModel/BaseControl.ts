import React from 'react';


export type BaseControlOptions<T, VT = T> = {
    onChange?: (value: T) => void,
    value?: (value: T) => VT,
}

export abstract class BaseControl<T, VT = T> {
    label: string;
    onChange: ((value: T) => void) | null;
    getValue: (value: T) => VT;

    constructor(label: string, options: BaseControlOptions<T>) {
        this.label = label;
        this.onChange = options.onChange ?? null;
        this.getValue = options.value ?? ((value: T) => value as any);
    }

    invokeOnChange(value: T) {
        if (this.onChange) {
            this.onChange(value);
        }
    }

    abstract render(value: T): React.ReactElement;
}