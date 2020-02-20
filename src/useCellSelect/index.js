import { actions } from "react-table";

import { prepareRow } from "./prepareRow";
import { reducer } from "./reducer";
import { useInstance } from "./useInstance";

const pluginName = "useCellSelect";

// Actions
actions.resetSelectedRows = "resetSelectedRows";
actions.toggleAllRowsSelected = "toggleAllRowsSelected";
actions.toggleRowSelected = "toggleRowSelected";
actions.toggleCellSelected = "toggleCellSelected";

export const useCellSelect = hooks => {
  hooks.getToggleCellSelectedProps = [defaultGetToggleCellSelectedProps];
  hooks.stateReducers.push(reducer);
  hooks.useInstance.push(useInstance);
  hooks.prepareRow.push(prepareRow);
};

useCellSelect.pluginName = pluginName;

const defaultGetToggleCellSelectedProps = (props, { instance, row, cell }) => {
  return [
    props,
    {
      onClick: (event, { rowIndex, cellIndex }) => {
        const targetCell = instance.rows[rowIndex].cells[cellIndex];

        targetCell.toggleCellSelected({
          rowIndex,
          cellIndex,
          cell: targetCell,
          isShiftPressed: event.shiftKey
        });
      },
      isSelected: ({ rowIndex, cellIndex }) => {
        // TODO: rename to pos: {x, y};
        if (instance) {
          const filtered = instance.selectedFlatCells.filter(
            flatCell =>
              flatCell.rowIndex === rowIndex && flatCell.cellIndex === cellIndex
          );

          return filtered.length > 0;
        }
      },

      style: {
        cursor: "pointer"
      },
      title: "Toggle Cell Selected",
      indeterminate: cell.isSomeSelected
    }
  ];
};
