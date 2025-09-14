import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronsUpDown, Check, Plus } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'

const defaultModels = [
  { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
  { value: 'gpt-4o', label: 'gpt-4o' },
  { value: 'gpt-4.1-mini', label: 'gpt-4.1-mini' },
  { value: 'gpt-4.1', label: 'gpt-4.1' },
  { value: 'gpt-5-mini', label: 'gpt-5-mini' },
  { value: 'gpt-5', label: 'gpt-5' }
]

export function SelectModel({
  value,
  onChange,
  disabled,
  className
}: {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [models, setModels] = useState(defaultModels)
  const [searchValue, setSearchValue] = useState('')

  const addCustomModel = (newModel: string) => {
    const trimmed = newModel.trim()
    if (!trimmed) return
    const newValue = trimmed
    const exists = models.some((m) => m.value === newValue)
    if (exists) {
      onChange?.(newValue)
      setOpen(false)
      setSearchValue('')
      return
    }
    const item = { value: newValue, label: trimmed }
    setModels((prev) => [...prev, item])
    onChange?.(newValue)
    setSearchValue('')
    setOpen(false)
  }

  const filtered = models.filter((m) => m.label.toLowerCase().includes(searchValue.toLowerCase()))
  const showCreate =
    searchValue && !filtered.some((m) => m.label.toLowerCase() === searchValue.toLowerCase())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-60 justify-between', className)}
        >
          {value ? models.find((m) => m.value === value)?.label : '选择模型...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command>
          <CommandInput
            placeholder="输入以搜索或创建..."
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>未找到结果</CommandEmpty>
            <CommandGroup>
              {filtered.map((m) => (
                <CommandItem
                  key={m.value}
                  value={m.value}
                  onSelect={(current) => {
                    onChange?.(current === value ? '' : current)
                    setSearchValue('')
                    setOpen(false)
                  }}
                >
                  {m.label}
                  <Check
                    className={cn('ml-auto', value === m.value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
              {showCreate && (
                <CommandItem
                  value={`create-${searchValue}`}
                  onSelect={() => addCustomModel(searchValue)}
                  className="!text-blue-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  创建 “{searchValue}”
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
