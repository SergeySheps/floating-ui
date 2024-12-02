import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';

import {useRightClick, useFloating, useInteractions} from '../../src';
import type {UseRightClickProps} from '../../src/hooks/useRightClick';

function App({
  button = true,
  typeable = false,
  initialOpen = false,
  ...props
}: UseRightClickProps & {
  button?: boolean;
  typeable?: boolean;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const {refs, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useRightClick(context, props),
  ]);

  const Tag = typeable ? 'input' : button ? 'button' : 'div';

  return (
    <>
      <Tag
        {...getReferenceProps({ref: refs.setReference})}
        data-testid="reference"
      />
      {open && (
        <div role="tooltip" {...getFloatingProps({ref: refs.setFloating})} />
      )}
    </>
  );
}

describe('default', () => {
  test('changes `open` state to `true` after right-click', () => {
    render(<App />);
    const button = screen.getByRole('button');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.contextMenu(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('changes `open` state to `false` after two right-clicks', () => {
    render(<App />);
    const button = screen.getByRole('button');

    fireEvent.contextMenu(button);
    fireEvent.contextMenu(button);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

describe('`toggle` prop', () => {
  test('changes `open` state to `true` after right-click', () => {
    render(<App toggle={false} />);
    const button = screen.getByRole('button');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.contextMenu(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('`open` state remains `true` after two right-clicks', () => {
    render(<App toggle={false} />);
    const button = screen.getByRole('button');

    fireEvent.contextMenu(button);
    fireEvent.contextMenu(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('`open` state becomes `false` after clicking when initially open', () => {
    render(<App initialOpen={true} />);
    const button = screen.getByRole('button');

    fireEvent.contextMenu(button);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

test('reason string', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);
    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange(isOpen, _, reason) {
        setIsOpen(isOpen);
        expect(reason).toBe('right-click');
      },
    });

    const rightClick = useRightClick(context);
    const {getReferenceProps, getFloatingProps} = useInteractions([rightClick]);

    return (
      <>
        <button ref={refs.setReference} {...getReferenceProps()} />
        {isOpen && (
          <div role="tooltip" ref={refs.setFloating} {...getFloatingProps()} />
        )}
      </>
    );
  }

  render(<App />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  await act(async () => {});
  fireEvent.click(button);
});
