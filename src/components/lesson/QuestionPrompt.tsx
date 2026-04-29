type QuestionPromptProps = {
  text: string
}

const QuestionPrompt = ({ text }: QuestionPromptProps) => {
  return (
    <h1 className="mx-auto max-w-3xl text-left text-2xl font-medium leading-tight tracking-tight text-primary sm:text-[2rem]">
      {text}
    </h1>
  )
}

export default QuestionPrompt
