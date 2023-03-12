import { LabStatus } from "../model/LabStatus";

interface Scene {
  setup(): void;
  update(labStatus: LabStatus): void;
  teardown(): void;
}

export {Scene};
