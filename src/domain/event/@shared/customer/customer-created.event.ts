import EventInterface from "../event.interface";

export default class CustomerCreatedEvent implements EventInterface {
    dataTimeOcuccured: Date
    eventData: any

    constructor(eventData: any) {
        this.dataTimeOcuccured = new Date()
        this.eventData = eventData
    }
}