import { Label, Checkbox, CheckboxProps, XStack } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';

export function CheckboxWithLabel({
  label,
  ...checkboxProps
}: CheckboxProps & { label?: string }) {
  const id = `checkbox-${(label || '').toString().slice(1)}`;
  return (
    <XStack alignItems="center" gap="$2" width="100%">
      <Checkbox
        backgroundColor="#fff"
        id={id}
        {...checkboxProps}
      >
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <Label color="$color9" size="$3" htmlFor={id}>
        {label}
      </Label>
    </XStack>
  );
}
