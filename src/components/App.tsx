import React from "react";
import { EditableWidgetType, WidgetDescriptor } from "widgets/WidgetDescriptor";
import { DateTimeComponent } from "./DateTimeComponent";
import { DropDownSection } from "./DropDownSection";
import { EditSidebar } from "./EditSidebar";
import { LinksComponent } from "./LinksComponent";
import { QuoteComponent } from "./QuoteComponent";
import { WidgetPreview } from "./Widget";
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
      item: new WidgetDescriptor(LinksComponent, {
        links: [
          { name: "Google", url: "https://google.com" },
          { name: "Reddit", url: "https://reddit.com" },
        ],
      }),
      width: 1,
      height: 1,
    };
    grid[1][0] = {
      item: new WidgetDescriptor(DateTimeComponent, {
        showTime: false,
        showYear: false,
        showDayOfWeek: false,
      }),
      width: 1,
      height: 1,
    };
    grid[1][2] = {
      item: new WidgetDescriptor(DateTimeComponent, {
        showYear: false,
        showDate: false,
      }),
      width: 1,
      height: 1,
    };
    grid[1][4] = {
      item: new WidgetDescriptor(DateTimeComponent, {
        showTime: false,
        showDayOfWeek: false,
        showDate: false,
      }),
      width: 1,
      height: 1,
    };
    grid[2][2] = {
      item: new WidgetDescriptor(QuoteComponent, {
        useCustomQuote: false,
      }),
      width: 1,
      height: 1,
    };
    this.state = {
      widgets: [
        new WidgetDescriptor(DateTimeComponent, {}),
        new WidgetDescriptor(QuoteComponent, {}),
        new WidgetDescriptor(LinksComponent, {
          links: [
            { name: "Google", url: "https://google.com" },
            { name: "Reddit", url: "https://reddit.com" },
          ],
        }),
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
    if(event.dataTransfer.dropEffect == 'none') return;

    const grid = this.state.grid;
    grid[col][row] = null;
    this.setState({
      grid
    });
  }

  handleDrop(event: React.DragEvent<HTMLDivElement>, col: number, row: number) {
    if(this.state.mode == 'view') return;
    const data = WidgetDescriptor.fromJson(event.dataTransfer.getData("text/plain"));;
    const grid = this.state.grid;
    grid[col][row] = {
      item: data,
      width: 1,
      height: 1,
    };
    this.setState({ grid });
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

  renderPart(col: number, row: number) {
    const startpart = this.state.grid[col][row];
    if(startpart == null) {
      return this.renderEmptyPart(col, row);
    }
    const { item, width, height } = startpart;
    let className = `col-span-${width} col-start-${col} row-span-${height} row-start-${row}`;
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
        {item.buildWidget()}
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
      <div className="flex flex-row items-center h-full">
        
        <div className="flex flex-col align-stretch justify-start h-full w-full shrink">
          {/** Main content and header */}
          <div className="w-full flex flex-row justify-end">
            {/** Header */}
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