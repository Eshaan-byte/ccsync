import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface TagSelectorProps {
  selectedTags: string[];
  availableTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagSelector({
  selectedTags,
  availableTags,
  onTagsChange,
  placeholder = 'Add a tag',
  className = '',
}: TagSelectorProps) {
  const [tagInput, setTagInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tagInput.trim()) {
      const filtered = availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setFilteredTags(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      const unselected = availableTags.filter(
        (tag) => !selectedTags.includes(tag)
      );
      setFilteredTags(unselected);
      setShowDropdown(false);
    }
  }, [tagInput, availableTags, selectedTags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      onTagsChange([...selectedTags, trimmedTag]);
      setTagInput('');
      setShowDropdown(false);
      inputRef.current?.focus();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTags.length > 0) {
        handleAddTag(filteredTags[0]);
      } else if (tagInput.trim()) {
        handleAddTag(tagInput);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleInputFocus = () => {
    if (availableTags.length > 0) {
      const unselected = availableTags.filter(
        (tag) => !selectedTags.includes(tag)
      );
      setFilteredTags(unselected);
      setShowDropdown(unselected.length > 0);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={tagInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        className="col-span-3"
      />

      {showDropdown && filteredTags.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredTags.map((tag, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-sm"
              onClick={() => handleAddTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              <span>{tag}</span>
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={() => handleRemoveTag(tag)}
              >
                ✖
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
