import { H3, Text, styled, Button } from 'tamagui';

export const Title = styled(H3, {
  name: 'Title',
  fontFamily: '$heading',
  marginBottom: '$3',
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