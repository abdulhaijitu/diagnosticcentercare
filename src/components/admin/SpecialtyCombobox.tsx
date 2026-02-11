import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, ChevronsUpDown, Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecialtyComboboxProps {
  value: string;
  onChange: (value: string) => void;
  specialties: string[];
  onSpecialtiesChange: (specialties: string[]) => void;
}

export function SpecialtyCombobox({
  value,
  onChange,
  specialties,
  onSpecialtiesChange,
}: SpecialtyComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Add new
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");

  // Edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState("");
  const [editValue, setEditValue] = useState("");

  // Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingSpecialty, setDeletingSpecialty] = useState("");

  const filtered = useMemo(() => {
    if (!search) return specialties;
    return specialties.filter((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    );
  }, [specialties, search]);

  const handleAdd = () => {
    const trimmed = newSpecialty.trim();
    if (trimmed && !specialties.includes(trimmed)) {
      onSpecialtiesChange([...specialties, trimmed].sort());
      onChange(trimmed);
      setNewSpecialty("");
      setIsAddOpen(false);
    }
  };

  const handleEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== editingSpecialty) {
      const updated = specialties.map((s) =>
        s === editingSpecialty ? trimmed : s
      ).sort();
      onSpecialtiesChange(updated);
      if (value === editingSpecialty) onChange(trimmed);
      setIsEditOpen(false);
    }
  };

  const handleDelete = () => {
    const updated = specialties.filter((s) => s !== deletingSpecialty);
    onSpecialtiesChange(updated);
    if (value === deletingSpecialty) onChange("");
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value || "বিশেষত্ব নির্বাচন করুন..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="সার্চ করুন..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>কোনো ফলাফল নেই</CommandEmpty>
              <CommandGroup>
                {filtered.map((s) => (
                  <CommandItem
                    key={s}
                    value={s}
                    onSelect={() => {
                      onChange(s);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === s ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {s}
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="p-1 rounded hover:bg-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSpecialty(s);
                          setEditValue(s);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3 text-muted-foreground" />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingSpecialty(s);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setIsAddOpen(true);
                    setOpen(false);
                  }}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  নতুন ক্যাটাগরি যোগ করুন
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>নতুন বিশেষত্ব যোগ করুন</DialogTitle>
          </DialogHeader>
          <Input
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            placeholder="বিশেষত্বের নাম লিখুন"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>বাতিল</Button>
            <Button onClick={handleAdd}>যোগ করুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>বিশেষত্ব সম্পাদনা করুন</DialogTitle>
          </DialogHeader>
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEdit()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>বাতিল</Button>
            <Button onClick={handleEdit}>সংরক্ষণ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>নিশ্চিত করুন</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingSpecialty}" ক্যাটাগরিটি মুছে ফেলতে চান?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
