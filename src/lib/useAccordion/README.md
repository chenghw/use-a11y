# useAccordion

https://www.w3.org/TR/wai-aria-practices-1.1/#accordion

## Spec

```typescript
interface Props {
  initialSelectedItems: string[] | number[];
  multiple?: boolean;
  toggleable?: boolean;
}

interface AccordionProps {
  data-allow-multiple?: boolean;
  data-allow-toggle?: boolean;
}

interface ButtonProps {
  aria-controls: string;
  aria-expanded: boolean;
  aria-disabled?: boolean;
  onClick: () => void;
  onKeyDown: () => void;
}

interface PanelProps {
  aria-labelledby: string;
  role: 'region';
}

interface Output {
  getProps: () => AccordionProps;
  getButtonProps: (props: { disabled?: boolean; index: number }) => ButtonProps;
  getPanelProps: (props: { index: number }) => PanelProps;
}

function useAccordion(props: Props): Output
```