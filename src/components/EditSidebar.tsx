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
        children: [],
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
                bg-slate-200 rounded
                flex flex-row items-stretch
                ${this.props.mode == 'opened'
                ? `w-[100px]`
                : "hidden"
                }`}
        >
            <div
                className="h-full w-2 bg-slate-300 cursor-col-resize"
            >
                {/** Dragger */}
            </div>
            <div>
                {/** Content */}
                {this.props.children}
            </div>
        </div>
    }
}