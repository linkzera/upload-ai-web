import { api } from '@/lib/axios'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useEffect, useState } from 'react'

type Prompt = {
  id: string
  title: string
  template: string
}

interface PromptSelectProps {
  onPromptSelected: (prompt: string) => void
}

export function PromptSelect({ onPromptSelected }: PromptSelectProps) {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null)

  async function getPrompts() {
    const response = await api.get('/prompts')
    setPrompts(response.data)
  }

  useEffect(() => {
    getPrompts()
  }, [])

  return (
    <Select onValueChange={onPromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt" />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.template}>
            {prompt.title}
          </SelectItem>
        ))}
        <SelectItem value="tags" disabled>
          Mais opções em breve...
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
