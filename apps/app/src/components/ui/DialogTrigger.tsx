import { AlertDialog, Button, XStack, YStack } from 'tamagui';

export function DialogTrigger({
  title,
  description,
  onAccept,
  onCancel,
  cancelText,
  acceptText,
  children,
}: {
  title: string;
  description: string;
  onAccept: () => void;
  onCancel: () => void;
  cancelText: string;
  acceptText: string;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>
        {children}
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          backgroundColor="rgba(0, 0, 0, 0.5)"
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          width="90%"
        >
          <YStack gap="$4">
            <AlertDialog.Title fontSize={'$6'}>{title}</AlertDialog.Title>
            <AlertDialog.Description>
              {description}
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button onPress={onCancel}>{cancelText}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="accent" onPress={onAccept}>
                  {acceptText}
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
