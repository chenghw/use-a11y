import { SyntheticEvent, useCallback, useReducer, useState } from 'react';

import { KEYS } from '../utils';

interface IdMap {
  headerId: string;
  panelId?: string;
}

interface Props {
  ids: IdMap[];
  initialSelectedIds?: string[];
  mode?: 'collapse' | 'single' | 'multiple';
}

interface ButtonProps {
  'aria-controls': string;
  'aria-disabled'?: boolean;
  'aria-expanded': boolean;
  id: string;
  onClick: () => void;
  onKeyDown: () => void;
}

interface PanelProps {
  'aria-labelledby': string;
  id: string;
  hidden?: boolean;
  role: 'region';
}

interface Output {
  props: {
    [key: string]: {
      buttonProps: ButtonProps;
      panelProps: PanelProps;
    };
  };
  // getProps: (
  //   id: string
  // ) => {
  //   buttonProps: ButtonProps;
  //   panelProps: PanelProps;
  // };
}

interface State {
  props: Props;
  selectedIds: Set<string>;
  mode: boolean;
  // idsById: {
  //   [key: string]: IdMap;
  // };
}

type Actions = {
  type: 'ON_CLICK_BUTTON';
  payload: {
    id: string;
  };
};

type Reducer = (state: State, action: Actions) => State;

const getPanelId = (options: IdMap): string =>
  options.panelId || `${options.headerId}__panel`;

function useAccordion(props: Props): Output {
  console.log('props', props);
  const { ids, mode } = props;
  const [state, dispatch] = useReducer<Reducer, Props>(
    (state, action) => {
      switch (action.type) {
        case 'ON_CLICK_BUTTON': {
          console.log(
            'state.selectedIds.add(action.payload.id)',
            state.selectedIds.add(action.payload.id)
          );
          return {
            ...state,
            selectedIds: state.selectedIds.add(action.payload.id),
          };
        }
        default:
          return state;
      }
    },
    props,
    (initialProps) => {
      console.log('init');
      return {
        props: initialProps,
        selectedIds: new Set(initialProps.initialSelectedIds),
        mode: !!initialProps.mode,
      };
    }
  );

  const onClick = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      if (e.currentTarget instanceof HTMLElement) {
        const id = e.currentTarget.getAttribute('id');
        if (id) {
          dispatch({
            type: 'ON_CLICK_BUTTON',
            payload: {
              id,
            },
          });
        }
      }
    },
    [dispatch]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!(e.currentTarget instanceof HTMLElement)) {
        return;
      }
      const id = e.currentTarget.getAttribute('id');
      const { ids } = state.props;
      if (!id || ids.length < 2) {
        return;
      }

      const index = ids.findIndex(({ headerId }) => headerId === id);

      switch (e.key) {
        case KEYS.ARROW_DOWN:
        case KEYS.DOWN: {
          if (index === ids.length - 1) {
            document.getElementById(ids[0].headerId)?.focus();
          } else {
            document.getElementById(ids[index + 1].headerId)?.focus();
          }
          break;
        }
        case KEYS.ARROW_UP:
        case KEYS.UP: {
          if (index === 0) {
            document.getElementById(ids[ids.length - 1].headerId)?.focus();
          } else {
            document.getElementById(ids[index - 1].headerId)?.focus();
          }
          break;
        }
        case KEYS.HOME: {
          document.getElementById(ids[0].headerId)?.focus();
          break;
        }
        case KEYS.END: {
          document.getElementById(ids[ids.length - 1].headerId)?.focus();
          break;
        }
        default:
          break;
      }
    },
    [state, dispatch]
  );

  return {
    props: state.props.ids.reduce((acc, next) => {
      const isExpanded = state.selectedIds.has(next.headerId);
      const panelId = getPanelId(next);
      console.log;
      return {
        ...acc,
        [next.headerId]: {
          buttonProps: {
            'aria-controls': panelId,
            // 'aria-disabled'?: boolean;
            'aria-expanded': isExpanded,
            id: next.headerId,
            onClick,
            onKeyDown,
          },
          panelProps: {
            'aria-labelledby': next.headerId,
            hidden: !isExpanded,
            id: panelId,
            role: 'region' as const,
          },
        },
      };
    }, {}),
  };

  // const getProps = useCallback(
  //   (id: string) => {
  //     const isExpanded = state.selectedIds.has(id);
  //     const ids = state.idsById[id];
  //     const panelId = getPanelId(ids);

  //     return {
  //       buttonProps: {
  //         'aria-controls': panelId,
  //         // 'aria-disabled'?: boolean;
  //         'aria-expanded': isExpanded,
  //         id,
  //         onClick: () => {},
  //         onKeyDown: () => {},
  //       },
  //       panelProps: {
  //         'aria-labelledby': id,
  //         id: panelId,
  //         role: 'region' as const,
  //       },
  //     };
  //   },
  //   [state, dispatch]
  // );

  // return {
  //   getProps,
  // };
}

export default useAccordion;
