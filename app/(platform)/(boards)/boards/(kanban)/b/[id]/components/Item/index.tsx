import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React, { useEffect, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { CalendarIcon, FileText, MoreHorizontal, Text, X, Trash2, Tags, CheckCircle2, MoreVertical, SquareCheck } from 'lucide-react';
import { Item, Label } from '../../types';
import { Select, SelectTrigger } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet"
import { useDebounce } from '@/hooks/useDebounce';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { TagsSelect } from './TagSelect';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from "sonner"
import SubList from './Sublist';


type ItemsType = {
  id: UniqueIdentifier | string;
  item: Item | null;
  title: string;
  onEditItem: (id: UniqueIdentifier | string, title: any) => void;
  onDeleteItem: (id: UniqueIdentifier | string) => void;
  labelColor?: string;
  isPlaceholder?: boolean;
  dueDate?: string;
  status?: string;
};

const Items = (
  { id,
    title,
    onEditItem,
    onDeleteItem,
    labelColor,
    isPlaceholder,
    item,
    dueDate,
    status
  }: ItemsType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  });


  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  if (isPlaceholder) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        className="h-0 order-first"
      ></div>
    )
  }


  return (
    <>
      <SheetDemo
        open={open}
        setOpen={el => setOpen(el)}
        item={item}
        onEditItem={onEditItem}
        onDeleteItem={onDeleteItem}
        id={id}
      />

      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
        }}
        className={clsx(
          `bg-white shadow-sm rounded border w-full hover:ring-blue-500/40 hover:ring-2 cursor-pointer `,
          isDragging && 'opacity-50 ring-2 ring-rose-400'
        )}
      >
        {isEditing ?
          <div></div>
          :
          <>
            <div className={`px-2 py-4 flex items-center justify-between text-sm ${item?.labelColor}`} onClick={el => setOpen(true)}>
              <div className="flex flex-col gap-2 w-full">
                <h3 className={`text-[15px]`}>
                  {item?.title} {item?.labelColor}
                </h3>
                <div className="flex items-center flex-wrap">
                  {
                    item?.member && (
                      <div className="rounded-full bg-rose-600 w-7 h-7 flex justify-center items-center mr-2">
                        <div className="text-white">
                          {item?.member?.name?.split(' ')[0].charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )
                  }
                  {
                    (item?.status && item?.status != 'default') && (
                      <div className="flex items-center gap-1 text-gray-400 capitalize mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <g clipPath="url(#clip0_607_9)">
                            <path
                              fill="#6E6E6E"
                              fillRule="evenodd"
                              d="M11.956 5.275A6 6 0 01.868 9.109a.563.563 0 01.962-.584 4.875 4.875 0 106.691-6.697.563.563 0 01.582-.963 6 6 0 012.853 4.41zM6.75.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-4.647 3a.75.75 0 10-1.294-.759.75.75 0 001.294.759zM.75 5.25a.75.75 0 110 1.5.75.75 0 010-1.5zm3-3.147A.75.75 0 103.008.799a.75.75 0 00.742 1.304z"
                              clipRule="evenodd"
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_607_9">
                              <path fill="#fff" d="M0 0H12V12H0z"></path>
                            </clipPath>
                          </defs>
                        </svg>
                        <span className="text-xs">
                          {item?.status}
                        </span>
                      </div>
                    )
                  }
                  {
                    item?.description &&
                    <div className='text-gray-400 mr-2'>
                      <div className='flex items-center gap-1 text-[13px]'>
                        <FileText width={14} />
                        <span>
                          Description
                        </span>
                      </div>
                    </div>
                  }

                  {
                    (item?.taskList && item?.taskList.length > 0) && 
                    <div className='text-gray-400 mr-2'>
                      <div className='flex items-center gap-1 text-[13px]'>
                        <SquareCheck width={14}/>
                        <span>
                          {item?.taskList.filter((el:any) => el.done).length}/{item?.taskList.length}
                        </span>
                      </div>
                    </div>
                  }

                  {dueDate && (
                    <label className='text-gray-400 text-[13px] flex gap-1 items-center mr-2'>
                      <CalendarIcon width={14} />
                       { dueDate?.split('T')[0] }
                    </label>
                  )
                  }

                  <div className="tag flex items-center gap-1 flex-wrap">
                    {
                      item?.labels?.map((label) => {
                        return (
                          <label key={`label-${label.id}`} className={`bg-${label.color}-200 text-${label.color}-800 text-[13px] px-3 rounded capitalize border border-${label.color}-400`}>
                            {label.title}
                          </label>
                        )
                      })
                    }
                    {/*
                  item?.labelColor ?
                    <label className='bg-sky-200 text-sky-800 text-[13px] px-3 rounded capitalize border border-sky-400'>
                      {item.labelColor}
                    </label>
                  : <></>*/
                    }

                  </div>
                </div>
              </div>
              <button
                className="text-xs rounded-xl "
                onClick={() => {
                  //setIsEditing(true);
                }}>
                <MoreHorizontal className={'opacity-40 hover:opacity-100'} height={20} />
              </button>
            </div>
          </>
        }
      </div >
    </>
  );
};


