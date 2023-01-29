
import { GridPositionModel } from 'DataModel/GridPositionModel';
import { PositionModel } from 'DataModel/PositionModel';
import React from "react";
import { WidgetDescriptor } from 'widgets/WidgetDescriptor';
import { LinksComponent } from './LinksComponent';
import { PositionModelDisplay } from './PositionModelDisplay';
import { GridPositionModelEdit } from './GridPositionModelEdit';
import ViewportAspectRatio from './ViewportAspectRatio';
import { EditSidebar } from './EditSidebar';
import ResizableColumns from './ResizableColumns';
import { DropDownSection } from './DropDownSection';
import { WidgetPreview } from './Widget';
import { WidgetSettingsEdit } from './WidgetSettingsEdit';
import { DateTimeComponent } from './DateTimeComponent';
import { QuoteComponent } from './QuoteComponent';
import { WeatherComponent } from './WeatherComponent';

type App2Props = {
};

type App2State = {
    mode: "display" | "edit",
    positionModel: PositionModel<any>,
    widgets: WidgetDescriptor<any>[];
    selected: WidgetDescriptor<any> | null;
};

export class App2 extends React.Component<App2Props, App2State> {
  constructor(props: App2Props) {
    super(props);
    const positionModel = new GridPositionModel(6, 10);
    positionModel.addWidget(new WidgetDescriptor(LinksComponent, {
      links: [
        { name: "Google", url: "https://google.com" },
        { name: "Reddit", url: "https://reddit.com" },
      ],
    }), { row: 0, col: 4, width: 2, height: 2 })
    positionModel.addWidget(new WidgetDescriptor(DateTimeComponent, {
      showTime: false,
      showYear: false,
      showDayOfWeek: false,
    }), { row: 2, col: 0, width: 2, height: 2 });
    positionModel.addWidget(new WidgetDescriptor(DateTimeComponent, {
      showYear: false,
      showDate: false,
    }), { row: 2, col: 4, width: 2, height: 2 });
    positionModel.addWidget(new WidgetDescriptor(DateTimeComponent, {
      showTime: false,
      showDayOfWeek: false,
      showDate: false,
    }), { row: 2, col: 8, width: 2, height: 2 });
    positionModel.addWidget(new WidgetDescriptor(QuoteComponent, {}), {
      row: 4, col: 4, width: 2, height: 2
    });
    
    this.state = {
        mode: "display",
        positionModel: positionModel,
        selected: null,
        widgets: [
          new WidgetDescriptor(DateTimeComponent, {}),
          new WidgetDescriptor(QuoteComponent, {
            useCustomQuote: true,
            customQuote: "Never let your dreams be dreams.",
            customAuthor: "Sun Tzu",
          }),
          new WidgetDescriptor(LinksComponent, {
            links: [
              { name: "Google", url: "https://google.com" },
              { name: "Reddit", url: "https://reddit.com" },
            ],
          }),
          new WidgetDescriptor(WeatherComponent, {}),
        ],
    };

    this.onSelect = this.onSelect.bind(this);
    this.onSelectedWidgetChange = this.onSelectedWidgetChange.bind(this);
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
    const positionModel = this.state.positionModel;
    positionModel.updateWidget(this.state.selected, widget);
    this.setState({
      positionModel: positionModel,
      selected: widget,
    });
  }

  render() {
    return (
      <div className="h-full w-full z-10">
        <ResizableColumns className="h-full w-full">
          <div className="w-full h-full flex flex-col items-stretch justify-center">
            <ViewportAspectRatio>
              {this.state.mode === "display"
                  ? <PositionModelDisplay positionModel={this.state.positionModel} />
                  : <GridPositionModelEdit
                    positionModel={this.state.positionModel as GridPositionModel}
                    onSelect={this.onSelect}
                  />
              }
            </ViewportAspectRatio>
          </div>
          {this.state.mode === "edit" &&
            <EditSidebar mode='opened'>
              <DropDownSection title="Selected">
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
    );
  }
}