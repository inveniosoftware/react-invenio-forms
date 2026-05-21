import { createContext } from "react";

export const BulkActionsContext = createContext({
  bulkActionContext: {},
  addToSelected: () => {},
  allSelected: false,
  setAllSelected: () => {},
  selectedCount: 0,
});
