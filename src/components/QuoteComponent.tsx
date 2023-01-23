import React from "react"
import { editableBoolean, editableString } from "widgets/WidgetDescriptor"


type QuoteComponentProps = {
    useCustomQuote: boolean,
    customQuote: string,
    customAuthor: string,
    showAuthor: boolean,
}

type QuoteComponentState = {
}

export class QuoteComponent extends React.Component<QuoteComponentProps, QuoteComponentState> {
    static defaultProps = {
        useCustomQuote: false,
        customQuote: "",
        customAuthor: "",
        showAuthor: true,
    }

    static editablePropTypes = {
        useCustomQuote: editableBoolean({
            displayName: "Use custom quote",
        }),
        customQuote: editableString(undefined, {
            displayName: "Custom quote",
            showInSettings: (props: QuoteComponentProps) => props.useCustomQuote,
        }),
        customAuthor: editableString(undefined, {
            displayName: "Custom author",
            showInSettings: (props: QuoteComponentProps) => props.useCustomQuote && props.showAuthor,
        }),
        showAuthor: editableBoolean({
            displayName: "Show author",
        }),
    }

    constructor(props: QuoteComponentProps) {
        super(props);
        this.state = {
        };
    }

    render() {
        return <div className="flex flex-col items-end justify-center w-full h-full">
            <p>
                {this.props.useCustomQuote
                    ? this.props.customQuote
                    : "Hello world"
                }
            </p>
            {this.props.showAuthor
                ? <p className="text-xs align-self-end">
                    - {this.props.useCustomQuote
                        ? this.props.customAuthor
                        : "John Doe"
                    }
                </p>
                : null
            }
        </div>
    }
}