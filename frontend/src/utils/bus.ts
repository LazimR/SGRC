import EventEmitter from "eventemitter3"

export interface AppEvents {
  flash: (data: {
    message?: string
    type: "success" | "error" | "warning"
  }) => void
}

const bus = new EventEmitter<AppEvents>()

export default bus
