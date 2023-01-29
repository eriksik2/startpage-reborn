import { FractionalPosition, PositionModel as PositionModel } from './PositionModel';



export type GridPosition = {
    row: number;
    col: number;
    width: number;
    height: number;
};

export class GridPositionModel extends PositionModel<GridPosition> {

    num_rows: number;
    num_cols: number;

    constructor(num_rows: number, num_cols: number) {
        super();
        this.num_rows = num_rows;
        this.num_cols = num_cols;
    }


    public toFractionalPosition(position: GridPosition): FractionalPosition {
        return {
            left: position.col / this.num_cols,
            top: position.row / this.num_rows,
            width: position.width / this.num_cols,
            height: position.height / this.num_rows,
        };
    }

    public fromFractionalPosition(position: FractionalPosition): GridPosition {
        return {
            row: Math.round(position.top * this.num_rows),
            col: Math.round(position.left * this.num_cols),
            width: Math.round(position.width * this.num_cols),
            height: Math.round(position.height * this.num_rows),
        };
    }
    
}