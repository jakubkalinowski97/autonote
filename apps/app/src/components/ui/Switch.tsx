import { Separator, Switch, Label, XStack, SizeTokens } from "tamagui";

export default function StyledSwitch({id, size, defaultChecked, label}: {id: string, size: SizeTokens, defaultChecked: boolean, label: string}) {
    return (
        <XStack gap="$3">
            <Label
                size={size}
                htmlFor={id}
            >
                {label}
            </Label>
            <Separator vertical />
            <Switch id={id} size={size} defaultChecked={defaultChecked}>
                <Switch.Thumb />
            </Switch>
        </XStack>
    );
}