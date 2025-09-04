import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import type { FormDataType } from "../types"

type ModalPopupType = {
    modalType: "Create" | "Edit"
    open: boolean
    setOpen: (open: boolean) => void,
    modalData: FormDataType | null,
    loadData: () => void
}

export function ModalPopup({modalType, open, setOpen, modalData, loadData}: ModalPopupType) {
    const [formData, setFormData] = useState<FormDataType>({
        title: "",
        description: "",
        dueDate: "",
        status: "",
    })


    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    async function handleCreate(formData: FormDataType) {
        await fetch("http://localhost:3000/task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
    }

    async function handleUpdate(formData: FormDataType) {
        await fetch(`http://localhost:3000/task/${modalData?.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (modalType === "Create") {
            await handleCreate(formData)
        }

        if (modalType === "Edit") {
            await handleUpdate(formData)
        }

        setOpen(false)
        loadData()
    }

    // Reset form if closed
    function handleOpenClose(val: boolean) {
        if (!val) {
            setFormData({
                title: "",
                description: "",
                dueDate: "",
                status: "",
            })
        } 

        setOpen(val)
    }

    // Set default data
    useEffect(() => {
        if (open && modalType === "Edit" && modalData) {
            setFormData({
                title: modalData.title || "",
                description: modalData.description || "",
                dueDate: modalData.dueDate || "",
                status: modalData.status || "",
            })
        } else if (open && modalType === "Create") {
            // reset for create
            setFormData({ title: "", description: "", dueDate: "", status: "" })
        }
    }, [open, modalType, modalData])


    return (
        <Dialog open={open} onOpenChange={handleOpenClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{modalType} Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="Title">Title</Label>
                            <Input 
                                id="title" 
                                name="title" 
                                onChange={handleChange} 
                                value={formData.title}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Input 
                                id="description" 
                                name="description"
                                onChange={handleChange} 
                                value={formData.description}  
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input 
                                id="dueDate" 
                                name="dueDate"
                                onChange={handleChange} 
                                value={formData.dueDate}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                onValueChange={(value) => setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    status: value,
                                }))}
                                value={formData.status}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="COMPLETE">Completed</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
