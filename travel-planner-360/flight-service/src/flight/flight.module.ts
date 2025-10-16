import { Module } from "@nestjs/common";
import { FlightController } from "./flight.controller";

@Module({
    imports: [],
    controllers: [FlightController],
    providers: [],
    exports: []
})
export class FlightModule {}