import React from "react"
import { editableBoolean, editableString } from "widgets/WidgetDescriptor"


type QuoteComponentProps = {
    useCustomQuote: boolean,
    customQuote: string,
    customAuthor: string,
}

type QuoteComponentState = {
}

export class QuoteComponent extends React.Component<QuoteComponentProps, QuoteComponentState> {
    static defaultProps = {
        useCustomQuote: false,
        customQuote: "",
        customAuthor: "",
    }

    static editablePropTypes = {
        useCustomQuote: editableBoolean(),
        customQuote: editableString(),
        customAuthor: editableString(),
    }

    constructor(props: QuoteComponentProps) {
        super(props);
        this.state = {
        };
    }

    render() {
        return <div>
            {this.props.useCustomQuote ? this.props.customQuote : "Hello world"}
            {this.props.useCustomQuote ? this.props.customAuthor : "John Doe"}
        </div>
    }
}