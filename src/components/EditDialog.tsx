"use client";

import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
    Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Products } from "./TabelProducts";

const addProductSchema = z.object({
  name: z.string().nonempty("Name is required"),
  price: z.number().min(1001, "Price must be greater than Rp.1000"),
});

type AddProductSchema = z.infer<typeof addProductSchema>;

const EditDialog = (product: Products) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (values: AddProductSchema) => {
      try {
        const products = await axios.put(
          `http://localhost:3000/products/${product.id}`,
          values
        );
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: () => {
      toast.success("Successfully Updating Product");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      form.reset();
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: product.name,
        price: product.price,
      })
    }
  }, [open, product, form])

  const { handleSubmit } = form;

  const onSubmit = handleSubmit((values) => {
    mutate(values);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-400 hover:bg-blue-500 transition duration-300 ease-in-out cursor-pointer">
          Edit
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
              <Button type="submit">Edit</Button>
              <DialogClose asChild>
                <Button type="button">Back</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
