import React from "react";


type EditSidebarProps = {
    mode: 'opened' | 'closed';
    children: React.ReactNode | React.ReactNode[];
};

type EditSidebarState = {
    width: number;
};

export class EditSidebar extends React.Component<EditSidebarProps, EditSidebarState> {
    static defaultProps = {
        mode: 'closed',
        children: null,
    };

    constructor(props: EditSidebarProps) {
        super(props);
        this.state = {
            width: 100,
        };
    }

    render() {
        return <div
            className={`
                h-full
                bg-slate-200
                p-2
                border-l-2 border-slate-300
                flex flex-row items-stretch
                overflow-y-scroll overflow-x-hidden
                ${this.props.mode == 'opened'
                ? ""
                : "hidden"
                }`}
        >
            <div>
                {/** Content */}
                <h1 className="text-4xl mb-4">
                    Settings
                </h1>
                    {this.props.children}
            </div>
        </div>
    }
}