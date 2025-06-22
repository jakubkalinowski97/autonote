import { Button, Form, H3, Input, Separator, Text, View } from 'tamagui'

export function Login() {
  return (
    <View flex={1} alignItems="center" justifyContent="center" padding="$4" space>
      <View alignItems="center" marginBottom="$4">
        <H3 fontFamily="$heading">Welcome Back</H3>
        <Text fontFamily="$body" color="$color10">Sign in to continue</Text>
      </View>

      <Form width="100%" gap="$3">
        <Input placeholder="Email" size="$4" />
        <Input placeholder="Password" size="$4" secureTextEntry />

        <Form.Trigger asChild>
          <Button theme="accent" size="$4">
            Sign In
          </Button>
        </Form.Trigger>
      </Form>

      <Separator width="100%" marginVertical="$4" />

      <Button
        theme="accent"
        variant="outlined"
        size="$4"
        width="100%"
        // icon={<GoogleIcon />}
      >
        Sign In with Google
      </Button>

      <Text fontFamily="$body" marginTop="$4">
        Don't have an account? <Text fontFamily="$body" color="$accent10">Sign Up</Text>
      </Text>
    </View>
  )
} 