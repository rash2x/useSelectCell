import { makePropGetter } from "react-table";

export function prepareRow(row, { instance }) {
  row.toggleRowSelected = set => instance.toggleRowSelected(row.id, set);

  row.cells.forEach((cell, index) => {
    cell.isSelected = false;
    cell.toggleCellSelected = set => {
      instance.toggleCellSelected(set);
    };

    cell.getToggleCellSelectedProps = makePropGetter(
      instance.getHooks().getToggleCellSelectedProps,
      { instance: instance, row, cell }
    );
  });

  row.getToggleRowSelectedProps = makePropGetter(
    instance.getHooks().getToggleRowSelectedProps,
    { instance: instance, row }
  );
}
