type QuestionPromptProps = {
  text: string
}

const QuestionPrompt = ({ text }: QuestionPromptProps) => {
  return <h1 className="text-center text-xl font-medium text-primary sm:text-2xl">{text}</h1>
}

export default QuestionPrompt
