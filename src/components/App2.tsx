
import { GridBoardModel } from 'DataModel/GridBoardModel';
import { BoardModel } from 'DataModel/BoardModel';
import React from "react";
import { WidgetDescriptor } from 'widgets/WidgetDescriptor';
import { LinksWidget } from './Widgets/LinksWidget';
import { BoardDisplay } from './BoardDisplay';
import { GridBoardEditor } from './GridBoardEditor';
import ViewportAspectRatio from './ViewportAspectRatio';
import { EditSidebar } from './EditSidebar';
import ResizableColumns from './ResizableColumns';
import { DropDownSection } from './DropDownSection';
import { WidgetPreview } from './WidgetPreview';
import { WidgetSettingsEdit } from './WidgetSettingsEdit';
import { DateTimeWidget } from './Widgets/DateTimeWidget';
import { QuoteWidget } from './Widgets/QuoteWidget';
import { WeatherWidget } from './Widgets/WeatherWidget';
import { AppModel } from 'DataModel/AppModel';
import { firstOpenAppModel } from 'utils/firstOpenAppModel';
import { SliderControl } from 'SettingsModel/Controls/SliderControl';
import { NumberControl } from 'SettingsModel/Controls/NumberControl';
import { ObjectControl } from 'SettingsModel/Controls/ObjectControl';
import { ListControl } from 'SettingsModel/Controls/ListControl';
import { YoutubeWidget } from './Widgets/YoutubeWidget';

type App2Props = {
};

type App2State = {
    mode: "display" | "edit",
    appModel: AppModel,
    activeBoardIndex: number,
    widgets: WidgetDescriptor<any>[];
    selected: WidgetDescriptor<any> | null;
};

export const ModeContext = React.createContext<"display" | "edit">("display");

export class App2 extends React.Component<App2Props, App2State> {
  constructor(props: App2Props) {
    super(props);
    
    const appModel = firstOpenAppModel();
    this.state = {
        mode: "display",
        appModel: appModel,
        activeBoardIndex: 0,
        selected: null,
        widgets: [
          new WidgetDescriptor(DateTimeWidget, {}),
          new WidgetDescriptor(QuoteWidget, {
            useCustomQuote: true,
            customQuote: "Never let your dreams be dreams.",
            customAuthor: "Sun Tzu",
          }),
          new WidgetDescriptor(LinksWidget, {
            links: [
              { name: "Google", url: "https://google.com" },
              { name: "Reddit", url: "https://reddit.com" },
            ],
          }),
          new WidgetDescriptor(WeatherWidget, {}),
          new WidgetDescriptor(YoutubeWidget, {}),
        ],
    };

    this.onModelUpdate = this.onModelUpdate.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectedWidgetChange = this.onSelectedWidgetChange.bind(this);
  }

  componentDidMount(): void {
    this.state.appModel.addListener(this.onModelUpdate);
    this.getActiveBoard().addListener(this.onModelUpdate);
  }

  componentWillUnmount(): void {
    this.state.appModel.removeListener(this.onModelUpdate);
    this.getActiveBoard().removeListener(this.onModelUpdate);
  }

  getActiveBoard() {
    return this.state.appModel.boards[this.state.activeBoardIndex]!;
  }

  setActiveBoard(index: number) {
    const activeBoard = this.getActiveBoard();
    const newActiveBoard = this.state.appModel.boards[index]
    if(newActiveBoard == null) return;
    if(activeBoard == newActiveBoard) return;
    activeBoard.removeListener(this.onModelUpdate);
    newActiveBoard.addListener(this.onModelUpdate);
    this.setState({
      activeBoardIndex: index,
    });
  }

  /*addNewBoard() {
    const newBoard = new GridBoardModel(5, 5);
    this.state.appModel.addBoard(newBoard);
    this.setActiveBoard(newBoard);
  }*/

  removeBoard(board: BoardModel<any>) {

    this.state.appModel.removeBoard(board);
  }

  onModelUpdate() {
    this.forceUpdate();
  }

  onSelect(widget: WidgetDescriptor<any> | null) {
    if(this.state.mode == 'display') return;
    if(widget == null) {
      this.setState({ selected: null });
    } else {
      this.setState({ selected: widget });
    }
  }

  onSelectedWidgetChange(widget: WidgetDescriptor<any>) {
    if(this.state.selected == null) return;
    this.getActiveBoard().updateWidget(this.state.selected, widget);
  }

  render() {
    return (
      <ModeContext.Provider value={this.state.mode}>
        <div className="h-full w-full z-10">
          <ResizableColumns className="h-full w-full">
            <div className="w-full h-full flex flex-col items-stretch justify-center">
              <ViewportAspectRatio>
                {this.state.mode === "display"
                    ? <BoardDisplay boardModel={this.getActiveBoard()} />
                    : <GridBoardEditor
                      boardModel={this.getActiveBoard() as GridBoardModel}
                      onSelect={this.onSelect}
                    />
                }
              </ViewportAspectRatio>
            </div>
            {this.state.mode === "edit" &&
              <EditSidebar mode='opened'>
                <DropDownSection title="Board settings">
                </DropDownSection>
                <DropDownSection title="Widget settings">
                  {this.state.selected != null
                    ? <WidgetSettingsEdit
                      data={this.state.selected}
                      onChange={this.onSelectedWidgetChange}/>
                    : <div>Nothing selected</div>
                  }
                </DropDownSection>
                <DropDownSection title="Widgets">
                  <div
                    className="flex flex-wrap"
                  >
                    {this.state.widgets.map((widget, index) => (
                      <div key={index}>
                        <WidgetPreview data={widget}/>
                      </div>
                    ))}
                  </div>
                </DropDownSection>
              </EditSidebar>
            }
          </ResizableColumns>
          <div className="absolute top-0 left-0">
            <button onClick={() => this.setState({ mode: "display" })}>Display</button>
            <button onClick={() => this.setState({ mode: "edit" })}>Edit</button>
          </div>
        </div>
      </ModeContext.Provider>
    );
  }
}