type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: Item | null;
  onEditItem: (id: UniqueIdentifier | string, title: any) => void;
  onDeleteItem: (id: UniqueIdentifier | string) => void;
  id: UniqueIdentifier | string;

}


function SheetDemo({ open, setOpen, item, onEditItem, onDeleteItem, id }: Props) {

  const [editTitle, setEditTitle] = useState(false)
  const [editDescription, setEditDescription] = useState(false)

  const [updatedItem, setUpdatedItem] = useState<any>(item);

  const val = useDebounce(updatedItem, 1000)

  useEffect(() => {
    onEditItem(id, updatedItem);
  }, [val])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="md:min-w-[500px] pt-3">
        <SheetHeader className=''>
          <div className="text-sm font-medium flex items-center justify-end mt-[5px] mr-3">
            <div className="border-r">
              <div className="mr-1 cursor-pointer">
                <ItemDropdownMenu onDelete={() => {
                  onDeleteItem(id)
                  toast.success("Item has been deleted", {
                    action: {
                      label: "done",
                      onClick: () => console.log("Undo"),
                    },
                  })
                }} />
              </div>
            </div>
          </div>
        </SheetHeader>
        <div>
          <div className='min-h-12 flex items-center'>

            {
              !editTitle ? (
                <h2
                  onClick={() => { setEditTitle(true) }}
                  className='font-semibold text-xl px-2 py-1'>{updatedItem?.title}</h2>
              ) :
                <>
                  <input
                    type="text"
                    className="w-full h-full bg-transparent outline-none ring-2 ring-rose-400/40 rounded px-2 py-1 text-xl"
                    value={updatedItem?.title}
                    autoFocus
                    onChange={(e) => {
                      //if key is enter the, change setEditTitle to false
                      const newItem = { ...item }
                      newItem.title = e.target.value;
                      setUpdatedItem(newItem);
                    }}
                    onBlur={() => {
                      setEditTitle(false);

                    }} />
                </>
            }
          </div>

          <div className="flex items-center flex-wrap my-2 gap-2">
            <LabelSelect setUpdatedItem={setUpdatedItem} colorValue={updatedItem?.labelColor} updatedItem={updatedItem} />
            <StatusSelect setUpdatedItem={setUpdatedItem} statusValue={updatedItem?.status} updatedItem={updatedItem} />
            <DateSelect setUpdatedItem={setUpdatedItem} dateValue={updatedItem?.dueDate} updatedItem={updatedItem} />
            <TagsSelect setUpdatedItem={setUpdatedItem} labelsValue={updatedItem?.labels} updatedItem={updatedItem} />
          </div>
          
          <div>
            <div className="px-2 py-1 text-sm flex items-start mt-1" >
              <div className="mr-2">
                <Text width={16} />
              </div>
              {
                editDescription ? (
                  <textarea
                    className="w-full block min-h-30 bg-transparent outline-none ring-2 ring-rose-400/40 rounded px-2 py-1 text-sm" value={updatedItem?.description}
                    autoFocus
                    rows={7}
                    onBlur={() => {
                      setEditDescription(false);
                    }}
                    onChange={(e) => {
                      const newItem = { ...item }
                      newItem.description = e.target.value;
                      setUpdatedItem(newItem);
                    }} />
                ) : (
                  <div className="" onClick={() => { setEditDescription(true) }} dangerouslySetInnerHTML={{
                    __html: updatedItem?.description ? updatedItem?.description?.replaceAll('\n','<br/>') : '<span class="text-slate-500">Add a description (optional)</span>'
                  }} >
                  </div>
                )
              }
            </div>
          </div>

          {
            <SubList setUpdatedItem={setUpdatedItem} taskListElement={updatedItem.taskList}  updatedItem={updatedItem} />
          }
          {
            /*
          <div>
            <SelectDemo label={updatedItem?.labelColor}
              onChangeLabel={(label) => {
                const newItem = { ...item }
                newItem.labelColor = label;
                setUpdatedItem(newItem);
              }} />
          </div>
          <div className="py-2 px-2 bg-black rounded text-white"
            onClick={() => {
              //setIsEditing(false);
            }}>
            Save
          </div>
          <div className="">
            <button className="py-2 px-2 bg-black rounded text-white"
              onClick={() => {
                //setIsEditing(false);
                onDeleteItem(id);

              }}>
              Delete
            </button>
          </div>
                */
          }
        </div>
      </SheetContent>
    </Sheet>
  )
}


