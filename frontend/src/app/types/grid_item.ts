export interface BaseGridItem {
    number: number;
    type: 'driver' | 'filter';
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
}

export type GridItem = FilterGridItem | DriverGridItem;

