import { useSessionData, useChatCompletionStream } from "ai-pay-react-hooks"

function App() {
  const {
    sessionState, 
    browserExtensionInstalled,
  } = useSessionData()

  const {
    loading,
    error,
    messages,
    streamingResponse,
    sendMessage,
  } = useChatCompletionStream()

  if (!browserExtensionInstalled) {
    return <h1 className="bg-gray-400 h-0 w-screen text-center items-center py-[50vh] text-4xl font-sans font-semibold">
      Browser extension not installed
    </h1>
  }

  if (sessionState !== "ACTIVE") {
    return <h1 className="bg-gray-400 h-0 w-screen text-center items-center py-[50vh] text-4xl font-sans font-semibold">
      Session not active. Start an AI Pay session to use this web app.
    </h1>
  }

  return <div className="bg-gray-400 h-screen w-screen flex flex-col gap-2 justify-center items-center overflow-y-scroll">
    {messages.map((message, index) => {
      if (typeof message.content === "string") {
        return <div
          className="bg-white p-2 m-2 rounded-lg"
          key={index}>{message.role}: {message.content}</div>
      }
      return <div key={index}>error</div>
    })}
    {streamingResponse !== undefined && <div
      className="bg-white p-2 m-2 rounded-lg"
    >{streamingResponse}</div>}
    {loading && <div
      className="bg-blue-500 p-2 m-2 rounded-lg"
    >Loading response...</div>}
    {error && <div
      className="bg-red-500 p-2 m-2 rounded-lg"
    >Error: {error}</div>}
    <div>
      <input 
        className="bg-white p-2 m-2 rounded-lg"
        type="text" 
        placeholder="Type a message" 
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(e.currentTarget.value)
            e.currentTarget.value = ""
          }
        }}
      />
        "Enter" to send message
    </div>
  </div>
}

export default App
