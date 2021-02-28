# useAccordion

https://www.w3.org/TR/wai-aria-practices-1.1/#accordion

## Example Implementation

```typescript
import React from 'react';
import { useAccordion } from 'use-a11y';

interface Props {
  multiple: boolean;
  toggleable: boolean;
}

const Accordion = (props: Props) => {
  const { multiple, toggleable } = props;
  const { getAccordionProps, getButtonProps, getPanelProps } = useAccordion({
    count: 3,
    initialSelectedIndexes: [],
    multiple,
    toggleable,
  });

  return (
    <div id="accordionGroup" className="Accordion" {...getAccordionProps()}>
      <h3>
        <button className="Accordion-trigger" {...getButtonProps({ index: 0 })}>
          <span className="Accordion-title">
            Personal Information
            <span className="Accordion-icon"></span>
          </span>
        </button>
      </h3>

      <div className="Accordion-panel" {...getPanelProps({ index: 0 })}>
        <div>
          <fieldset>
            <p>
              <label htmlFor="cufc1">
                Name
                <span aria-hidden="true">*</span>:
              </label>
              <input
                type="text"
                value=""
                name="Name"
                id="cufc1"
                className="required"
                aria-required="true"
              />
            </p>
            <p>
              <label htmlFor="cufc2">
                Email
                <span aria-hidden="true">*</span>:
              </label>
              <input
                type="text"
                value=""
                name="Email"
                id="cufc2"
                aria-required="true"
              />
            </p>
            <p>
              <label htmlFor="cufc3">Phone:</label>
              <input type="text" value="" name="Phone" id="cufc3" />
            </p>
            <p>
              <label htmlFor="cufc4">Extension:</label>
              <input type="text" value="" name="Ext" id="cufc4" />
            </p>
            <p>
              <label htmlFor="cufc5">Country:</label>
              <input type="text" value="" name="Country" id="cufc5" />
            </p>
            <p>
              <label htmlFor="cufc6">City/Province:</label>
              <input type="text" value="" name="City_Province" id="cufc6" />
            </p>
          </fieldset>
        </div>
      </div>
      <h3>
        <button className="Accordion-trigger" {...getButtonProps({ index: 1 })}>
          <span className="Accordion-title">
            Billing Address
            <span className="Accordion-icon"></span>
          </span>
        </button>
      </h3>
      <div className="Accordion-panel" {...getPanelProps({ index: 1 })}>
        <div>
          <fieldset>
            <p>
              <label htmlFor="b-add1">Address 1:</label>
              <input type="text" name="b-add1" id="b-add1" />
            </p>
            <p>
              <label htmlFor="b-add2">Address 2:</label>
              <input type="text" name="b-add2" id="b-add2" />
            </p>
            <p>
              <label htmlFor="b-city">City:</label>
              <input type="text" name="b-city" id="b-city" />
            </p>
            <p>
              <label htmlFor="b-state">State:</label>
              <input type="text" name="b-state" id="b-state" />
            </p>
            <p>
              <label htmlFor="b-zip">Zip Code:</label>
              <input type="text" name="b-zip" id="b-zip" />
            </p>
          </fieldset>
        </div>
      </div>
      <h3>
        <button className="Accordion-trigger" {...getButtonProps({ index: 2 })}>
          <span className="Accordion-title">
            Shipping Address
            <span className="Accordion-icon"></span>
          </span>
        </button>
      </h3>
      <div className="Accordion-panel" {...getPanelProps({ index: 2 })}>
        <div>
          <fieldset>
            <p>
              <label htmlFor="m-add1">Address 1:</label>
              <input type="text" name="m-add1" id="m-add1" />
            </p>
            <p>
              <label htmlFor="m-add2">Address 2:</label>
              <input type="text" name="m-add2" id="m-add2" />
            </p>
            <p>
              <label htmlFor="m-city">City:</label>
              <input type="text" name="m-city" id="m-city" />
            </p>
            <p>
              <label htmlFor="m-state">State:</label>
              <input type="text" name="m-state" id="m-state" />
            </p>
            <p>
              <label htmlFor="m-zip">Zip Code:</label>
              <input type="text" name="m-zip" id="m-zip" />
            </p>
          </fieldset>
        </div>
      </div>
    </div>
  );
};
```

## Props

### count

> `number` | _required_

The number of accordion header/panel elements to be rendered.

### initialSelectedIndexes

> `number[]`: _optional_

The initially opened indexes.

### multiple

> `boolean`: _optional_

Configuration to which allows multiple accordion panels to be open at once.

### toggleable

> `boolean`: _optional_

Configuration to which allows opened panels to be closed.
