import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const LANGUAGES = [
  { id: "english", name: "English" },
  { id: "hindi", name: "Hindi" },
  { id: "tamil", name: "Tamil" },
  { id: "telugu", name: "Telugu" },
  { id: "kannada", name: "Kannada" },
  { id: "malayalam", name: "Malayalam" },
  { id: "sanskrit", name: "Sanskrit" },
  { id: "marathi", name: "Marathi" },
];

interface LanguagesSelectorProps {
  value: string[];
  onChange: (languages: string[]) => void;
  className?: string;
}

export function LanguagesSelector({ value, onChange, className }: LanguagesSelectorProps) {
  const handleToggle = (languageId: string) => {
    const newValue = value.includes(languageId)
      ? value.filter((id) => id !== languageId)
      : [...value, languageId];
    onChange(newValue);
  };

  return (
    <div className={className}>
      <Label className="text-base">Languages Known</Label>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {LANGUAGES.map((language) => (
          <div key={language.id} className="flex items-center space-x-2">
            <Checkbox
              id={language.id}
              checked={value.includes(language.id)}
              onCheckedChange={() => handleToggle(language.id)}
            />
            <label
              htmlFor={language.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {language.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}