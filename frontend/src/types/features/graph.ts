export interface SelectedPoints {
    start: number | undefined;
    end: number | undefined;
}

export interface GraphValues {
    [graphName: string]: SelectedPoints;
}