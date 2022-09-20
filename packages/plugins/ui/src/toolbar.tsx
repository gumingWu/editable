import { Tooltip, Provider, Trigger, Content } from '@radix-ui/react-tooltip'
import { FC, HTMLAttributes, ReactNode } from 'react'
import tw, { css, styled } from 'twin.macro'
import { Button, ButtonProps } from './button'
import { Dropdown, DropdownProps } from './dropdown'

export interface ToolbarButton extends ButtonProps {
  title?: ReactNode
  onToggle: () => void
}

const StyledButton = styled(Button)(({ active }: ToolbarButton) => [])

export const ToolbarButton: FC<ToolbarButton> = ({ title, children, onToggle, ...props }) => {
  const renderButton = () => (
    <Button onClick={onToggle} {...props}>
      {children}
    </Button>
  )

  return title ? (
    <Provider>
      <Tooltip>
        <Trigger asChild>{renderButton()}</Trigger>
        <Content>{title}</Content>
      </Tooltip>
    </Provider>
  ) : (
    renderButton()
  )
}

export interface ToolbarSeparator {}

export const ToolbarSeparator: FC<HTMLAttributes<HTMLDivElement>> = props => (
  <div tw="mr-2 ml-2 w-px bg-gray-200" {...props}>
    &nbsp;
  </div>
)

export interface ToolbarDropdown extends DropdownProps {
  onToggle: (value: string) => void
}

export const ToolbarDropdown: React.FC<ToolbarDropdown> = ({
  onToggle,
  defaultValue,
  ...props
}) => {
  return <Dropdown onValueChange={onToggle} {...props} />
}

interface Toolbar {
  Button: typeof ToolbarButton
  Dropdown: typeof ToolbarDropdown
  Separator: typeof ToolbarSeparator
}

const StyledToolbar = styled.div(() => [tw`text-gray-600 relative z-10 flex items-center gap-1`])

export const Toolbar: FC<HTMLAttributes<HTMLDivElement>> & Toolbar = StyledToolbar as any

Toolbar.Button = ToolbarButton
Toolbar.Dropdown = ToolbarDropdown
Toolbar.Separator = ToolbarSeparator