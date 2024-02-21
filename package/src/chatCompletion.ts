import { ChatCompletionRequest, SupportedChatCompletionMessageParam, chatCompletion } from "ai-pay";
import { useCallback, useState } from "react";

export function useChatCompletion(
  modelConfig: Omit<ChatCompletionRequest, "messages"> = {
    model: "gpt-3.5-turbo",
  },
  debugErrors: boolean = false
): {
  loading: boolean;
  error: string | undefined;
  messages: SupportedChatCompletionMessageParam[];
  sendMessage: (messages: string) => void;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<SupportedChatCompletionMessageParam[]>([]);

  const sendMessage = useCallback(async (message: string) => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const newMessages: SupportedChatCompletionMessageParam[] = [
        ...messages,
        {
          role: "user",
          content: message,
        }
      ];
  
      setMessages(newMessages);
  
      const response = await chatCompletion({
        ...modelConfig,
        messages: newMessages,
      });
  
      setError(response.error);
  
      if (response.debugError && debugErrors) {
        console.error("ai-pay-react-chat debug error: ", response.debugError);
      }
  
      if (response.data) {
        newMessages.push({
          role: "assistant",
          content: response.data?.choices[0].message.content,
        });
  
        setMessages(newMessages);
      }
    } catch (e) {
      setError("Failed to send message to chat completion model");
    }
    
    setLoading(false);

  }, [setMessages, setError, setLoading, loading, messages]);

  return {
    loading,
    error,
    messages,
    sendMessage,
  };
}