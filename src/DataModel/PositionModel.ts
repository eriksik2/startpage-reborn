import { Listenable } from 'utils/Listenable';
import { WidgetDescriptor } from 'widgets/WidgetDescriptor';


// FractionalPosition is a position that is relative to the size of the board.
// For example, if the board is 1000x1000, then a position
// of {left: 0, top: 0, right: 0.5, bottom: 0.5} would be the
// top left quadrant of the board.
export type FractionalPosition = {
    left: number;
    top: number;
    width: number;
    height: number;
};


export abstract class PositionModel<PositionType> extends Listenable {

        widgets: {
            widget: WidgetDescriptor<any>;
            position: PositionType;
        }[];

        constructor() {
            super();
            this.widgets = [];
        }
        
        public abstract toFractionalPosition(position: PositionType): FractionalPosition;
        public abstract fromFractionalPosition(position: FractionalPosition): PositionType;

        public updateWidget(widget: WidgetDescriptor<any>, newWidget: WidgetDescriptor<any>) {
            const index = this.widgets.findIndex(w => w.widget === widget);
            if (index >= 0) {
                this.widgets[index]!.widget = newWidget;
                this.notifyListeners();
            }
        }

        public addWidget(widget: WidgetDescriptor<any>, position: PositionType) {
            this.widgets.push({ widget, position });
            this.notifyListeners();
        }

        public removeWidget(widget: WidgetDescriptor<any>) {
            this.widgets = this.widgets.filter(w => w.widget !== widget);
            this.notifyListeners();
        }

        public moveWidget(widget: WidgetDescriptor<any>, position: Partial<PositionType>) {
            const index = this.widgets.findIndex(w => w.widget === widget);
            if (index >= 0) {
                this.widgets[index]!.position = { ...this.widgets[index]!.position, ...position };
                this.notifyListeners();
            }
        }
        
        
}
