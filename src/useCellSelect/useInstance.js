import React from "react";

import {
  actions,
  makePropGetter,
  ensurePluginOrder,
  useGetLatest,
  useMountedLayoutEffect
} from "react-table";

export function useInstance(instance) {
  const {
    data,
    rows,
    flatRows,
    getHooks,
    allColumns,
    plugins,
    rowsById,
    nonGroupedRowsById = rowsById,
    autoResetSelectedRows = true,
    state: { selectedRowIds, selectedCells },
    selectSubRows = true,
    dispatch
  } = instance;

  ensurePluginOrder(
    plugins,
    ["useFilters", "useGroupBy", "useSortBy"],
    "useCellSelect"
  );

  const selectedFlatCells = React.useMemo(() => {
    const selectedFlatCellIds = selectedCells;

    return selectedFlatCellIds;
  }, [rows, selectSubRows, selectedCells]);

  let isAllRowsSelected = Boolean(
    Object.keys(nonGroupedRowsById).length && Object.keys(selectedRowIds).length
  );

  if (isAllRowsSelected) {
    if (Object.keys(nonGroupedRowsById).some(id => !selectedRowIds[id])) {
      isAllRowsSelected = false;
    }
  }

  const getAutoResetSelectedRows = useGetLatest(autoResetSelectedRows);

  useMountedLayoutEffect(() => {
    if (getAutoResetSelectedRows()) {
      dispatch({ type: actions.resetSelectedRows });
    }
  }, [dispatch, data]);

  const toggleAllRowsSelected = React.useCallback(
    value => dispatch({ type: actions.toggleAllRowsSelected, value }),
    [dispatch]
  );

  const toggleRowSelected = React.useCallback(
    (id, value) => dispatch({ type: actions.toggleRowSelected, id, value }),
    [dispatch]
  );

  const toggleCellSelected = React.useCallback(
    value => {
      return dispatch({ type: actions.toggleCellSelected, value });
    },
    [dispatch]
  );

  const getInstance = useGetLatest(instance);

  const getToggleAllRowsSelectedProps = makePropGetter(
    getHooks().getToggleAllRowsSelectedProps,
    { instance: getInstance() }
  );

  Object.assign(instance, {
    selectedFlatCells,
    isAllRowsSelected,
    toggleRowSelected,
    toggleCellSelected,
    toggleAllRowsSelected,
    getToggleAllRowsSelectedProps
  });
}
