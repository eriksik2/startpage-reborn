
import React from 'react';

type ViewportAspectRatioProps = {
	children: React.ReactNode | React.ReactNode[],
}

export default class ViewportAspectRatio extends React.Component<ViewportAspectRatioProps, {}> {
    static defaultProps = {
        children: null,
    };

    constructor(props: ViewportAspectRatioProps) {
        super(props);
        this.state = {};

        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    handleResize() {
        this.forceUpdate();
    }

    getViewportSize() {
        if (typeof window.innerWidth != 'undefined') {
            // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
            let viewPortWidth = window.innerWidth;
            let viewPortHeight = window.innerHeight;
            return [viewPortWidth, viewPortHeight];
        }
        else if (typeof document.documentElement != 'undefined'
            && typeof document.documentElement.clientWidth != 'undefined'
            && document.documentElement.clientWidth != 0) {
            // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
            let viewPortWidth = document.documentElement.clientWidth;
            let viewPortHeight = document.documentElement.clientHeight;
            return [viewPortWidth, viewPortHeight];
        }
        else {
            // older versions of IE
            let viewPortWidth = document.getElementsByTagName('body')[0]!.clientWidth;
            let viewPortHeight = document.getElementsByTagName('body')[0]!.clientHeight;
            return [viewPortWidth, viewPortHeight];
        }
    }

    render() {
        const [vpWidth, vpHeight] = this.getViewportSize();
        return (
            <div
                style={{
                    aspectRatio: `${vpWidth}/${vpHeight}`,
                }}
            >
                {this.props.children}
            </div>
        );
    }
}
