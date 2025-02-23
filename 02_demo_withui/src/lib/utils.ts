import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface IGasPriceResponse {
  jsonrpc: string;
  id: number;
  result: {
    slow: {
      maxFeePerGas: `0x${string}`;
      maxPriorityFeePerGas: `0x${string}`;
    };
    standard: {
      maxFeePerGas: `0x${string}`;
      maxPriorityFeePerGas: `0x${string}`;
    };
    fast: {
      maxFeePerGas: `0x${string}`;
      maxPriorityFeePerGas: `0x${string}`;
    };
  };
}

export interface IFormValues {
  recipient: string
  amount: number
}