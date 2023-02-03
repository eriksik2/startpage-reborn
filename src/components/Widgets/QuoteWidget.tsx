import React from "react"
import { editableBoolean, editableString } from "widgets/WidgetDescriptor"


type QuoteWidgetProps = {
    useCustomQuote: boolean,
    customQuote: string,
    customAuthor: string,
    showAuthor: boolean,
}

type QuoteWidgetState = {
    fetchedQuote?: string,
    fetchedAuthor?: string,
}

export class QuoteWidget extends React.Component<QuoteWidgetProps, QuoteWidgetState> {
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
            showInSettings: (props: QuoteWidgetProps) => props.useCustomQuote,
        }),
        customAuthor: editableString(undefined, {
            displayName: "Custom author",
            showInSettings: (props: QuoteWidgetProps) => props.useCustomQuote && props.showAuthor,
        }),
        showAuthor: editableBoolean({
            displayName: "Show author",
        }),
    }

    constructor(props: QuoteWidgetProps) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        if (!this.props.useCustomQuote) {
            this.refreshQuote();
        }
        
    }

    componentDidUpdate(prevProps: Readonly<QuoteWidgetProps>, prevState: Readonly<QuoteWidgetState>, snapshot?: any): void {
        if(!this.props.useCustomQuote && prevProps.useCustomQuote) {
            this.refreshQuote();
        }
    }

    refreshQuote() {
        fetch("https://api.quotable.io/random")
            .then((response) => response.json())
            .then((data) => {
                this.setState({ fetchedQuote: data.content, fetchedAuthor: data.author });
            });
    }

    render() {
        return <div className="flex flex-col items-end justify-center w-full h-full">
            <p>
                {this.props.useCustomQuote
                    ? this.props.customQuote
                    : this.state.fetchedQuote
                }
            </p>
            {this.props.showAuthor
                ? <p className="text-xs align-self-end">
                    - {this.props.useCustomQuote
                        ? this.props.customAuthor
                        : this.state.fetchedAuthor
                    }
                </p>
                : null
            }
        </div>
    }
}