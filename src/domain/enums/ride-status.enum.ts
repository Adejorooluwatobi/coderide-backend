export enum RideStatus {
    REQUESTED = 'REQUESTED',
    ACCEPTED = 'ACCEPTED',
    ARRIVING = 'ARRIVING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum CancelledBy {
    RIDER = 'RIDER',
    DRIVER = 'DRIVER',
}