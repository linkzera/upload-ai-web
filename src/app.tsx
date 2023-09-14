import { Github, Wand2 } from 'lucide-react'
import { Button } from './components/ui/button'
import { Separator } from './components/ui/separator'
import { Textarea } from './components/ui/textarea'
import { VideoInputForm } from './components/video-input-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'
import { Slider } from './components/ui/slider'
import { Label } from './components/ui/label'
import { PromptSelect } from './components/prompt-select'

export function App() {
  function handlePromptSelected(prompt: string) {
    console.log('prompt', prompt)
  }

  return (
    <section className="min-h-screen flex flex-col">
      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com ❤️ por{' '}
            <a
              href="https://github.com/linkzera"
              target="_blank"
              rel="noopener noreferrer"
            >
              @linkzera
            </a>
          </span>

          <Separator orientation="vertical" className="h-6" />

          <a
            href="https://github.com/linkzera/upload-ai-web"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <Github className="w-4 h-4 mr-2" />
              Github
            </Button>
          </a>
        </div>
      </header>

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              placeholder="Inclua o prompt para a IA..."
              className="resize-none p-5 leading-relaxed"
            />
            <Textarea
              readOnly
              placeholder="Resultado gerado pela IA..."
              className="resize-none p-5 leading-relaxed"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável{' '}
            <code className="text-violet-400">{'{transcription}'}</code> no seu
            prompt para adicionar o conteúdo da transcrição do vídeo
            selecionado.
          </p>
        </div>

        <aside className="w-80 space-y-6">
          <VideoInputForm />

          <Separator />

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <PromptSelect onPromptSelected={handlePromptSelected} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT-3.5-turbo 16k</SelectItem>
                  <SelectItem value="gpt4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar essa opção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label htmlFor="temperature">Temperatura</Label>
              <Slider defaultValue={[0.5]} min={0} max={1} step={0.1} />
              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos geram resultados mais criativos, mas menos
                precisos
              </span>
            </div>

            <Separator />

            <Button type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </section>
  )
}
