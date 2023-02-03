import React from "react"
import { editableBoolean, editableList, editableObject, editableString } from "widgets/WidgetDescriptor"


type Link = {
    name: string,
    url: string,
    pic?: string,
}

type LinksWidgetProps = {
    name: string,
    links: Link[],
}

type LinksWidgetState = {
}

export class LinksWidget extends React.Component<LinksWidgetProps, LinksWidgetState> {
    static defaultProps = {
        name: "",
        links: [],
    }

    static editablePropTypes = {
        name: editableString(undefined, {
            displayName: "Name",
        }),
        links: editableList(editableObject({
            name: editableString(undefined, {
                displayName: "Name",
            }),
            url: editableString(undefined, {
                displayName: "URL",
            }),
        }), {
            displayName: "Links",
        }),
    }

    constructor(props: LinksWidgetProps) {
        super(props);
        this.state = {
        };
    }

    renderLink(index: number) {
        const link = this.props.links[index]!;
        return <div
            key={index}
            className="flex flex-col items-center justify-center w-full h-full"
        >
            <img height="34" width="34" alt="" src={`http://www.google.com/s2/favicons?domain=${link.url}`} />
            <p>{link.name}</p>
        </div>
    }

    render() {
        return <div className="flex flex-col items-center justify-evenly w-full h-full">
            {this.props.name !== ""
                ? <h1 className="text-2xl">{this.props.name}</h1>
                : null
            }
            <div className="flex flex-row items-center justify-center w-full">
                {this.props.links.map((link, index) => {
                    return this.renderLink(index);
                })}
            </div>
        </div>
    }
}