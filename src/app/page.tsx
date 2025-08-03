"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import TabelProducts from "@/components/TabelProducts";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const addProductSchema = z.object({
  name: z.string().nonempty("Name is required"),
  price: z.number().min(1001, "Price must be greater than Rp.1000"),
});

type AddProductSchema = z.infer<typeof addProductSchema>;

export default function Home() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      price: 1000,
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (values: AddProductSchema) => {
      try {
        const products = await axios.post(
          "http://localhost:3000/products",
          values
        );
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: () => {
      toast.success("Successfully Adding Product");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      form.reset();
    },
  });

  const { handleSubmit } = form;

  const onSubmit = handleSubmit((values) => {
    mutate(values);
  });

  return (
    <div className="mx-50 py-4 h-screen ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-emerald-400 cursor-pointer hover:bg-green-500 transition duration-300 ease-in-out">
            Add New
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter product price"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add</Button>
                <DialogClose asChild>
                  <Button type="button">Back</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <TabelProducts />
    </div>
  );
}
