import {
  KeyboardEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import { NAMESPACE, KEYS, generateId } from '../utils';

const COMPONENT = 'accordion';

interface Props {
  count: number;
  initialSelectedIndexes: number[];
  multiple?: boolean;
  toggleable?: boolean;
}

interface AccordionProps {
  'data-allow-multiple'?: boolean;
  'data-allow-toggle'?: boolean;
}

interface ButtonProps {
  'aria-controls': string;
  'aria-disabled'?: boolean;
  'aria-expanded': boolean;
  id: string;
  onClick: (e: SyntheticEvent<HTMLElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

interface PanelProps {
  'aria-labelledby': string;
  'aria-hidden': boolean;
  hidden: boolean;
  id: string;
  role: 'region';
}

interface Output {
  getAccordionProps: () => AccordionProps;
  getButtonProps: (props: { disabled?: boolean; index: number }) => ButtonProps;
  getPanelProps: (props: { index: number }) => PanelProps;
}

interface State {
  count: number;
  multiple: boolean;
  props: Props;
  selectedIndexes: Set<number>;
  toggleable: boolean;
}

type Actions =
  | {
      type: 'ON_CLICK_BUTTON';
      payload: {
        index: number;
      };
    }
  | {
      type: 'MERGE_STATE';
      payload: Partial<State>;
    };

type Reducer = (state: State, action: Actions) => State;

const getIndexFromId = (id: string) => {
  const split = id.split('_');
  return parseInt(split[split.length - 1], 10);
};

function useAccordion(props: Props): Output {
  const { count, multiple, toggleable } = props;
  const id = useRef(generateId());
  const getButtonId = useCallback(
    (index: number) =>
      `${NAMESPACE}_${COMPONENT}_${id.current}_button_${index}`,
    []
  );
  const getPanelId = useCallback(
    (index: number) => `${NAMESPACE}_${COMPONENT}_${id.current}_panel_${index}`,
    []
  );

  const [state, dispatch] = useReducer<Reducer, Props>(
    (state, action) => {
      switch (action.type) {
        case 'ON_CLICK_BUTTON': {
          const { index } = action.payload;
          const { multiple, selectedIndexes, toggleable } = state;
          const currentlyActive = selectedIndexes.has(index);
          if (multiple) {
            const fn = toggleable && currentlyActive ? 'delete' : 'add';
            selectedIndexes[fn](index);
            return {
              ...state,
              selectedIndexes: new Set(selectedIndexes),
            };
          }

          if (!toggleable) {
            return {
              ...state,
              selectedIndexes: new Set([index]),
            };
          }

          const fn = currentlyActive ? 'delete' : 'add';
          selectedIndexes[fn](index);
          return {
            ...state,
            selectedIndexes: new Set(selectedIndexes),
          };
        }
        case 'MERGE_STATE': {
          let { selectedIndexes } = state;
          if (
            state.multiple &&
            action.payload.multiple === false &&
            selectedIndexes.size
          ) {
            const lastIndex = Array.from(selectedIndexes).pop();
            selectedIndexes =
              typeof lastIndex === 'number'
                ? new Set([lastIndex])
                : selectedIndexes;
          }
          return {
            ...state,
            ...action.payload,
            selectedIndexes,
          };
        }
        default:
          return state;
      }
    },
    props,
    (initialProps) => {
      const {
        count,
        initialSelectedIndexes,
        multiple,
        toggleable,
      } = initialProps;
      return {
        count,
        multiple: Boolean(multiple),
        props: initialProps,
        selectedIndexes: new Set(
          multiple ? initialSelectedIndexes : initialSelectedIndexes.slice(0, 1)
        ),
        toggleable: Boolean(toggleable),
      };
    }
  );

  useEffect(() => {
    dispatch({
      type: 'MERGE_STATE',
      payload: {
        multiple,
        toggleable,
        count,
      },
    });
  }, [dispatch, multiple, toggleable, count]);

  const onClick = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      if (e.currentTarget instanceof HTMLElement) {
        const id = e.currentTarget.getAttribute('id');
        if (id) {
          const index = getIndexFromId(id);
          dispatch({
            type: 'ON_CLICK_BUTTON',
            payload: {
              index,
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
      const dataIndex = getIndexFromId(
        e.currentTarget.getAttribute('id') || ''
      );
      if (typeof dataIndex !== 'number') {
        return;
      }

      switch (e.key) {
        case KEYS.ARROW_DOWN:
        case KEYS.DOWN: {
          const countBaseZero = state.count - 1;
          const nextDataIndex = dataIndex + 1;
          const nextIndex = nextDataIndex > countBaseZero ? 0 : nextDataIndex;
          document.getElementById(getButtonId(nextIndex))?.focus();
          break;
        }
        case KEYS.ARROW_UP:
        case KEYS.UP: {
          const countBaseZero = state.count - 1;
          const nextDataIndex = dataIndex - 1;
          const nextIndex = nextDataIndex < 0 ? countBaseZero : nextDataIndex;
          document.getElementById(getButtonId(nextIndex))?.focus();
          break;
        }
        case KEYS.HOME: {
          document.getElementById(getButtonId(0))?.focus();
          break;
        }
        case KEYS.END: {
          const countBaseZero = state.count - 1;
          document.getElementById(getButtonId(countBaseZero))?.focus();
          break;
        }
        default:
          break;
      }
    },
    [state, dispatch]
  );

  return {
    getAccordionProps: () => ({
      'data-allow-multiple': state.multiple,
      'data-allow-toggle': state.toggleable,
    }),
    getButtonProps: ({ disabled, index }) => {
      return {
        'aria-controls': getPanelId(index),
        'aria-disabled': Boolean(disabled),
        'aria-expanded': state.selectedIndexes.has(index),
        id: getButtonId(index),
        onClick,
        onKeyDown,
      };
    },
    getPanelProps: ({ index }) => {
      const hidden = !state.selectedIndexes.has(index);
      return {
        'aria-labelledby': getButtonId(index),
        'aria-hidden': hidden,
        hidden,
        id: getPanelId(index),
        role: 'region' as const,
      };
    },
  };
}

export default useAccordion;
