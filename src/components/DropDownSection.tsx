import React from "react";

type DropDownSectionProps = {
    title: string;
    children: React.ReactNode | React.ReactNode[];
};

type DropDownSectionState = {
    isOpen: boolean;
};

export class DropDownSection extends React.Component<DropDownSectionProps, DropDownSectionState> {
    static defaultProps = {
        children: [],
    };

    constructor(props: DropDownSectionProps) {
        super(props);
        this.state = {
            isOpen: true,
        };

        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        return <div>
            <div className="flex flex-row items-center" onClick={this.handleToggle}>
                {this.state.isOpen ? "▼" : "▶"}
                <h1>
                    {this.props.title}
                </h1>
            </div>
            <div className={this.state.isOpen ? "" : "hidden"}>
                {this.props.children}
            </div>
        </div>
    }
}