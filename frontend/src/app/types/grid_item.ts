export interface BaseGridItem {
    number: number;
    type: 'driver' | 'filter' | 'blank';
}

export interface DriverGridItem extends BaseGridItem {
    type: 'driver';
    driverName?: string;
    row: number;
    column: number;
}

export interface FilterGridItem extends BaseGridItem {
    type: 'filter';
    filterCriteria: string;
    isRowFilter: boolean;
    // TODO: add more.
    typeOfFilter: 'constructor' | 'race_wins' | 'race_podiums';
    minFilterQuantity?: number
}

export interface BlankGridItem extends BaseGridItem {
    type: 'blank'
}

export type GridItem = FilterGridItem | DriverGridItem | BlankGridItem;

