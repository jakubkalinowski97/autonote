import { H3, Text, styled, Button, Input, H4, TextArea } from 'tamagui';

export const Title = styled(H3, {
  name: 'Title',
  fontFamily: '$heading',
  marginBottom: '$3',
});

export const HeaderTitle = styled(H3, {
  name: 'HeaderTitle',
  fontFamily: '$heading',
  color: '$color10',
});

export const Subtitle = styled(H4, {
  name: 'Subtitle',
  fontFamily: '$heading',
  fontWeight: '200',
  fontSize: '$4',
  textTransform: 'lowercase',
  lineHeight: '$1',
});

export const Paragraph = styled(Text, {
  name: 'Paragraph',
  fontFamily: '$body',
  fontSize: '$5',
});

export const Link = styled(Button, {
  name: 'Link',
  fontFamily: '$body',
  color: '$accent10',
  chromeless: true,
  padding: 0,
  height: 'auto',
  cursor: 'pointer',
  fontSize: '$5',
});

export const StyledButton = styled(Button, {
  name: 'StyledButton',
  fontFamily: '$body',

  variants: {
    variant: {
      outlined: {
        color: '$color9',
      },
    },
  },
});

export const StyledInput = styled(Input, {
  name: 'StyledInput',
  backgroundColor: '#fff',
});

export const StyledTextArea = styled(TextArea, {
  name: 'StyledTextArea',
  backgroundColor: '#fff',
});