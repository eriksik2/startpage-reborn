import React from "react";
import { EditableWidgetType, WidgetDescriptor } from "widgets/WidgetDescriptor";
import { DateTimeWidget } from "./Widgets/DateTimeWidget";
import { DropDownSection } from "./DropDownSection";
import { EditSidebar } from "./EditSidebar";
import { LinksWidget } from "./Widgets/LinksWidget";
import { QuoteWidget } from "./Widgets/QuoteWidget";
import { WeatherWidget } from "./Widgets/WeatherWidget";
import { WidgetPreview } from "./WidgetPreview";
import { WidgetSettingsEdit } from "./WidgetSettingsEdit";


type PositionedStartpart<P extends EditableWidgetType<any>> = {
  item: WidgetDescriptor<P>;
  width: number;
  height: number;
}

type AppState = {
  widgets: WidgetDescriptor<any>[];
  grid: (PositionedStartpart<any> | null)[][];
  mode: "edit" | "view";
  selected: { col: number, row: number} | null;
  sidebarWidth: number;
};

export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    const grid = Array(3).fill(null).map(() => Array(5).fill(null));
    grid[0][2] = {
      item: new WidgetDescriptor(LinksWidget, {
        links: [
          { name: "Google", url: "https://google.com" },
          { name: "Reddit", url: "https://reddit.com" },
        ],
      }),
      width: 1,
      height: 1,
    };
    grid[1][0] = {
      item: new WidgetDescriptor(DateTimeWidget, {
        showTime: false,
        showYear: false,
        showDayOfWeek: false,
      }),
      width: 1,
      height: 1,
    };
    grid[1][2] = {
      item: new WidgetDescriptor(DateTimeWidget, {
        showYear: false,
        showDate: false,
      }),
      width: 1,
      height: 1,
    };
    grid[1][4] = {
      item: new WidgetDescriptor(DateTimeWidget, {
        showTime: false,
        showDayOfWeek: false,
        showDate: false,
      }),
      width: 1,
      height: 1,
    };
    grid[2][2] = {
      item: new WidgetDescriptor(QuoteWidget, {}),
      width: 1,
      height: 1,
    };
    this.state = {
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
      ],
      grid: grid,
      mode: "view",
      selected: null,
      sidebarWidth: 100,
    };

    this.handleSwapMode = this.handleSwapMode.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleChangeSelected = this.handleChangeSelected.bind(this);
  }

  componentDidMount(): void {
    this.loadFromLocalStorage();
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<AppState>, snapshot?: any): void {
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    const grid = this.state.grid.map(col => col.map(item => {
      if(item == null) return null;
      return {
        item: item.item.toJson(),
        width: item.width,
        height: item.height,
      };
    }));
    const json = JSON.stringify(grid);
    localStorage.setItem("grid", json);
  }

  loadFromLocalStorage() {
    const json = JSON.parse(localStorage.getItem("grid") || "null");
    if(json == null) return;
    if(json.length != 3) return;
    if(json[0].length != 5) return;
    const grid = json.map((col: any) => col.map((item: any) => {
      if(item == null) return null;
      const descriptor = WidgetDescriptor.fromJson(item.item);
      if(descriptor == null) return null;
      return {
        item: descriptor,
        width: item.width,
        height: item.height,
      };
    }));
    this.setState({ grid });
  }

  handleSwapMode() {
    this.setState({
      mode: this.state.mode == 'edit' ? 'view' : 'edit'
    });
  }

  handleSelect(col: number, row: number) {
    if(this.state.mode == 'view') return;
    if(this.state.selected?.col == col && this.state.selected?.row == row) {
      this.setState({ selected: null });
    } else {
      if(this.state.grid[col][row] == null) {
        this.setState({ selected: null });
      }
      this.setState({ selected: { col, row } });
    }
  }

  handleDragStart(event: React.DragEvent<HTMLDivElement>, col: number, row: number) {
    if(this.state.mode == 'view') return;
    if(this.state.grid[col][row] == null) return;

    const text = this.state.grid[col][row]!.item.toJson();
    event.dataTransfer.setData("text/plain", text);
  }

  handleDragEnd(event: React.DragEvent<HTMLDivElement>, col: number, row: number) {
    if(this.state.mode == 'view') return;
    const grid = this.state.grid;
    grid[col][row] = null;
    this.setState({
      grid
    });
  }

  handleDrop(event: React.DragEvent<HTMLDivElement>, col: number, row: number) {
    if(this.state.mode == 'view') return;
    const dataPlain = event.dataTransfer.getData("text/plain");
    if(dataPlain != "") {
      event.dataTransfer.dropEffect = 'move';
      const data = WidgetDescriptor.fromJson(dataPlain);
      const grid = this.state.grid;
      grid[col][row] = {
        item: data,
        width: 1,
        height: 1,
      };
      this.setState({ grid });
    }
  }

  handleChangeSelected(data: WidgetDescriptor<any>) {
    if(this.state.selected == null) return;
    const grid = this.state.grid;
    grid[this.state.selected.col][this.state.selected.row] = {
      item: data,
      width: 1,
      height: 1,
    };
    this.setState({ grid });
  }

  handleClear() {
    if(this.state.selected == null) {
      const grid = this.state.grid;
      for(let col = 0; col < grid.length; col++) {
        for(let row = 0; row < grid[col].length; row++) {
          grid[col][row] = null;
        }
      }
      this.setState({
        grid,
      });
    } else {
      const grid = this.state.grid;
      grid[this.state.selected.col][this.state.selected.row] = null;
      this.setState({
        grid,
        selected: null,
      });
    }
  }

  getWidgetPositioningClassName(col: number, row: number) {
    const widget = this.state.grid[col][row];
    if(widget == null) {
      return "";
    }
    const { item, width, height } = widget;
    let heightClass = "";
    switch(height) {
      case 1: heightClass = "row-span-1"; break;
      case 2: heightClass = "row-span-2"; break;
      case 3: heightClass = "row-span-3"; break;
      case 4: heightClass = "row-span-4"; break;
      case 5: heightClass = "row-span-5"; break;
      case 6: heightClass = "row-span-6"; break;
    }
    let widthClass = "";
    switch(width) {
      case 1: widthClass = "col-span-1"; break;
      case 2: widthClass = "col-span-2"; break;
      case 3: widthClass = "col-span-3"; break;
      case 4: widthClass = "col-span-4"; break;
      case 5: widthClass = "col-span-5"; break;
      case 6: widthClass = "col-span-6"; break;
      case 7: widthClass = "col-span-7"; break;
      case 8: widthClass = "col-span-8"; break;
      case 9: widthClass = "col-span-9"; break;
      case 10: widthClass = "col-span-10"; break;
    }
    return `${widthClass} ${heightClass}`;
  }

  renderPart(col: number, row: number) {
    const widget = this.state.grid[col][row];
    if(widget == null) {
      return this.renderEmptyPart(col, row);
    }
    let className = `${this.getWidgetPositioningClassName(col, row)} col-start-${col} row-start-${row}`;
    if(this.state.mode == 'edit' && this.state.selected?.col == col && this.state.selected?.row == row) {
      className += " border-2 border-slate-300";
    }
    return <div
      draggable={this.state.mode == 'edit'}
      className={className}
      key={`${col}-${row}`}
      onClick={() => this.handleSelect(col, row)}
      onDragStart={(e) => this.handleDragStart(e, col, row)}
      onDragEnd={(e) => this.handleDragEnd(e, col, row)}
      onDrop={(e) => this.handleDrop(e, col, row)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
    >
        {widget.item.buildWidget()}
    </div>
  }

  renderEmptyPart(col: number, row: number) {
    return <div>
      {/** Empty part */}
      {this.state.mode == 'edit'
        ? <div
            className="w-full h-full flex items-center justify-center border-2 border-slate-200"
            key={`${col}-${row}`}
            onClick={() => this.handleSelect(col, row)}
            onDrop={(e) => this.handleDrop(e, col, row)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
        >+</div>
        : <div key={`${col}-${row}`}></div>
      }
    </div>
  }

  getSelected() {
    if(this.state.selected == null) return null;
    return this.state.grid[this.state.selected.col][this.state.selected.row];
  }

  render() {

    return (
      <div className="flex flex-row items-stretch h-full">
        
        <div className="flex flex-col align-stretch justify-start h-full w-full shrink">
          {/** Main content and header */}
          <div className="w-full flex flex-row justify-end">
            {/** Header */}
            <button
              onClick={() => this.handleClear()}
            >
              Clear
            </button>
            <button
              className="px-4 py-2 rounded-bl-xl border-l-2 border-b-2 border-slate-300 bg-slate-200 text-slate-800"  
              onClick={this.handleSwapMode}
            >
              {this.state.mode == 'edit'
                ? "Close"
                : "Edit"}
            </button>
          </div>
          <div className="flex flex-col justify-center align-stretch h-full">
            <div className={`
              grid grid-cols-5 grid-rows-3 w-full aspect-[16/8]
              ${this.state.mode == 'edit'
                ? "rounded border-2 border-slate-200"
                : ""
              }
            `}>
              {this.state.grid.map((column, coli) => column.map((item, rowi) => this.renderPart(coli, rowi)))}
            </div>
          </div>
        </div>
        <div className="grow h-full">
          <EditSidebar
            mode={this.state.mode == 'edit' ? 'opened' : 'closed'}
          >
            {/** Sidebar content */}
            <DropDownSection title="Selected">
              {this.getSelected() != null
                ? <WidgetSettingsEdit
                  data={this.getSelected()!.item}
                  onChange={this.handleChangeSelected}/>
                : <div>Nothing selected</div>
              }
            </DropDownSection>
            <DropDownSection title="Widgets">
              {this.state.widgets.map((widget, index) => (
                <div key={index}>
                  <WidgetPreview data={widget}/>
                </div>
              ))}
            </DropDownSection>
          </EditSidebar>
        </div>
      </div>
    );
  }
}