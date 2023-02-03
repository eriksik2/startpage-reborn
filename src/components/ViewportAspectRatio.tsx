
import React from 'react';

type ViewportAspectRatioProps = {
	children: React.ReactNode | React.ReactNode[],
}

type ViewportAspectRatioState = {
    scalingAxis: 'width' | 'height' | 'none',
};

export default class ViewportAspectRatio extends React.Component<ViewportAspectRatioProps, ViewportAspectRatioState> {
    static defaultProps = {
        children: null,
    };

    rootRef: React.RefObject<HTMLDivElement>;

    constructor(props: ViewportAspectRatioProps) {
        super(props);
        this.state = {
            scalingAxis: 'none',
        };
        this.rootRef = React.createRef();

        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        //window.addEventListener('resize', this.handleResize);
        
        // TODO: Only do this.handleResize() whenever the window is resized or when the containing element is resized.
        const fps = 144;
        setInterval(this.handleResize, 1000 / fps);
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

    getScalingAxis() {
        const vpSize = this.getViewportSize();
        const vpWidth = vpSize[0]!;
        const vpHeight = vpSize[1]!;

        const root = this.rootRef.current;
        if (root == null) return 'none';

        const maxRect = root!.getBoundingClientRect();
        const maxWidth = maxRect.width;
        const maxHeight = maxRect.height;
        
        const widthRatio = maxWidth / vpWidth;
        const heightRatio = maxHeight / vpHeight;

        return widthRatio < heightRatio ? 'width' : 'height';
    }

    render() {
        const [vpWidth, vpHeight] = this.getViewportSize();
        const axis = this.getScalingAxis();
        return (
            <div
                className='w-full h-full flex flex-col justify-center items-center'
                ref={this.rootRef}
            >
                <div
                    style={{
                        aspectRatio: `${vpWidth}/${vpHeight}`,
                        width: axis === 'width' ? '100%' : 'auto',
                        height: axis === 'height' ? '100%' : 'auto',
                    }}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
