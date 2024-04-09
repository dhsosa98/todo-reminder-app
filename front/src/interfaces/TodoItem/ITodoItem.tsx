export interface ITodoItem{
    id: number,
    description: string,
    selected: boolean, 
    directoryId: number,
    updatedAt: string,
    createdAt: string,
    order: number,
    notification?: {
        active: boolean,
        providers: string[],
        schedule: string,
    }
}