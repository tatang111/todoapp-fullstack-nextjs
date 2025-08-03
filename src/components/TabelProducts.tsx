"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import axiosInstance from "@/lib/AxiosInstance";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import EditDialog from "./EditDialog";

export type Products = {
  id: number;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

const TabelProducts = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Products[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const products = await axiosInstance.get<Products[]>("/products");

      return products.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (idToDelete: number) => {
      await axiosInstance.delete(`/products/${idToDelete}`);
    },
    onSuccess: () => {
      toast.error("Successfully Deleting product");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <Table className="w-full text-center mt-2">
      <TableHeader>
        <TableRow className="bg-gray-200 rounded-lg">
          <TableHead className="text-center">No</TableHead>
          <TableHead className="text-center">Product Name</TableHead>
          <TableHead className="text-center">Price</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell className="space-x-1">
              <EditDialog name={product.name} id={product.id} createdAt={product.createdAt} price={product.price} updatedAt={product.updatedAt}  />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="cursor-pointer" variant={"destructive"}>
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-40 w-100">
                  <DialogHeader>
                    <DialogTitle>Sure to delete {product.name}</DialogTitle>
                  </DialogHeader>
                  <DialogFooter className="absolute right-4 bottom-4">
                    <Button
                      onClick={() => mutate(product.id)}
                      variant={"destructive"}
                    >
                      Delete
                    </Button>
                    <DialogClose asChild>
                      <Button>Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TabelProducts;
