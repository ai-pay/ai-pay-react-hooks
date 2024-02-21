# AI Pay React Hooks
This package provides react hooks to the official [ai-pay](https://www.npmjs.com/package/ai-pay) package

#### Examples
```typescript 
import { useSessionData } from "ai-pay-react-hooks"

const {
    sessionState, 
    browserExtensionInstalled,
} = useSessionData()
```

```typescript 
import { useIsBrowserExtensionInstalled } from "ai-pay-react-hooks"

const isBrowserExtensionInstalled = useIsBrowserExtensionInstalled()
```

```typescript 
import { useSessionState } from "ai-pay-react-hooks"

const sessionState = useSessionState()
```

```typescript 
import { useSessionId } from "ai-pay-react-hooks"

const sessionId = useSessionId()
```

```typescript 
import { useChatCompletion } from "ai-pay-react-hooks"

const {
    loading,
    error,
    messages,
    sendMessage,
} = useChatCompletion()
```

```typescript 
import { useChatCompletionStream } from "ai-pay-react-hooks"

const {
    loading,
    error,
    messages,
    streamingResponse,
    sendMessage,
} = useChatCompletionStream()
```
