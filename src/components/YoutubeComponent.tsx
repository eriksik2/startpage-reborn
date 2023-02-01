import React from "react"
import { editableBoolean, editableString } from "widgets/WidgetDescriptor"
import { ModeContext } from './App2'


type YoutubeComponentProps = {
    url: string,
    autoplay: boolean,
}

type YoutubeComponentState = {
}

export class YoutubeComponent extends React.Component<YoutubeComponentProps, YoutubeComponentState> {
    static defaultProps = {
        url: "",
        autoplay: false,
    }

    static editablePropTypes = {
        url: editableString(undefined, {
            displayName: "Url",
        }),
        autoplay: editableBoolean({
            displayName: "Autoplay",
        }),
    }

    constructor(props: YoutubeComponentProps) {
        super(props);
        this.state = {
        };
    }

    getVideoId(){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = this.props.url.match(regExp);
        return (match&&match[7]!.length==11)? match[7] : false;
    }

    getThumbnailUrl() {
        return `https://img.youtube.com/vi/${this.getVideoId()}/0.jpg`;
    }

    render() {
        return <ModeContext.Consumer>
            {(appMode) => <div
                className="flex flex-col items-end justify-center w-full h-full"
            >
                {appMode == "display"
                    ? <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${this.getVideoId()}?autoplay=${this.props.autoplay}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded youtube"
                    />
                    : <img
                        className="w-full h-full"
                        src={this.getThumbnailUrl()}
                        alt="Thumbnail"
                    />
                }
            </div>}
        </ModeContext.Consumer>
    }
}