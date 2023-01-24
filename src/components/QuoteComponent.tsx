import React from "react"
import { editableBoolean, editableString } from "widgets/WidgetDescriptor"


type QuoteComponentProps = {
    useCustomQuote: boolean,
    customQuote: string,
    customAuthor: string,
    showAuthor: boolean,
}

type QuoteComponentState = {
    fetchedQuote?: string,
    fetchedAuthor?: string,
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

    componentDidMount() {
        if (!this.props.useCustomQuote) {
            this.refreshQuote();
        }
        
    }

    componentDidUpdate(prevProps: Readonly<QuoteComponentProps>, prevState: Readonly<QuoteComponentState>, snapshot?: any): void {
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