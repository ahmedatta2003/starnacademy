import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Sticker } from 'lucide-react';

interface StickerPickerProps {
  onSelect: (item: string) => void;
}

// Kid-friendly emoji categories
const emojiCategories = {
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🦋', '🐛', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🐙', '🦑'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🍔', '🍟', '🍕', '🌭'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🎮', '🎰', '🧩', '🎨', '🎭', '🎪', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸'],
  stars: ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '🎁', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '👑', '💎', '💖', '💝', '💗', '💓', '💕', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💯', '✅', '👍', '👏', '🙌', '🤝', '💪', '🦾', '🧠', '👀', '🔥', '💥', '⚡', '🌈', '☀️', '🌙'],
  coding: ['💻', '🖥️', '⌨️', '🖱️', '💾', '💿', '📱', '📲', '🔌', '🔋', '🤖', '👾', '🎮', '🕹️', '📡', '🛰️', '🚀', '🛸', '🔬', '🔭', '📊', '📈', '📉', '🧮', '🔢', '➕', '➖', '✖️', '➗', '🔣', '🧪', '⚗️', '🧬', '🔮', '💡', '📐', '📏', '🗂️', '📁', '📂', '🗃️', '📚', '📖', '📝', '✏️']
};

// Custom stickers for kids (using emoji combinations as stickers)
const stickers = [
  { id: 'great_job', emoji: '🌟⭐🌟', label: 'عمل رائع!' },
  { id: 'rocket', emoji: '🚀✨', label: 'انطلق!' },
  { id: 'champion', emoji: '🏆👑', label: 'بطل!' },
  { id: 'love_code', emoji: '💻❤️', label: 'أحب البرمجة' },
  { id: 'thinking', emoji: '🤔💭', label: 'أفكر...' },
  { id: 'happy', emoji: '😄🎉', label: 'سعيد!' },
  { id: 'cool', emoji: '😎✌️', label: 'رائع!' },
  { id: 'study', emoji: '📚🤓', label: 'أدرس' },
  { id: 'celebrate', emoji: '🎊🥳🎉', label: 'احتفال!' },
  { id: 'thanks', emoji: '🙏💕', label: 'شكراً!' },
  { id: 'question', emoji: '❓🤷', label: 'سؤال' },
  { id: 'idea', emoji: '💡✨', label: 'فكرة!' },
  { id: 'gaming', emoji: '🎮🕹️', label: 'ألعاب' },
  { id: 'robot', emoji: '🤖⚡', label: 'روبوت' },
  { id: 'star_eyes', emoji: '🤩⭐', label: 'مذهل!' },
  { id: 'sleepy', emoji: '😴💤', label: 'نعسان' },
  { id: 'music', emoji: '🎵🎶', label: 'موسيقى' },
  { id: 'art', emoji: '🎨🖌️', label: 'فن' },
  { id: 'science', emoji: '🔬🧪', label: 'علوم' },
  { id: 'math', emoji: '🧮📐', label: 'رياضيات' },
  { id: 'high_five', emoji: '🙌✨', label: 'هاي فايف!' },
  { id: 'heart', emoji: '💖💝💗', label: 'حب' },
  { id: 'fire', emoji: '🔥💯', label: 'حماس!' },
  { id: 'rainbow', emoji: '🌈☀️', label: 'ألوان' },
];

const StickerPicker = ({ onSelect }: StickerPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Smile className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-card border-2 border-primary/20 shadow-xl" 
        align="start"
        side="top"
      >
        <Tabs defaultValue="stickers" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-muted/50 rounded-none border-b">
            <TabsTrigger value="stickers" className="gap-2 data-[state=active]:bg-primary/10">
              <Sticker className="w-4 h-4" />
              ملصقات
            </TabsTrigger>
            <TabsTrigger value="emoji" className="gap-2 data-[state=active]:bg-primary/10">
              <Smile className="w-4 h-4" />
              إيموجي
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stickers" className="p-3 m-0">
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {stickers.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => handleSelect(sticker.emoji)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-primary/10 transition-all duration-200 hover:scale-110 group"
                  title={sticker.label}
                >
                  <span className="text-2xl">{sticker.emoji}</span>
                  <span className="text-[10px] text-muted-foreground group-hover:text-primary mt-1 truncate w-full text-center">
                    {sticker.label}
                  </span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="emoji" className="m-0">
            <Tabs defaultValue="faces" className="w-full">
              <TabsList className="w-full flex overflow-x-auto bg-transparent border-b px-2 py-1 justify-start gap-1">
                <TabsTrigger value="faces" className="text-lg px-2 py-1 data-[state=active]:bg-primary/10 rounded">😀</TabsTrigger>
                <TabsTrigger value="animals" className="text-lg px-2 py-1 data-[state=active]:bg-primary/10 rounded">🐶</TabsTrigger>
                <TabsTrigger value="food" className="text-lg px-2 py-1 data-[state=active]:bg-primary/10 rounded">🍎</TabsTrigger>
                <TabsTrigger value="activities" className="text-lg px-2 py-1 data-[state=active]:bg-primary/10 rounded">⚽</TabsTrigger>
                <TabsTrigger value="stars" className="text-lg px-2 py-1 data-[state=active]:bg-primary/10 rounded">⭐</TabsTrigger>
                <TabsTrigger value="coding" className="text-lg px-2 py-1 data-[state=active]:bg-primary/10 rounded">💻</TabsTrigger>
              </TabsList>

              {Object.entries(emojiCategories).map(([category, emojis]) => (
                <TabsContent key={category} value={category} className="p-2 m-0">
                  <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelect(emoji)}
                        className="text-xl p-1 rounded hover:bg-primary/10 transition-all duration-200 hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default StickerPicker;
