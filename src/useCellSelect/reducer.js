import { actions } from "react-table";

export function reducer(state, action, previousState, instance) {
  const { selectedCells } = state;
  if (action.type === actions.init) {
    return {
      selectedRowIds: {},
      selectedCells: [],
      ...state
    };
  }

  if (action.type === actions.resetSelectedRows) {
    return {
      ...state,
      selectedRowIds: instance.initialState.selectedRowIds || {}
    };
  }

  if (action.type === actions.toggleAllRowsSelected) {
    const { value: setSelected } = action;
    const {
      isAllRowsSelected,
      rowsById,
      nonGroupedRowsById = rowsById
    } = instance;

    const selectAll =
      typeof setSelected !== "undefined" ? setSelected : !isAllRowsSelected;

    if (selectAll) {
      const selectedRowIds = {};

      Object.keys(nonGroupedRowsById).forEach(rowId => {
        selectedRowIds[rowId] = true;
      });

      return {
        ...state,
        selectedRowIds
      };
    }

    return {
      ...state,
      selectedRowIds: {}
    };
  }

  if (action.type === actions.toggleCellSelected) {
    const {
      value: { rowIndex, cellIndex, isShiftPressed }
    } = action;
    let newSelectedCells = [...state.selectedCells];

    const selectedCellIndex = newSelectedCells.findIndex(cellPosition => {
      return (
        cellPosition.rowIndex === rowIndex &&
        cellPosition.cellIndex === cellIndex
      );
    });

    if (selectedCellIndex < 0) {
      newSelectedCells.push({ rowIndex, cellIndex });
    } else {
      newSelectedCells.splice(selectedCellIndex, 1);
    }

    return {
      ...state,
      selectedCells: newSelectedCells
    };
  }
}