const COLOR = [
  { name: 'high-red', color: 'bg-red-700' },
  { name: 'red', color: 'bg-red-500' },
  { name: 'low-red', color: 'bg-red-300' },
  { name: 'high-sky', color: 'bg-sky-700' },
  { name: 'sky', color: 'bg-sky-500' },
  { name: 'low-sky', color: 'bg-sky-300' },
  { name: 'high-green', color: 'bg-green-700' },
  { name: 'green', color: 'bg-green-500' },
  { name: 'low-green', color: 'bg-green-300' },
  { name: 'yellow', color: 'bg-yellow-500' },
  { name: 'indigo', color: 'bg-indigo-500' },
  { name: 'pink', color: 'bg-pink-500' },
  { name: 'purple', color: 'bg-purple-500' },
  { name: 'gray', color: 'bg-gray-500' },
  { name: 'teal', color: 'bg-teal-500' },
  { name: 'blue', color: 'bg-blue-500' },
  { name: 'rose', color: 'bg-rose-500' },
]


const LabelSelect = ({ setUpdatedItem, colorValue, updatedItem }: { setUpdatedItem: any, colorValue: any, updatedItem: any }) => {
  const [selectedColor, setSelectedColor] = useState(colorValue)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-sm text-muted-foreground mr-2">
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className={`w-[25px] h-[12px] rounded-md ${selectedColor ? selectedColor : 'bg-gray-200'} border-w-1 ml-2 mr-2`}></span>
          <span>Color</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-2'>
        <div className="grid grid-cols-3 gap-2">
          {COLOR.map((color, index) => {
            return (
              <div
                key={`colorLabel-${index}`}
                className={`h-5 rounded ${color.color} pointer ${selectedColor === color.color && 'ring'}`}
                onClick={() => {
                  setSelectedColor(color.color)
                  setUpdatedItem({ ...updatedItem, labelColor: color.color })
                }}
              >
              </div>
            )
          })}
          <div
            className={`h-5 rounded pointer flex items-center overflow-hidden border ${(selectedColor == null || !selectedColor) && 'ring'}`}
            onClick={() => {
              setSelectedColor('')
              setUpdatedItem({ ...updatedItem, labelColor: '' })
            }}>
            <div className="bg-red-500 h-[2px] w-7 rotate-45">
            </div>
          </div>

        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const STATUS_OPTIONS = [
  { value: 'default', label: 'No define' },
  { value: 'pending', label: 'Pending' },
  { value: 'progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

const StatusSelect = ({ setUpdatedItem, statusValue, updatedItem }: { setUpdatedItem: any, statusValue: any, updatedItem: any }) => {
  const [status, setStatus] = useState(statusValue || 'default')

  const handleOnChange = (el: string) => {
    console.log('Updated item ', updatedItem)
    setStatus(el)
    setUpdatedItem({ ...updatedItem, status: el })
  }

  return (
    <Select value={status} defaultValue='default' onValueChange={(el) => handleOnChange(el)}>
      <SelectTrigger className="w-[110px] text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="ml-1 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 12 12"
            >
              <g clipPath="url(#clip0_607_9)">
                <path
                  fill="#6E6E6E"
                  fillRule="evenodd"
                  d="M11.956 5.275A6 6 0 01.868 9.109a.563.563 0 01.962-.584 4.875 4.875 0 106.691-6.697.563.563 0 01.582-.963 6 6 0 012.853 4.41zM6.75.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-4.647 3a.75.75 0 10-1.294-.759.75.75 0 001.294.759zM.75 5.25a.75.75 0 110 1.5.75.75 0 010-1.5zm3-3.147A.75.75 0 103.008.799a.75.75 0 00.742 1.304z"
                  clipRule="evenodd"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_607_9">
                  <path fill="#fff" d="M0 0H12V12H0z"></path>
                </clipPath>
              </defs>
            </svg>
          </div>
          <SelectValue placeholder="Status" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {
          STATUS_OPTIONS.map((option, index) => {
            return (
              <SelectItem key={`${option.value}-${index}`} value={option.value}>{option.label}</SelectItem>
            )
          }
          )}
      </SelectContent>
    </Select>
  )
}


const DateSelect = ({ setUpdatedItem, dateValue, updatedItem }: { setUpdatedItem: any, dateValue: any, updatedItem: any }) => {
  const [date, setDate] = React.useState<Date>(dateValue)

  const handleOnChange = (el: Date | undefined) => {
    if (!el) return;
    console.log('Updated item ', updatedItem)
    setDate(el)
    setUpdatedItem({ ...updatedItem, dueDate: el })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "min-w-[110px] text-sm flex items-center br-1",
            !date && "text-muted-foreground"
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => handleOnChange(newDate)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

const ItemDropdownMenu = ({ onDelete }: { onDelete: any }) => {
  const [showStatusBar, setShowStatusBar] = React.useState(true)
  const [showActivityBar, setShowActivityBar] = React.useState(false)
  const [showPanel, setShowPanel] = React.useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="">
          <MoreVertical size={18} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          className='text-red-700 hover:text-red-700 text-sm gap-2'
          onClick={onDelete}
        >
          <Trash2 size={16} />
          <span>
            Delete item
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export default Items;
