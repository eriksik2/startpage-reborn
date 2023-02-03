import { AppModel } from 'DataModel/AppModel';
import { GridBoardModel } from 'DataModel/GridBoardModel';
import React from 'react';
import { BoardPreview } from './BoardPreview';


type BoardListEditorProps = {
    appModel: AppModel,
    onSelectBoard?: (index: number) => void,
};

export class BoardListEditor extends React.Component<BoardListEditorProps> {
    static defaultProps = {
        onSelectBoard: (index: number) => {},
    };

    constructor(props: BoardListEditorProps) {
        super(props);

        this.onAppModelUpdate = this.onAppModelUpdate.bind(this);
    }

    onAppModelUpdate() {
        this.forceUpdate();
    }

    rebindAppModel(oldModel: AppModel | null, newModel: AppModel | null) {
        if (oldModel) {
            oldModel.removeListener(this.onAppModelUpdate);
        }
        if (newModel) {
            newModel.addListener(this.onAppModelUpdate);
        }
    }

    componentDidMount(): void {
        this.rebindAppModel(null, this.props.appModel);
    }

    componentDidUpdate(prevProps: Readonly<BoardListEditorProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.appModel !== this.props.appModel) {
            this.rebindAppModel(prevProps.appModel, this.props.appModel);
        }
    }

    componentWillUnmount(): void {
        this.rebindAppModel(this.props.appModel, null);
    }

    renderItem(index?: number) {
        const isAddButton = index === undefined;
        const onClick = isAddButton
            ? () => this.props.appModel.addBoard(new GridBoardModel(5, 5))
            : () => this.props.onSelectBoard!(index!);
        return <div
            key={index}
            onClick={onClick}
            className="bg-blue-200 rounded-lg m-2 p-2 w-32"
        >
            {isAddButton
                ? <BoardPreview>
                    +
                </BoardPreview>
                : <BoardPreview boardModel={this.props.appModel.boards[index!]}/>
            }
        </div>;
    }

    render() {
        return <div
            className="w-full h-full flex flex-wrap flex-row items-center justify-center content-center overflow-auto"
        >
            {this.props.appModel.boards.map((board, index) => {
                return this.renderItem(index);
            })}
            {this.renderItem()}

        </div>;
    }
}